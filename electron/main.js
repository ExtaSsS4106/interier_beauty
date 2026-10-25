const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');

const local = require('./modules/db/local.js');
const remote = require('./modules/db/remoute.js');
const booking = require('./modules/booking.js');


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
        const newEmployee = await employees.create({
        first_name: payload.first_name,
        last_name:  payload.last_name,
        email:      payload.email,
        role:       payload.role,
        password:   payload.password,
        });

        return { ok: true, id: newEmployee.id };
    } catch (err) {
        return { ok: false, error: booking.humanizeError(err) };
    }
    });

    ipcMain.handle('employees:login', async (event, { email, password }) => {
        const { employees } = getDbModels();
        const user = await employees.findOne({ where: { email } });

        if (!user) {
            return { ok: false, error: 'Invalid credentials' };
        }

        if (password === user.password) {
            return { 
                ok: true,
                data: {
                    first_name: user.first_name,
                    last_name:  user.last_name,
                    email:      user.email,
                    role:       user.role,
                    password:   user.password,
                } 
            };
        }else{
            return { 
                ok: false,
                error: 'Invalid credentials'
            };
        }

        
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
    const guard = (handler) => async (_event, payload) => {
        try {
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

    ipcMain.handle('clients:list', guard(async () => {
        const m = models();
        const rows = await m.clients.findAll({ order: [['last_name', 'ASC'], ['first_name', 'ASC']] });
        const counts = await appointmentCounts(m, 'client_id');
        return rows.map((r) => ({ ...toJson(r), appointments_count: counts.get(Number(r.id)) || 0 }));
    }));

    ipcMain.handle('clients:create', guard(async (payload) => {
        const { errors, data } = booking.validateClient(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().clients.create(data));
    }));

    ipcMain.handle('clients:update', guard(async (payload) => {
        const { errors, data } = booking.validateClient(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().clients, payload.id, 'Клиент');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('clients:delete', guard(async (id) => {
        const m = models();
        const row = await ensure(m.clients, id, 'Клиент');
        const used = await usedByAppointments(m, 'client_id', row.id);
        if (used) throw new Error(`Нельзя удалить клиента: к нему привязано записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));

    /* ----------------------------- employees ----------------------------- */

    ipcMain.handle('employees:list', guard(async () => {
        const m = models();
        const rows = await m.employees.findAll({ order: [['last_name', 'ASC'], ['first_name', 'ASC']] });
        const counts = await appointmentCounts(m, 'employee_id');
        return rows.map((r) => ({ ...toJson(r), appointments_count: counts.get(Number(r.id)) || 0 }));
    }));

    ipcMain.handle('employees:create', guard(async (payload) => {
        const { errors, data } = booking.validateEmployee(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().employees.create(data));
    }));

    ipcMain.handle('employees:update', guard(async (payload) => {
        const { errors, data } = booking.validateEmployee(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().employees, payload.id, 'Сотрудник');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('employees:delete', guard(async (id) => {
        const m = models();
        const row = await ensure(m.employees, id, 'Сотрудник');
        const used = await usedByAppointments(m, 'employee_id', row.id);
        if (used) throw new Error(`Нельзя удалить мастера: к нему привязано записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));

    /* ------------------------------ services ----------------------------- */

    ipcMain.handle('services:list', guard(async () => {
        const rows = await models().services.findAll({ order: [['title', 'ASC']] });
        return rows.map(toJson);
    }));

    ipcMain.handle('services:create', guard(async (payload) => {
        const { errors, data } = booking.validateService(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().services.create(data));
    }));

    ipcMain.handle('services:update', guard(async (payload) => {
        const { errors, data } = booking.validateService(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().services, payload.id, 'Услуга');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('services:delete', guard(async (id) => {
        const m = models();
        const row = await ensure(m.services, id, 'Услуга');
        const used = await usedByAppointments(m, 'service_id', row.id);
        if (used) throw new Error(`Нельзя удалить услугу: на неё оформлено записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));

    /* ---------------------------- appointments --------------------------- */

    ipcMain.handle('appointments:list', guard(async () => {
        const m = models();
        const rows = await m.appointments.findAll({
            include: appointmentInclude(m),
            order: [['date', 'DESC'], ['time', 'ASC']],
        });
        return rows.map(toJson);
    }));

    ipcMain.handle('appointments:create', guard(async (payload) => {
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

    ipcMain.handle('appointments:update', guard(async (payload) => {
        const { errors, data } = booking.validateAppointment(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));

        const m = models();
        const row = await ensure(m.appointments, payload.id, 'Запись');

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

    ipcMain.handle('appointments:delete', guard(async (id) => {
        const row = await ensure(models().appointments, id, 'Запись');
        await row.destroy();
        return { id: row.id };
    }));

    /* ------------------------------ отчёты ------------------------------- */

    // Отчёт: количество оказанных услуг и выручка за период.
    ipcMain.handle('reports:summary', guard(async (payload = {}) => {
        const m = models();
        const rows = await m.appointments.findAll({ include: appointmentInclude(m) });
        return booking.buildReport(rows.map(toJson), payload || {});
    }));

    // Сводка для главной страницы: размеры справочников, расписание на сегодня
    // и выручка за текущий месяц.
    ipcMain.handle('reports:dashboard', guard(async () => {
        const m = models();
        const today = booking.todayISO();
        const rows = (await m.appointments.findAll({
            include: appointmentInclude(m),
            order: [['date', 'ASC'], ['time', 'ASC']],
        })).map(toJson);

        const [clients, employees, services] = await Promise.all([
            m.clients.count(), m.employees.count(), m.services.count(),
        ]);

        return {
            today,
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