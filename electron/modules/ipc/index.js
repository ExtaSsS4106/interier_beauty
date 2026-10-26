/* Регистрация всех IPC-каналов главного процесса.
   Каждый раздел живёт в своём модуле; здесь они только собираются
   в один вызов registerIpc() из main.js. */

const { registerAuthIpc } = require('./auth.js');
const { registerDbConnIpc } = require('./db-conn.js');
const { registerSessionIpc } = require('./session.js');
const { registerClientsIpc } = require('./clients.js');
const { registerEmployeesIpc } = require('./employees.js');
const { registerServicesIpc } = require('./services.js');
const { registerAppointmentsIpc } = require('./appointments.js');
const { registerReportsIpc } = require('./reports.js');

function registerIpc() {
    registerAuthIpc();          // auth:*, db_config:*
    registerDbConnIpc();        // db:checkConn / db:login / db:logout
    registerSessionIpc();       // admin:register, employees:login, session:logout
    registerClientsIpc();       // clients:*
    registerEmployeesIpc();     // employees:*
    registerServicesIpc();      // services:*
    registerAppointmentsIpc();  // appointments:*
    registerReportsIpc();       // reports:*
}

module.exports = { registerIpc };
