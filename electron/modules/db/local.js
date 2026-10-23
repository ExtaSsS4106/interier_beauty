const { Sequelize } = require('sequelize');
const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const initModels = require('./models.js');

const dbFile = () => path.join(app.getPath('userData'), 'app.db');

let sequelize = null;
let models = null;
let configured = fs.existsSync(dbFile()); // файл появился только если sqlite реально подключали

// создаём только когда кто-то реально обратился к БД
function getSequelize() {
    if (!sequelize) {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbFile(),
            logging: false,
        });
        models = initModels(sequelize);
    }
    return sequelize;
}

async function initDb() {
    await getSequelize().sync();   // создаёт файл + таблицы
    configured = true;
}

async function checkConnection() {
    // уже открыто — просто проверить, что отвечает
    if (sequelize) {
        try { await sequelize.authenticate(); return true; } catch { return false; }
    }
    // ещё не открыто — проверить, что файл вообще есть
    if (!fs.existsSync(DB_PATH())) return false;

    // файл есть — попробуем открыть (только здесь, не в шаблоне)
    try {
        await initDb();
        return true;
    } catch {
        return false;
    }
}

function getModels() {
    if (!models) throw new Error('Локальная БД не инициализирована');
    return models;
}

async function close() {
    if (sequelize) { await sequelize.close(); sequelize = null; models = null; }
}

module.exports = { initDb, checkConnection, getModels, close };