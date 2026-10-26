/* Зашифрованное хранилище Electron (safeStorage):
   - auth:*       — сохранённые данные входа;
   - db_config:*  — параметры подключения к БД.

   Оба семейства используют один механизм шифрования, поэтому живут рядом. */

const { ipcMain, safeStorage, app } = require('electron');
const fs = require('fs/promises');
const path = require('path');

const authFile = () => path.join(app.getPath('userData'), 'auth.json');
const dbConfigFile = () => path.join(app.getPath('userData'), 'db_config.json');

function registerAuthIpc() {
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
            const encrypted = await fs.readFile(dbConfigFile(), 'utf8');
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
        await fs.writeFile(dbConfigFile(), encrypted.toString('base64'), { mode: 0o600 });
    });

    ipcMain.handle('db_config:clear', async () => {
        await fs.rm(dbConfigFile(), { force: true });
    });
}

module.exports = { registerAuthIpc };
