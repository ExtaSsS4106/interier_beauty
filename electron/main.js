const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');

const local = require('./modules/db/local.js');
const remote = require('./modules/db/remoute.js');


const authFile = () => path.join(app.getPath('userData'), 'auth.json');
const db_config = () => path.join(app.getPath('userData'), 'db_config.json');
const SALT_ROUNDS = 12;

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
            // 1. Локальная SQLite — только проверяем, без init
            if (await local.checkConnection()) {
                return { ok: true, db: 'local' };
            }else if (params) {
                await remote.connect(params);
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
        } else {
        await remote.connect(params);
        }
        return { ok: true };
    } catch (err) {
        // наружу отдаём только понятное сообщение
        return { ok: false, error: err.message };
    }
    });

    ipcMain.handle('db:logout', async () => {
    await remote.disconnect();
    return { ok: true };
    });
    
    ipcMain.handle('admin:register', async (event, payload) => {
    const { employees } = remote.getModels();

    
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
        return { ok: false, error: err.message };
    }
    });

    ipcMain.handle('employees:login', async (event, { email, password }) => {
        const { employees } = remote.getModels();
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
    const { clients } = remote.getModels();
    const rows = await clients.findAll();
    return rows.map((r) => r.toJSON());   // обычные объекты, не инстансы Sequelize
    });

    ipcMain.handle('employees:getAll', async () => {
    const { employees } = remote.getModels();
    const rows = await employees.findAll();
    return rows.map((r) => r.toJSON());   // обычные объекты, не инстансы Sequelize
    });

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
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});