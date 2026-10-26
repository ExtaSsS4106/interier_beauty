/* Точка входа главного процесса Electron.
   Вся логика разнесена по модулям:
     - modules/state.js      — активная БД и сессия (права);
     - modules/ipc/          — IPC-каналы по разделам (см. modules/ipc/index.js);
     - modules/booking.js    — предметная логика (валидация, отчёты, права);
     - modules/xlsx.js       — генерация .xlsx;
     - modules/db/           — подключение к SQLite/MySQL.
   Здесь — только окно и жизненный цикл приложения. */

const { app, BrowserWindow } = require('electron');
const path = require('path');

const { registerIpc } = require('./modules/ipc');

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
    registerIpc();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
