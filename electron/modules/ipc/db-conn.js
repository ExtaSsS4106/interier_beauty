/* Подключение/отключение к БД: выбираем dialect (sqlite | mysql/postgres)
   и запоминаем активное подключение в state (activeDb). */

const { ipcMain } = require('electron');
const local = require('../db/local.js');
const remote = require('../db/remoute.js');
const { setActiveDb, resetActiveDb } = require('../state.js');

function registerDbConnIpc() {
    ipcMain.handle('db:checkConn', async (event, params) => {
        try {
            if (params) {
                await remote.connect(params);
                setActiveDb('remote');
                return { ok: true, db: 'remote' };
            }
            // Ни локальной БД, ни параметров — ничего нет
            return { ok: false };
        } catch (err) {
            return { ok: false, error: err.message };
        }
    });

    ipcMain.handle('db:login', async (event, params) => {
        try {
            if (params.dialect === 'sqlite') {
                await local.initDb();
                setActiveDb('local');
            } else {
                await remote.connect(params);
                setActiveDb('remote');
            }
            return { ok: true };
        } catch (err) {
            // наружу отдаём только понятное сообщение
            return { ok: false, error: err.message };
        }
    });

    ipcMain.handle('db:logout', async () => {
        resetActiveDb();
        await remote.disconnect();
        await local.close().catch(() => {});
        return { ok: true };
    });
}

module.exports = { registerDbConnIpc };
