/* E2E-прогон задания №14: настоящее окно Electron, настоящий preload c IPC,
   настоящая SQLite-БД во временной папке и реальные шаблоны страниц.

   Запуск:  npx electron --no-sandbox build/electron-e2e.js
   (npm run test:e2e)

   Что проверяется:
     1. приложение загружается без ошибок рендера;
     2. подключение к БД, регистрация мастера и администратора;
     3. CRUD клиентов/мастеров/услуг;
     4. запись клиента + проверка занятости мастера;
     5. отчёт: количество оказанных услуг и выручка;
     6. каждая страница (#/clients, #/masters, #/services, #/appointments,
        #/reports, #/) отрисовывается и наполняется данными. */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const root = path.join(__dirname, '..');
const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'salon-e2e-'));
app.setPath('userData', userData);

// Подключаем настоящий main-процесс приложения: он регистрирует все
// ipcMain.handle(...) и создаёт окно — им и будем управлять.
require(path.join(root, 'electron', 'main.js'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];
const consoleErrors = [];

function assert(name, condition, details = '') {
    results.push({ name, ok: Boolean(condition), details });
    console.log(`${condition ? 'ok  ' : 'FAIL'} ${name}${condition ? '' : ` — ${details}`}`);
}

async function js(win, code) {
    return win.webContents.executeJavaScript(code, true);
}

async function waitFor(win, expression, timeout = 20000) {
    const started = Date.now();
    for (;;) {
        try {
            if (await js(win, `Boolean(${expression})`)) return true;
        } catch { /* рендер ещё не готов */ }
        if (Date.now() - started > timeout) return false;
        await sleep(250);
    }
}

const NOISE = /sandbox|unsafe-eval|GetVSyncParameters|DevTools|Autofill/i;

app.whenReady().then(async () => {
    // main.js регистрирует обработчики IPC и создаёт окно первым
    // (его whenReady-обработчик зарегистрирован раньше нашего).
    let win = null;
    for (let i = 0; i < 100 && !win; i += 1) {
        [win] = BrowserWindow.getAllWindows();
        if (!win) await sleep(100);
    }
    if (!win) {
        assert('окно приложения создано', false, 'BrowserWindow.getAllWindows() пуст');
        app.exit(1);
        return;
    }
    win.hide();                       // тест не мешает работе за компьютером
    // Скрытое окно не рисует кадры — render() приложения уходит в
    // requestAnimationFrame и без этого вызова никогда не выполнится.
    win.webContents.setBackgroundThrottling(false);

    win.webContents.on('console-message', (...args) => {
        const first = args[0];
        const single = first && typeof first === 'object' && 'message' in first;
        const message = single ? first.message : (typeof args[1] === 'string' ? args[1] : args[2]);
        const level = single ? first.level : first;
        if (typeof message !== 'string' || NOISE.test(message)) return;
        if (level === 3 || /error|exception|uncaught|failed/i.test(message)) consoleErrors.push(message);
    });
    win.webContents.on('render-process-gone', (_e, details) => {
        consoleErrors.push(`renderer gone: ${details.reason}`);
    });

    if (win.webContents.isLoading()) {
        await new Promise((resolve) => win.webContents.once('did-finish-load', resolve));
    }

    try {
        /* ------------------------- 1. Загрузка UI ------------------------- */
        const booted = await waitFor(win,
            'window.app && window.ui && window.db_requests && document.getElementById("root").children.length > 0');
        assert('приложение загрузилось (window.app, window.ui, db_requests)', booted);

        await js(win, `window.__errs = [];
            window.addEventListener('error', (e) => window.__errs.push(String(e.message)));
            window.addEventListener('unhandledrejection', (e) => window.__errs.push(String(e.reason)));
            true;`);

        /* --------------------- 2. Подключение к SQLite --------------------- */
        await js(win, 'window.db_requests.login({ dialect: "sqlite" })');
        const tables = await js(win, `(async () => {
            const clients = await window.db_requests.clients.list();
            const masters = await window.db_requests.employees.list();
            const services = await window.db_requests.services.list();
            const appts = await window.db_requests.appointments.list();
            return { clients, masters, services, appts };
        })()`);
        assert('новая БД: 4 таблицы отвечают через IPC',
            Array.isArray(tables.clients) && Array.isArray(tables.masters)
            && Array.isArray(tables.services) && Array.isArray(tables.appts),
            JSON.stringify(Object.keys(tables)));

        /* ---------------- 3. Регистрация мастера и админа ---------------- */
        const admin = await js(win, `window.db_requests.employees.create({
            first_name: 'Администратор', last_name: 'Салона',
            email: 'admin@salon.local', role: 'admin', password: 'secret123'
        })`);
        const master = await js(win, `window.db_requests.employees.create({
            first_name: 'Мария', last_name: 'Петрова',
            email: 'maria@salon.local', role: 'master', password: 'secret123'
        })`);
        assert('регистрация мастеров и администратора', admin.id > 0 && master.id > 0,
            `admin=${admin.id}, master=${master.id}`);

        const badMaster = await js(win, `window.db_requests.employees.create({
            first_name: '', last_name: '', email: 'не-email', role: 'root', password: '1'
        }).then(() => null, (e) => e.message)`);
        assert('невалидный мастер отклонён с сообщением', typeof badMaster === 'string' && badMaster.length > 0,
            String(badMaster));

        /* ------------------------ 4. Клиенты и услуги ---------------------- */
        const client = await js(win, `window.db_requests.clients.create({
            first_name: 'Анна', last_name: 'Иванова',
            number: '+7 (900) 123-45-67', email: 'anna@client.local'
        })`);
        const service = await js(win, `window.db_requests.services.create({
            title: 'Женская стрижка', price: '1500'
        })`);
        assert('CRUD: клиент и услуга созданы', client.id > 0 && service.id > 0,
            `client=${client.id}, service=${service.id}`);

        const dup = await js(win, `window.db_requests.clients.create({
            first_name: 'Дубль', last_name: 'Дубль',
            number: '+7 900 000 00 00', email: 'anna@client.local'
        }).then(() => null, (e) => e.message)`);
        assert('дубликат email отклонён', typeof dup === 'string' && dup.length > 0, String(dup));

        /* -------------------------- 5. Записи ------------------------------ */
        const appt = await js(win, `window.db_requests.appointments.create({
            client_id: ${client.id}, employee_id: ${master.id}, service_id: ${service.id},
            date: '2026-10-25', time: '14:30'
        })`);
        assert('запись клиента создана', appt.id > 0, JSON.stringify(appt.error || appt));

        const conflict = await js(win, `window.db_requests.appointments.create({
            client_id: ${client.id}, employee_id: ${master.id}, service_id: ${service.id},
            date: '2026-10-25', time: '14:30'
        }).then(() => null, (e) => e.message)`);
        assert('занятость мастера обнаружена',
            typeof conflict === 'string' && /занят/i.test(conflict), String(conflict));

        const freeSlot = await js(win, `window.db_requests.appointments.create({
            client_id: ${client.id}, employee_id: ${master.id}, service_id: ${service.id},
            date: '2026-10-25', time: '16:00'
        })`);
        assert('свободный слот принимается', freeSlot.id > 0, JSON.stringify(freeSlot.error || freeSlot));

        await js(win, `window.db_requests.appointments.update({
            id: ${appt.id}, client_id: ${client.id}, employee_id: ${master.id},
            service_id: ${service.id}, date: '2026-10-25', time: '14:30', status: 'done'
        })`);
        const afterUpdate = await js(win, 'window.db_requests.appointments.list()');
        assert('статус записи обновлён (CRUD update)',
            afterUpdate.some((r) => r.id === appt.id && r.status === 'done'),
            JSON.stringify(afterUpdate.map((r) => r.status)));

        const clientDeleteError = await js(win, `window.db_requests.clients.remove(${client.id})
            .then(() => null, (e) => e.message)`);
        assert('удаление клиента с записями заблокировано',
            typeof clientDeleteError === 'string' && clientDeleteError.length > 0, String(clientDeleteError));

        /* --------------------------- 6. Отчёт ------------------------------ */
        const report = await js(win, `window.db_requests.reports.summary({ from: '2026-10-01', to: '2026-10-31' })`);
        assert('отчёт: выручка считается по оказанным услугам', report.revenue === 1500,
            `revenue=${report.revenue}, done=${report.done}`);
        assert('отчёт: разбивка по услугам и мастерам заполнена',
            report.services.length === 1 && report.masters.length === 1 && report.clients.length === 1,
            JSON.stringify({ s: report.services.length, m: report.masters.length, c: report.clients.length }));

        const dash = await js(win, 'window.db_requests.reports.dashboard()');
        assert('сводка главной страницы', dash.clients === 1 && dash.employees === 2 && dash.services === 1,
            JSON.stringify({ c: dash.clients, e: dash.employees, s: dash.services }));

        /* --------------------- 7. Отрисовка страниц ------------------------ */
        const openPage = async (route) => {
            await js(win, `window.navigate(${JSON.stringify(route)})`);
            const ready = await waitFor(win, `location.hash === "#${route}"
                && document.getElementById("root").children.length > 0`, 8000);
            await sleep(800);   // данные подгружаются асинхронно
            const stats = await js(win, `({
                hash: location.hash,
                nodes: document.querySelectorAll('#root *').length,
                hasNavbar: !!document.querySelector('#root nav'),
            })`);
            assert(`страница ${route} отрисована`, ready && stats.nodes > 20 && stats.hasNavbar,
                JSON.stringify(stats));
            if (!(ready && stats.nodes > 20 && stats.hasNavbar)) {
                console.log('   консоль:', consoleErrors.slice(-3).join(' | ') || 'нет сообщений');
            }
        };

        for (const route of ['/', '/clients', '/masters', '/services', '/appointments', '/reports']) {
            await openPage(route);
        }

        // Данные действительно попали в таблицы
        await openPage('/appointments');
        const apptRows = await js(win, 'document.querySelectorAll("#rows tr").length').catch(() => -1);
        assert('таблица записей наполнена данными', apptRows === 2, `строк: ${apptRows}`);

        // Конфликт занятости должен показаться прямо в форме записи
        await js(win, 'document.getElementById("addBtn").click()');
        await sleep(500);
        await js(win, `(() => {
            const set = (id, value) => {
                const el = document.getElementById(id);
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            };
            set('client', '${client.id}');
            set('employee', '${master.id}');
            set('service', '${service.id}');
            set('date', '2026-10-25');
            set('time', '14:30');
            document.getElementById('saveBtn').click();
            return true;
        })()`);
        await sleep(1500);
        const conflictInForm = await js(win, `({
            visible: !document.getElementById('modalAlert').classList.contains('d-none'),
            text: document.getElementById('modalError').textContent,
            cost: document.getElementById('costPreview').textContent,
        })`);
        assert('форма записи показывает занятость мастера',
            conflictInForm.visible && /занят/i.test(conflictInForm.text),
            JSON.stringify(conflictInForm));
        assert('форма записи рассчитывает стоимость посещения',
            conflictInForm.cost.includes('1'), `стоимость: ${conflictInForm.cost}`);
        await js(win, 'window.bootstrap.Modal.getOrCreateInstance(document.getElementById("apptModal")).hide()');
        await sleep(400);

        await openPage('/clients');
        const clientRows = await js(win, 'document.querySelectorAll("#rows tr").length').catch(() => -1);
        assert('таблица клиентов наполнена', clientRows === 1, `строк: ${clientRows}`);

        /* -------------- 8. Формы: валидация, добавление, удаление -------- */
        await js(win, 'document.getElementById("addBtn").click()');
        await sleep(500);
        const modalOpen = await js(win, 'document.getElementById("clientModal").classList.contains("show")');
        assert('модалка добавления клиента открывается', modalOpen);

        await js(win, 'document.getElementById("saveBtn").click()');
        await sleep(300);
        const invalidInfo = await js(win,
            '[...document.querySelectorAll("#clientForm .is-invalid")].map((e) => e.id).join(",")');
        assert('пустая форма не проходит валидацию', invalidInfo.split(',').filter(Boolean).length >= 4,
            `помечено: ${invalidInfo || 'нет'}`);

        await js(win, `(() => {
            const set = (id, value) => {
                const el = document.getElementById(id);
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            };
            set('firstName', 'Ольга');
            set('lastName', 'Сидорова');
            set('number', '+7 911 222-33-44');
            set('clientEmail', 'olga@client.local');
            document.getElementById('saveBtn').click();
            return true;
        })()`);
        await sleep(1500);
        const rowsAfterAdd = await js(win, 'document.querySelectorAll("#rows tr").length');
        assert('клиент добавлен через форму', rowsAfterAdd === 2, `строк: ${rowsAfterAdd}`);

        const stillValid = await js(win, 'document.querySelectorAll("#clientForm .is-invalid").length');
        assert('после сохранения ошибок валидации нет', stillValid === 0, `помечено полей: ${stillValid}`);

        await js(win, '[...document.querySelectorAll("[data-del]")].pop().click()');
        await sleep(500);
        const confirmShown = await js(win, 'document.getElementById("confirmModal").classList.contains("show")');
        assert('модалка подтверждения удаления открывается', confirmShown);

        await js(win, 'document.getElementById("confirmModalOk").click()');
        await sleep(1500);
        const rowsAfterDelete = await js(win, 'document.querySelectorAll("#rows tr").length');
        assert('клиент удалён через UI', rowsAfterDelete === 1, `строк: ${rowsAfterDelete}`);

        // Регистрация мастера формой
        await openPage('/masters');
        await js(win, 'document.getElementById("addBtn").click()');
        await sleep(500);
        await js(win, `(() => {
            const set = (id, value) => {
                const el = document.getElementById(id);
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            };
            set('firstName', 'Елена');
            set('lastName', 'Кузнецова');
            set('masterEmail', 'elena@salon.local');
            set('role', 'master');
            set('password', 'pass12345');
            document.getElementById('saveBtn').click();
            return true;
        })()`);
        await sleep(1500);
        const masterRows = await js(win, 'document.querySelectorAll("#rows tr").length');
        assert('мастер зарегистрирован через форму', masterRows === 3, `строк: ${masterRows}`);

        await openPage('/reports');
        const reportKpi = await js(win, 'document.getElementById("kpiRevenue").textContent').catch(() => '');
        assert('отчёт отрисован на странице', reportKpi.includes('1'), `kpiRevenue: ${reportKpi}`);

        /* --------------------------- 8. Ошибки ----------------------------- */
        const runtimeErrors = await js(win, 'window.__errs || []');
        assert('нет ошибок выполнения в рендере', runtimeErrors.length === 0,
            runtimeErrors.join(' | '));
        assert('нет ошибок в консоли', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));
    } catch (error) {
        assert('E2E выполняется без исключений', false, error.stack || error.message);
    }

    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed} прошло, ${failed} упало`);
    app.exit(failed ? 1 : 0);
});

app.on('window-all-closed', () => { /* тест сам завершит приложение */ });

process.on('exit', () => {
    try { fs.rmSync(userData, { recursive: true, force: true }); } catch { /* уже удалено */ }
});
