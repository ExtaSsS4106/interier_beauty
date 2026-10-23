const { Sequelize } = require('sequelize');
const initModels = require('./models.js');
const { db_name } = require('./conf.js'); 
const ALLOWED_DIALECTS = ['mysql', 'postgres'];

let sequelize = null;
let models = null;

async function connect({ dialect, host, port, username, password }) {
  if (!ALLOWED_DIALECTS.includes(dialect)) {
    throw new Error('Неподдерживаемый тип БД');
  }

  // закрываем прошлое подключение, если было
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    models = null;
  }

  const instance = new Sequelize(db_name, username, password, {
    dialect,
    host,
    port,
    logging: false,
    pool: { acquire: 5000 },   // ждать подключения максимум 5 секунд
  });
  await instance.authenticate();   // бросит ошибку, если не вышло

  sequelize = instance;
  models = initModels(sequelize);
  await sequelize.sync();          // создаст таблицы, если их нет
  return models;
}

function getModels() {
  if (!models) throw new Error('Нет подключения к БД');
  return models;
}

async function disconnect() {
  if (sequelize) await sequelize.close();
  sequelize = null;
  models = null;
}

module.exports = { connect, getModels, disconnect };