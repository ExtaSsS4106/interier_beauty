/* E2E-прогон задания №14: настоящее окно Electron, настоящий preload c IPC,
   настоящая SQLite-БД во временной папке и реальные шаблоны страниц.

   Запуск:  npx electron --no-sandbox build/electron-e2e.js
   (npm run test:e2e)

   Что проверяется:
     1. приложение загружается без ошибок рендера;
     2. подключение к БД, вход в систему (сессия) и регистрация администратора;
     3. CRUD клиентов/мастеров/услуг;
     4. запись клиента + проверка занятости мастера;
     5. отчёт: количество оказанных услуг и выручка;
     6. разделение прав: админ — всё, менеджер — клиенты и запись,
        мастер — только свои заказы и смена статуса;
     7. меню в левой выдвижной шторке (а не в шапке);
     8. каждая страница (#/clients, #/masters, #/services, #/appointments,
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
    let target = win;
    if (!target || !target.webContents) {
        [target] = BrowserWindow.getAllWindows();
        if (!target || !target.webContents) throw new Error('окно приложения потеряно');
    }
    return target.webContents.executeJavaScript(code, true);
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

        // Без входа в систему main-процесс не отдаёт никаких данных
        const noSession = await js(win,
            'window.db_requests.clients.list().then(() => null, (e) => e.message)');
        assert('без входа в систему запросы к БД блокируются',
            typeof noSession === 'string' && /сессия/i.test(noSession), String(noSession));

        /* -------------- 3. Регистрация администратора (вход) -------------- */
        const adminUser = await js(win, `window.db_requests.adminReg({
            first_name: 'Администратор', last_name: 'Салона',
            email: 'admin@salon.local', role: 'admin', password: 'secret123'
        })`);
        assert('регистрация админа открывает сессию с полными правами',
            adminUser && adminUser.id > 0 && adminUser.permissions
            && adminUser.permissions.role === 'admin'
            && adminUser.permissions.employeesWrite === true
            && adminUser.permissions.servicesWrite === true,
            JSON.stringify(adminUser));

        // UI тоже должен знать, кто вошёл: по data.user шаблоны прячут кнопки
        await js(win, `window.app.states.setUser(${JSON.stringify(adminUser)})`);

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

        /* ---------------- 4. Регистрация мастера -------------------------- */
        const master = await js(win, `window.db_requests.employees.create({
            first_name: 'Мария', last_name: 'Петрова',
            email: 'maria@salon.local', role: 'master', password: 'secret123'
        })`);
        assert('регистрация мастера', master.id > 0, `master=${master.id}`);

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

        // Запись «не на мастера» — пригодится, чтобы проверить, что мастер
        // не может трогать чужие заказы
        const adminAppt = await js(win, `window.db_requests.appointments.create({
            client_id: ${client.id}, employee_id: ${adminUser.id}, service_id: ${service.id},
            date: '2026-10-27', time: '11:00'
        })`);
        assert('запись на администратора создана', adminAppt.id > 0, JSON.stringify(adminAppt.error || adminAppt));

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

        /* ------------------- 7. Разделение прав (роли) --------------------- */
        const denied = async (code) => js(win, `${code}.then(() => null, (e) => e.message)`);
        const loginAs = (email) => js(win,
            `window.db_requests.employeesLogin({ email: '${email}', password: 'secret123' })`
            + '.then((r) => r.data, (e) => ({ error: e.message }))');

        // менеджер заводится админом — иначе некого логинить
        const manager = await js(win, `window.db_requests.employees.create({
            first_name: 'Ольга', last_name: 'Менеджер',
            email: 'olga@salon.local', role: 'manager', password: 'secret123'
        })`);
        assert('регистрация менеджера', manager.id > 0, `manager=${manager.id}`);

        /* --- мастер: только свои заказы, принять и отметить оказанной --- */
        const masterLogin = await loginAs('maria@salon.local');
        assert('мастер входит в систему, права минимальные',
            masterLogin && masterLogin.role === 'master'
            && masterLogin.permissions.appointmentsWrite === false
            && masterLogin.permissions.appointmentsStatus === true,
            JSON.stringify(masterLogin));

        assert('мастеру справочник клиентов недоступен',
            /недостаточно прав/i.test(await denied('window.db_requests.clients.list()') || ''),
            String(await denied('window.db_requests.clients.list()')));
        assert('мастер не может создать услугу',
            /недостаточно прав/i.test(await denied(
                "window.db_requests.services.create({ title: 'Обман', price: '1' })") || ''), '');
        assert('мастер не может завести сотрудника',
            /недостаточно прав/i.test(await denied(
                "window.db_requests.employees.create({ first_name: 'X', last_name: 'Y',"
                + " email: 'x@y.local', role: 'admin', password: 'secret123' })") || ''), '');

        const masterAppts = await js(win, 'window.db_requests.appointments.list()');
        assert('мастер видит только свои заказы',
            Array.isArray(masterAppts) && masterAppts.length === 2
            && masterAppts.every((r) => r.employee_id === master.id),
            JSON.stringify(masterAppts.map((r) => `${r.id}:emp${r.employee_id}`)));

        const accepted = await js(win, `window.db_requests.appointments.update({
            id: ${freeSlot.id}, client_id: ${client.id}, employee_id: ${master.id},
            service_id: ${service.id}, date: '2026-10-25', time: '16:00', status: 'accepted'
        }).then((r) => r.status, (e) => e.message)`);
        assert('мастер принимает свою запись (только статус)', accepted === 'accepted', String(accepted));

        assert('мастер не может менять дату/время записи',
            /только статус/i.test(await denied(`window.db_requests.appointments.update({
                id: ${freeSlot.id}, client_id: ${client.id}, employee_id: ${master.id},
                service_id: ${service.id}, date: '2026-10-28', time: '16:00', status: 'accepted'
            })`) || ''), '');

        assert('чужую запись мастер изменить не может',
            /только свои/i.test(await denied(`window.db_requests.appointments.update({
                id: ${adminAppt.id}, client_id: ${client.id}, employee_id: ${adminUser.id},
                service_id: ${service.id}, date: '2026-10-27', time: '11:00', status: 'done'
            })`) || ''), '');

        /* --- менеджер: принимает клиентов и направляет к мастерам --- */
        const managerLogin = await loginAs('olga@salon.local');
        assert('менеджер входит в систему',
            managerLogin && managerLogin.role === 'manager'
            && managerLogin.permissions.clientsWrite === true
            && managerLogin.permissions.employeesWrite === false,
            JSON.stringify(managerLogin));

        assert('менеджер не может завести сотрудника',
            /недостаточно прав/i.test(await denied(
                "window.db_requests.employees.create({ first_name: 'X', last_name: 'Y',"
                + " email: 'x2@y.local', role: 'master', password: 'secret123' })") || ''), '');
        assert('менеджер не может добавить услугу',
            /недостаточно прав/i.test(await denied(
                "window.db_requests.services.create({ title: 'Самодеятельность', price: '1' })") || ''), '');

        const managerClient = await js(win, `window.db_requests.clients.create({
            first_name: 'Временный', last_name: 'Клиент',
            number: '+7 900 111-22-33', email: 'temp@client.local'
        }).then((r) => r, (e) => ({ error: e.message }))`);
        assert('менеджер регистрирует клиента', managerClient && managerClient.id > 0,
            JSON.stringify(managerClient));

        const managerAppt = await js(win, `window.db_requests.appointments.create({
            client_id: ${managerClient.id}, employee_id: ${master.id}, service_id: ${service.id},
            date: '2026-10-26', time: '10:00'
        }).then((r) => r, (e) => ({ error: e.message }))`);
        assert('менеджер записывает клиента к мастеру', managerAppt && managerAppt.id > 0,
            JSON.stringify(managerAppt));

        // уборка за менеджером, чтобы база осталась в исходном виде
        await js(win, `window.db_requests.appointments.remove(${managerAppt.id})`);
        await js(win, `window.db_requests.clients.remove(${managerClient.id})`);

        /* --- возвращаем сессию администратора для дальнейших проверок --- */
        const relogin = await loginAs('admin@salon.local');
        assert('администратор снова в системе', relogin && relogin.role === 'admin'
            && relogin.permissions.employeesWrite === true, JSON.stringify(relogin));

        /* --------------------- 7. Отрисовка страниц ------------------------ */
        const openPage = async (route) => {
            await js(win, `window.navigate(${JSON.stringify(route)})`);
            const ready = await waitFor(win, `location.hash === "#${route}"
                && document.getElementById("root").children.length > 0`, 8000);
            await sleep(800);   // данные подгружаются асинхронно
            const stats = await js(win, `({
                hash: location.hash,
                nodes: document.querySelectorAll('#root *').length,
                hasSidebar: !!document.querySelector('#root .app-sidebar nav'),
                hasTopbar: !!document.querySelector('#root .topbar'),
                headerMenu: !!document.querySelector('#root header nav'),
            })`);
            const ok = ready && stats.nodes > 20 && stats.hasSidebar && stats.hasTopbar && !stats.headerMenu;
            assert(`страница ${route} отрисована (шторка вместо шапки)`, ok, JSON.stringify(stats));
            if (!ok) {
                console.log('   консоль:', consoleErrors.slice(-3).join(' | ') || 'нет сообщений');
            }
        };

        for (const route of ['/', '/clients', '/masters', '/services', '/appointments', '/reports']) {
            await openPage(route);
        }

        // Данные действительно попали в таблицы
        await openPage('/appointments');
        const apptRows = await js(win, 'document.querySelectorAll("#rows tr").length').catch(() => -1);
        assert('таблица записей наполнена данными', apptRows === 3, `строк: ${apptRows}`);

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
        assert('мастер зарегистрирован через форму', masterRows === 4, `строк: ${masterRows}`);

        /* ---------------- 9. Отчёт на странице ----------------------------- */
        await openPage('/reports');
        await js(win, 'document.getElementById("allTime").click()');   // не зависим от даты
        await sleep(1200);
        const reportState = await js(win, `({
            revenue: document.getElementById('kpiRevenue').textContent,
            done: document.getElementById('kpiDone').textContent,
            statuses: document.getElementById('kpiStatuses').textContent,
            emptyHidden: document.getElementById('reportEmpty').classList.contains('d-none'),
            tables: document.querySelectorAll('#serviceRows tr, #masterRows tr, #clientRows tr').length,
        })`);
        assert('отчёт выводится: выручка и оказанные услуги',
            reportState.revenue.includes('1') && reportState.done.trim() === '1',
            JSON.stringify(reportState));
        assert('отчёт показывает статусы, включая «Принята»',
            /принята:\s*1/.test(reportState.statuses), reportState.statuses);
        assert('при данных пустое состояние не показывается', reportState.emptyHidden === true,
            JSON.stringify(reportState));
        assert('разбивки отчёта заполнены (услуги/мастера/клиенты)',
            reportState.tables >= 3, `строк: ${reportState.tables}`);

        /* ---------------- 10. Экспорт отчёта в Excel ------------------------- */
        const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salon-export-'));
        try {
            // открываем модалку кнопкой «Сформировать»
            await js(win, 'document.getElementById("buildBtn").click()');
            await sleep(500);
            const modalOpen = await js(win, '!!document.getElementById("exportModal") && !document.getElementById("exportModal").classList.contains("d-none")');
            assert('модалка экспорта открывается по кнопке «Сформировать»', modalOpen, String(modalOpen));

            // валидация: пустая папка → ошибка, файл не создаётся
            await js(win, `(() => {
                const d = document;
                d.getElementById('expFolder').value = '';
                d.getElementById('expFolder').dispatchEvent(new Event('input', { bubbles: true }));
                d.getElementById('expFile').value = 'Отчёт е2е.xlsx';
                d.getElementById('expFile').dispatchEvent(new Event('input', { bubbles: true }));
                d.getElementById('exportForm').requestSubmit();
                return true;
            })()`);
            await sleep(400);
            const errShown = await js(win, '!document.getElementById("exportError").classList.contains("d-none")');
            const filesBefore = fs.readdirSync(exportDir).length;
            assert('без папки ошибка и файл не создаётся', errShown && filesBefore === 0,
                `err=${errShown} files=${filesBefore}`);

            // заполняем папку и имя файла, формируем отчёт (все разделы и статусы по умолчанию)
            const formState = await js(win, `(() => {
                const d = document;
                const f = d.getElementById('expFolder');
                const fe = d.getElementById('expFile');
                f.value = ${JSON.stringify(exportDir)};
                f.dispatchEvent(new Event('input', { bubbles: true }));
                fe.value = 'Отчёт е2е.xlsx';
                fe.dispatchEvent(new Event('input', { bubbles: true }));
                d.getElementById('exportForm').requestSubmit();
                return { folder: f.value, file: fe.value };
            })()`);
            // ждём завершения асинхронного экспорта (модалка покажет успех или ошибку)
            let successShown = false;
            let errorText = '';
            for (let i = 0; i < 50; i += 1) {
                const state = await js(win, `({
                    success: !document.getElementById("exportSuccess").classList.contains("d-none"),
                    error: !document.getElementById("exportError").classList.contains("d-none"),
                    errorText: document.getElementById("exportErrorText").textContent
                })`);
                if (state.success || state.error) {
                    successShown = state.success;
                    errorText = state.errorText || '';
                    break;
                }
                await sleep(100);
            }
            const filesAfter = fs.readdirSync(exportDir).length;
            const xlsxFile = filesAfter > 0 ? path.join(exportDir, fs.readdirSync(exportDir)[0]) : null;
            assert('файл .xlsx создан в выбранной папке',
                successShown && filesAfter === 1 && xlsxFile && xlsxFile.endsWith('.xlsx'),
                `formState=${JSON.stringify(formState)} success=${successShown} error=${errorText} files=${filesAfter} ${JSON.stringify(fs.readdirSync(exportDir))}`);

            // проверяем, что это валидный zip/xlsx с обязательными частями книги
            const xlsxMod = require(path.join(root, 'electron', 'modules', 'xlsx.js'));
            const parts = xlsxMod.unzip(fs.readFileSync(xlsxFile));
            assert('xlsx содержит обязательные части книги',
                parts.has('[Content_Types].xml') && parts.has('xl/workbook.xml') && parts.has('xl/styles.xml') && parts.has('xl/worksheets/sheet1.xml'),
                [...parts.keys()].join(', '));
        } finally {
            fs.rmSync(exportDir, { recursive: true, force: true });
        }

        /* ---------------- 11. Шторка вместо шапки -------------------------- */
        const sidebar = await js(win, `({
            sidebar: !!document.querySelector('#root .app-sidebar'),
            nav: document.querySelectorAll('#root .app-sidebar nav a').length,
            topbar: !!document.querySelector('#root .topbar'),
            headerMenu: !!document.querySelector('#root header nav'),
            toggle: !!document.querySelector('#root [data-sidebar-toggle]'),
            logout: !!document.querySelector('#root [data-logout]'),
            open: document.documentElement.classList.contains('sidebar-open'),
        })`);
        assert('меню живёт в левой выдвижной шторке, а не в шапке',
            sidebar.sidebar && sidebar.topbar && !sidebar.headerMenu
            && sidebar.nav >= 6 && sidebar.toggle && sidebar.logout,
            JSON.stringify(sidebar));
        assert('для админа шторка открыта по умолчанию', sidebar.open === true, JSON.stringify(sidebar));

        await js(win, 'document.querySelector("[data-sidebar-toggle]").click()');
        await sleep(300);
        const closed = await js(win, "!document.documentElement.classList.contains('sidebar-open')");
        await openPage('/clients');
        const closedAfterNav = await js(win, "!document.documentElement.classList.contains('sidebar-open')");
        assert('кнопка шторки скрывает меню и состояние переживает переход',
            closed && closedAfterNav, JSON.stringify({ closed, closedAfterNav }));
        await js(win, 'document.querySelector("[data-sidebar-toggle]").click()');
        await sleep(300);

        /* ------------- 11. UI уважает права (мастер) ----------------------- */
        await js(win, `window.app.states.setUser(${JSON.stringify(masterLogin)})`);
        await js(win, 'window.navigate("/clients")');
        await sleep(1200);
        const masterUi = await js(win, `({
            hash: location.hash,
            links: document.querySelectorAll('#root .app-sidebar nav a').length,
            hasClientTable: !!document.getElementById('rows') && location.hash === '#/clients',
        })`);
        assert('мастера не пускают в раздел «Клиенты»',
            masterUi.hash === '#/' && masterUi.links === 2 && !masterUi.hasClientTable,
            JSON.stringify(masterUi));

        await js(win, 'window.navigate("/appointments")');
        await sleep(1200);
        const masterApptUi = await js(win, `({
            hash: location.hash,
            addBtn: !!document.getElementById('addBtn'),
            filterMaster: !!document.getElementById('filterMaster'),
            statusSelects: document.querySelectorAll('[data-status]').length,
            editButtons: document.querySelectorAll('[data-edit]').length,
        })`);
        assert('мастер видит свои заказы без кнопок создания и фильтра мастера',
            masterApptUi.hash === '#/appointments' && !masterApptUi.addBtn
            && !masterApptUi.filterMaster && masterApptUi.statusSelects > 0
            && masterApptUi.editButtons === 0,
            JSON.stringify(masterApptUi));

        // возвращаем администратора
        await js(win, `window.app.states.setUser(${JSON.stringify(adminUser)})`);

        /* --------------------------- 12. Ошибки ---------------------------- */
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
