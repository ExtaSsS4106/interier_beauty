/* Единственное изменяемое состояние главного процесса:
   - какая БД подключена сейчас (activeDb);
   - кто вошёл в систему (session).

   Вынесено в отдельный модуль, чтобы все IPC-обработчики делили одно
   состояние через require (Node кэширует модуль), а не дублировали. */

const local = require('./db/local.js');
const remote = require('./db/remoute.js');
const booking = require('./booking.js');

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

function setActiveDb(name) {
    activeDb = name;
}

function resetActiveDb() {
    activeDb = null;
}

/* --------------------------- Сессия и права --------------------------- */
// Кто сейчас вошёл в систему. Права проверяются здесь, в main-процессе:
// renderer может только показать/спрятать кнопки, но не обойти проверку.
let session = null;

function currentSession() {
    if (!session) throw new Error('Сессия не активна — войдите в систему.');
    return session;
}

function requirePermission(action) {
    const user = currentSession();
    if (!booking.can(user.role, action)) {
        throw new Error('Недостаточно прав для этого действия.');
    }
    return user;
}

function startSession(employee) {
    session = {
        id: employee.id,
        email: employee.email,
        role: booking.normalizeRole(employee.role),
        first_name: employee.first_name,
        last_name: employee.last_name,
    };
    return session;
}

function clearSession() {
    session = null;
}

module.exports = {
    getDbModels,
    setActiveDb,
    resetActiveDb,
    currentSession,
    requirePermission,
    startSession,
    clearSession,
};
