const { app, BrowserWindow, ipcMain, safeStorage, dialog, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');

const local = require('./modules/db/local.js');
const remote = require('./modules/db/remoute.js');
const booking = require('./modules/booking.js');
const xlsx = require('./modules/xlsx.js');


const authFile = () => path.join(app.getPath('userData'), 'auth.json');
const db_config = () => path.join(app.getPath('userData'), 'db_config.json');
const SALT_ROUNDS = 12;

// Какая БД подключена сейчас: 'local' (sqlite) | 'remote' (mysql/postgres).
// Пока этого флага не было, после входа в SQLite все запросы уходили в
// remote.getModels() и падали с «Нет подключения к БД».
let activeDb = null;

function getDbModels() {
    const order = activeDb === 'local' ? [local, remote]
        : activeDb === 'remote' ? [remote, local]
            : [remote, local];
    for (const source of order) {
        try {
            return source.getModels();
        } catch {
            // это подключение не установлено — пробуем следующее
        }
    }
    throw new Error('Нет подключения к БД');
}

/* --------------------------- Сессия и права --------------------------- */
// Кто сейчас вошёл в систему. Права проверяются здесь, в main-процессе:
// renderer может только показать/спрятать кнопки, но не обойти проверку.
let session = null;

function currentSession() {
    if (!session) throw new Error('Сессия не активна — войдите в систему.');
    return session;
}

function requirePermission(action) {
    const user = currentSession();
    if (!booking.can(user.role, action)) {
        throw new Error('Недостаточно прав для этого действия.');
    }
    return user;
}

function startSession(employee) {
    session = {
        id: employee.id,
        email: employee.email,
        role: booking.normalizeRole(employee.role),
        first_name: employee.first_name,
        last_name: employee.last_name,
    };
    return session;
}

function registerAuthStorage() {
    ipcMain.handle('auth:load', async () => {
        try {
            const encrypted = await fs.readFile(authFile(), 'utf8');
            if (!safeStorage.isEncryptionAvailable()) {
                throw new Error('Зашифрованное хранилище недоступно');
            }
            return JSON.parse(safeStorage.decryptString(Buffer.from(encrypted, 'base64')));
        } catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    });
    ipcMain.handle('auth:save', async (_event, data) => {
        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error('Зашифрованное хранилище недоступно');
        }
        const encrypted = safeStorage.encryptString(JSON.stringify(data));
        await fs.mkdir(app.getPath('userData'), { recursive: true });
        await fs.writeFile(authFile(), encrypted.toString('base64'), { mode: 0o600 });
    });

    ipcMain.handle('auth:clear', async () => {
        await fs.rm(authFile(), { force: true });
    });





    ipcMain.handle('db_config:load', async () => {
        try {
            const encrypted = await fs.readFile(db_config(), 'utf8');
            if (!safeStorage.isEncryptionAvailable()) {
                throw new Error('Зашифрованное хранилище недоступно');
            }
            return JSON.parse(safeStorage.decryptString(Buffer.from(encrypted, 'base64')));
        } catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    });
    ipcMain.handle('db_config:save', async (_event, data) => {
        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error('Зашифрованное хранилище недоступно');
        }
        const encrypted = safeStorage.encryptString(JSON.stringify(data));
        await fs.mkdir(app.getPath('userData'), { recursive: true });
        await fs.writeFile(db_config(), encrypted.toString('base64'), { mode: 0o600 });
    });

    ipcMain.handle('db_config:clear', async () => {
        await fs.rm(db_config(), { force: true });
    });

    ipcMain.handle('db:checkConn', async (event, params) => {
        try {
            if (params) {
                await remote.connect(params);
                activeDb = 'remote';
                return { ok: true, db: 'remote' };
            } else{
                // 3. Ни локальной, ни параметров — ничего нет
            return { ok: false };
            }

            
        } catch (err) {
            return { ok: false, error: err.message };
        }
    });

    ipcMain.handle('db:login', async (event, params) => {
    try {
        if (params.dialect === 'sqlite') {
        await local.initDb();
        activeDb = 'local';
        } else {
        await remote.connect(params);
        activeDb = 'remote';
        }
        return { ok: true };
    } catch (err) {
        // наружу отдаём только понятное сообщение
        return { ok: false, error: err.message };
    }
    });

    ipcMain.handle('db:logout', async () => {
    activeDb = null;
    await remote.disconnect();
    await local.close().catch(() => {});
    return { ok: true };
    });
    
    ipcMain.handle('admin:register', async (event, payload) => {
    const { employees } = getDbModels();

    
    try {
        // «В пустую» регистрация нужна только для первого сотрудника:
        // дальше заводить администраторов может лишь тот, у кого есть права.
        if ((await employees.count()) > 0) requirePermission('employees.write');

        const newEmployee = await employees.create({
        first_name: payload.first_name,
        last_name:  payload.last_name,
        email:      payload.email,
        role:       booking.normalizeRole(payload.role),
        password:   payload.password,
        });

        // Первый зарегистрированный сотрудник сразу входит в систему
        const user = startSession(newEmployee);
        return {
            ok: true,
            data: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                permissions: booking.permissionsFor(user.role),
            },
        };
    } catch (err) {
        return { ok: false, error: booking.humanizeError(err) };
    }
    });

    ipcMain.handle('employees:login', async (event, { email, password }) => {
        const { employees } = getDbModels();
        const user = await employees.findOne({ where: { email } });

        if (!user || password !== user.password) {
            return { ok: false, error: 'Неверный email или пароль' };
        }

        const sessionUser = startSession(user);
        return {
            ok: true,
            data: {
                id: sessionUser.id,
                first_name: sessionUser.first_name,
                last_name: sessionUser.last_name,
                email: sessionUser.email,
                role: sessionUser.role,          // нормализованная роль
                permissions: booking.permissionsFor(sessionUser.role),
            },
        };
    });

    // Выход: сбрасываем права, чтобы без входа ничего нельзя было делать
    ipcMain.handle('session:logout', async () => {
        session = null;
        return { ok: true };
    });

    // Пример: данные тоже отдаёте через IPC, модели в renderer не передать
    ipcMain.handle('clients:getAll', async () => {
    const { clients } = getDbModels();
    const rows = await clients.findAll();
    return rows.map((r) => r.toJSON());   // обычные объекты, не инстансы Sequelize
    });

    ipcMain.handle('employees:getAll', async () => {
    const { employees } = getDbModels();
    const rows = await employees.findAll();
    return rows.map((r) => r.toJSON());   // обычные объекты, не инстансы Sequelize
    });

}

/* ==================== Задание №14: CRUD, запись, отчёты ==================== */

const toJson = (row) => (row && typeof row.toJSON === 'function' ? row.toJSON() : row);

function registerDbApi() {
    // Renderer всегда получает { ok, data | error }: падение запроса к БД
    // превращается в понятное сообщение, а не в необработанный reject.
    // action: 'раздел.действие' → проверка прав по роли, 'session' → нужен
    // только вход в систему, null → без проверки. Renderer всегда получает
    // { ok, data | error }, а «Недостаточно прав» уходит обычной ошибкой.
    const guard = (action, handler) => async (_event, payload) => {
        try {
            if (action === 'session') currentSession();
            else if (action) requirePermission(action);
            return { ok: true, data: await handler(payload) };
        } catch (error) {
            console.error('[db api]', error);
            return { ok: false, error: booking.humanizeError(error) };
        }
    };

    const models = () => getDbModels();

    const appointmentInclude = (m) => [
        { model: m.clients, as: 'client', attributes: ['id', 'first_name', 'last_name', 'number'] },
        { model: m.employees, as: 'employee', attributes: ['id', 'first_name', 'last_name'] },
        { model: m.services, as: 'service', attributes: ['id', 'title', 'price'] },
    ];

    async function ensure(model, id, title) {
        const pk = Number(id);
        if (!Number.isInteger(pk) || pk <= 0) throw new Error(`Некорректный идентификатор: ${title}`);
        const row = await model.findByPk(pk);
        if (!row) throw new Error(`${title} не найден`);
        return row;
    }

    // Сколько записей опираются на справочную запись (клиент/мастер/услуга).
    const usedByAppointments = async (m, field, id) =>
        m.appointments.count({ where: { [field]: Number(id) } });

    /** Счётчик записей по каждому client_id / employee_id. */
    async function appointmentCounts(m, field) {
        try {
            const { fn, col } = m.appointments.sequelize;
            const rows = await m.appointments.findAll({
                attributes: [field, [fn('COUNT', col('id')), 'cnt']],
                group: [field],
            });
            return new Map(rows.map((r) => [Number(r.get(field)), Number(r.get('cnt'))]));
        } catch (error) {
            console.warn('[appointments count]', error.message);
            return new Map();
        }
    }

    /* ------------------------------ clients ------------------------------ */

    ipcMain.handle('clients:list', guard('clients.read', async () => {
        const m = models();
        const rows = await m.clients.findAll({ order: [['last_name', 'ASC'], ['first_name', 'ASC']] });
        const counts = await appointmentCounts(m, 'client_id');
        return rows.map((r) => ({ ...toJson(r), appointments_count: counts.get(Number(r.id)) || 0 }));
    }));

    ipcMain.handle('clients:create', guard('clients.write', async (payload) => {
        const { errors, data } = booking.validateClient(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().clients.create(data));
    }));

    ipcMain.handle('clients:update', guard('clients.write', async (payload) => {
        const { errors, data } = booking.validateClient(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().clients, payload.id, 'Клиент');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('clients:delete', guard('clients.write', async (id) => {
        const m = models();
        const row = await ensure(m.clients, id, 'Клиент');
        const used = await usedByAppointments(m, 'client_id', row.id);
        if (used) throw new Error(`Нельзя удалить клиента: к нему привязано записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));

    /* ----------------------------- employees ----------------------------- */

    ipcMain.handle('employees:list', guard('employees.read', async () => {
        const m = models();
        const rows = await m.employees.findAll({ order: [['last_name', 'ASC'], ['first_name', 'ASC']] });
        const counts = await appointmentCounts(m, 'employee_id');
        return rows.map((r) => ({ ...toJson(r), appointments_count: counts.get(Number(r.id)) || 0 }));
    }));

    ipcMain.handle('employees:create', guard('employees.write', async (payload) => {
        const { errors, data } = booking.validateEmployee(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().employees.create(data));
    }));

    ipcMain.handle('employees:update', guard('employees.write', async (payload) => {
        const { errors, data } = booking.validateEmployee(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().employees, payload.id, 'Сотрудник');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('employees:delete', guard('employees.write', async (id) => {
        const m = models();
        const row = await ensure(m.employees, id, 'Сотрудник');
        const used = await usedByAppointments(m, 'employee_id', row.id);
        if (used) throw new Error(`Нельзя удалить мастера: к нему привязано записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));

    /* ------------------------------ services ----------------------------- */

    ipcMain.handle('services:list', guard('services.read', async () => {
        const rows = await models().services.findAll({ order: [['title', 'ASC']] });
        return rows.map(toJson);
    }));

    ipcMain.handle('services:create', guard('services.write', async (payload) => {
        const { errors, data } = booking.validateService(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().services.create(data));
    }));

    ipcMain.handle('services:update', guard('services.write', async (payload) => {
        const { errors, data } = booking.validateService(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().services, payload.id, 'Услуга');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('services:delete', guard('services.write', async (id) => {
        const m = models();
        const row = await ensure(m.services, id, 'Услуга');
        const used = await usedByAppointments(m, 'service_id', row.id);
        if (used) throw new Error(`Нельзя удалить услугу: на неё оформлено записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));

    /* ---------------------------- appointments --------------------------- */

    ipcMain.handle('appointments:list', guard('appointments.read', async () => {
        const m = models();
        const user = currentSession();
        // Мастер видит только свои заказы, админ и менеджер — все
        const where = booking.can(user.role, 'appointments.write') ? {} : { employee_id: user.id };
        const rows = await m.appointments.findAll({
            where,
            include: appointmentInclude(m),
            order: [['date', 'DESC'], ['time', 'ASC']],
        });
        return rows.map(toJson);
    }));

    ipcMain.handle('appointments:create', guard('appointments.write', async (payload) => {
        const { errors, data } = booking.validateAppointment(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));

        const m = models();
        const [client, employee, service] = await Promise.all([
            ensure(m.clients, data.client_id, 'Клиент'),
            ensure(m.employees, data.employee_id, 'Мастер'),
            ensure(m.services, data.service_id, 'Услуга'),
        ]);

        // Проверка занятости мастера на дату и время
        const busy = await m.appointments.findAll({
            where: { employee_id: data.employee_id, date: data.date },
            include: appointmentInclude(m),
        });
        const conflict = booking.findConflict(busy.map(toJson), data);
        if (conflict) {
            const who = conflict.client
                ? `${conflict.client.first_name} ${conflict.client.last_name}`.trim()
                : 'клиент';
            throw new Error(
                `Мастер занят: ${booking.formatDate(conflict.date)} в ${booking.formatTime(conflict.time)} `
                + `уже записан(а) ${who}.`,
            );
        }

        const row = await m.appointments.create(data);
        return {
            ...toJson(row),
            client: toJson(client),
            employee: toJson(employee),
            service: toJson(service),
            cost: booking.visitCost(service),
        };
    }));

    ipcMain.handle('appointments:update', guard('appointments.status', async (payload) => {
        const { errors, data } = booking.validateAppointment(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));

        const m = models();
        const user = currentSession();
        const row = await ensure(m.appointments, payload.id, 'Запись');

        // Мастер без права «записи»: только свои заказы и только смена статуса
        if (!booking.can(user.role, 'appointments.write')) {
            if (Number(row.employee_id) !== Number(user.id)) {
                throw new Error('Можно изменять только свои записи.');
            }
            const unchanged = ['date', 'time', 'client_id', 'employee_id', 'service_id']
                .every((key) => String(row[key]) === String(data[key]));
            if (!unchanged) {
                throw new Error('Мастер может менять только статус записи.');
            }
            await row.update({ status: data.status });
            return toJson(row);
        }

        const [client, employee, service] = await Promise.all([
            ensure(m.clients, data.client_id, 'Клиент'),
            ensure(m.employees, data.employee_id, 'Мастер'),
            ensure(m.services, data.service_id, 'Услуга'),
        ]);

        const busy = await m.appointments.findAll({
            where: { employee_id: data.employee_id, date: data.date },
            include: appointmentInclude(m),
        });
        const conflict = booking.findConflict(busy.map(toJson), { ...data, id: row.id });
        if (conflict) {
            const who = conflict.client
                ? `${conflict.client.first_name} ${conflict.client.last_name}`.trim()
                : 'клиент';
            throw new Error(
                `Мастер занят: ${booking.formatDate(conflict.date)} в ${booking.formatTime(conflict.time)} `
                + `уже записан(а) ${who}.`,
            );
        }

        await row.update(data);
        return {
            ...toJson(row),
            client: toJson(client),
            employee: toJson(employee),
            service: toJson(service),
            cost: booking.visitCost(service),
        };
    }));

    ipcMain.handle('appointments:delete', guard('appointments.write', async (id) => {
        const row = await ensure(models().appointments, id, 'Запись');
        await row.destroy();
        return { id: row.id };
    }));

    /* ------------------------------ отчёты ------------------------------- */

    // Отчёт: количество оказанных услуг и выручка за период.
    ipcMain.handle('reports:summary', guard('reports.read', async (payload = {}) => {
        const m = models();
        const rows = await m.appointments.findAll({ include: appointmentInclude(m) });
        return booking.buildReport(rows.map(toJson), payload || {});
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

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 360,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            // Десктоп-клиент ходит по file:// на Django в локальной сети.
            // Отключаем SOP/CORS, чтобы API работал без cors-headers на сервере.
            // Граница renderer/node (contextIsolation) при этом сохраняется.
            webSecurity: false,
        },
    });

    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    registerAuthStorage();
    registerDbApi();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});