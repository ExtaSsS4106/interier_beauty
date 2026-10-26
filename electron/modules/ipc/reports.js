/* Отчёты и статистика (задание №14): сводка, дашборд главной страницы,
   выбор папки, показ файла в проводнике и генерация Excel (.xlsx). */

const { ipcMain, dialog, shell, BrowserWindow } = require('electron');
const fs = require('fs/promises');
const path = require('path');

const booking = require('../booking.js');
const xlsx = require('../xlsx.js');
const {
    guard, models, toJson, appointmentInclude,
} = require('./context.js');
const { currentSession } = require('../state.js');

function registerReportsIpc() {
    // Отчёт: количество оказанных услуг и выручка за период.
    ipcMain.handle('reports:summary', guard('reports.read', async (payload = {}) => {
        const m = models();
        const rows = await m.appointments.findAll({ include: appointmentInclude(m) });
        // Даты buildReport сам отфильтровывает через isDate, а вот мусорный
        // statuses (непустой, но целиком недопустимый) дал бы пустой отчёт —
        // оставляем только валидные значения, как в reports:export.
        const opts = { from: payload.from, to: payload.to };
        if (Array.isArray(payload.statuses)) {
            const valid = booking.STATUSES
                .filter((s) => payload.statuses.map(String).includes(s));
            if (valid.length) opts.statuses = valid;
        }
        return booking.buildReport(rows.map(toJson), opts);
    }));

    // Выбор папки для сохранения отчёта (системный диалог каталога).
    ipcMain.handle('reports:pickFolder', guard('reports.read', async () => {
        const options = {
            title: 'Выберите папку для сохранения отчёта',
            buttonLabel: 'Выбрать папку',
            properties: ['openDirectory', 'createDirectory'],
        };
        const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
        const result = win ? await dialog.showOpenDialog(win, options)
            : await dialog.showOpenDialog(options);
        if (result.canceled || !result.filePaths.length) return null;
        return result.filePaths[0];
    }));

    // Показать сохранённый файл в проводнике (кнопка «Открыть папку»).
    ipcMain.handle('reports:reveal', guard('reports.read', async (file) => {
        const target = booking.text(file);
        if (!target) throw new Error('Файл не указан.');
        try {
            await fs.stat(target);
        } catch {
            throw new Error('Файл не найден.');
        }
        shell.showItemInFolder(target);
        return true;
    }));

    // Генерация Excel-файла (.xlsx) с гибкими настройками из модалки отчёта:
    // период, набор разделов, статусы, раскладка по листам, папка и имя файла.
    ipcMain.handle('reports:export', guard('reports.read', async (payload = {}) => {
        const m = models();

        const opts = {
            from: booking.text(payload.from),
            to: booking.text(payload.to),
            statuses: Array.isArray(payload.statuses) && payload.statuses.length
                ? booking.STATUSES.filter((s) => payload.statuses.map(String).includes(s))
                : booking.STATUSES,
        };
        if (opts.from && opts.to && opts.from > opts.to) {
            throw new Error('Начальная дата позже конечной.');
        }
        if (!opts.statuses.length) throw new Error('Отметьте хотя бы один статус.');

        const sections = Array.isArray(payload.sections) && payload.sections.length
            ? booking.EXPORT_SECTIONS.filter((key) => payload.sections.map(String).includes(key))
            : booking.EXPORT_SECTIONS;
        if (!sections.length) throw new Error('Отметьте хотя бы один раздел отчёта.');

        const folder = booking.text(payload.folder);
        if (!folder) throw new Error('Выберите папку для сохранения отчёта.');
        let stat = null;
        try {
            stat = await fs.stat(folder);
        } catch {
            throw new Error('Папка не существует — выберите другую.');
        }
        if (!stat.isDirectory()) throw new Error('Выбранный путь не является папкой.');

        const rows = (await m.appointments.findAll({
            include: appointmentInclude(m),
            order: [['date', 'ASC'], ['time', 'ASC']],
        })).map(toJson);

        const list = booking.filterRows(rows, opts);
        const report = booking.buildReport(rows, opts);
        const sheets = booking.exportSheets(report, list, { sections, layout: payload.layout });
        const buffer = xlsx.toXlsx(sheets);

        const fileName = booking.safeFileName(payload.fileName || booking.defaultReportName(opts));
        const file = path.join(folder, fileName);
        await fs.writeFile(file, buffer);

        console.log('[export] отчёт сохранён:', file);
        return {
            file,
            fileName,
            bytes: buffer.length,
            sheets: sheets.length,
            rows: list.length,
            report: {
                total: report.total,
                revenue: report.revenue,
                done: report.done,
            },
        };
    }));

    // Сводка для главной страницы: размеры справочников, расписание на сегодня
    // и выручка за текущий месяц. Для мастера данные ограничены его заказами.
    ipcMain.handle('reports:dashboard', guard('session', async () => {
        const m = models();
        const user = currentSession();
        const today = booking.todayISO();
        const isMaster = !booking.can(user.role, 'appointments.write');

        const rows = (await m.appointments.findAll({
            where: isMaster ? { employee_id: user.id } : {},
            include: appointmentInclude(m),
            order: [['date', 'ASC'], ['time', 'ASC']],
        })).map(toJson);

        // Счётчики справочников отдаём только тем, кто имеет их читать
        const countIf = async (action, fn) => (booking.can(user.role, action) ? fn() : null);
        const [clients, employees, services] = await Promise.all([
            countIf('clients.read', () => m.clients.count()),
            countIf('employees.read', () => m.employees.count()),
            countIf('services.read', () => m.services.count()),
        ]);

        return {
            today,
            scope: isMaster ? 'master' : 'all',
            clients,
            employees,
            services,
            todayAppointments: rows.filter((r) => r.date === today),
            month: booking.buildReport(rows, booking.monthRange()),
        };
    }));
}

module.exports = { registerReportsIpc };
