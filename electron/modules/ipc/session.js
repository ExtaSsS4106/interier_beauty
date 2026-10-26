/* Вход в систему и сессия: регистрация сотрудника, логин, выход.
   Проверка прав для первого сотрудника («в пустую») и для всех дальше. */

const { ipcMain } = require('electron');
const booking = require('../booking.js');
const {
    getDbModels,
    requirePermission,
    startSession,
    clearSession,
} = require('../state.js');

function registerSessionIpc() {
    ipcMain.handle('admin:register', async (event, payload) => {
        const { employees } = getDbModels();

        try {
            // «В пустую» регистрация нужна только для первого сотрудника:
            // дальше заводить администраторов может лишь тот, у кого есть права.
            if ((await employees.count()) > 0) requirePermission('employees.write');

            const newEmployee = await employees.create({
                first_name: payload.first_name,
                last_name: payload.last_name,
                email: payload.email,
                role: booking.normalizeRole(payload.role),
                password: payload.password,
            });

            // Первый зарегистрированный сотрудник сразу входит в систему
            const user = startSession(newEmployee);
            return {
                ok: true,
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    permissions: booking.permissionsFor(user.role),
                },
            };
        } catch (err) {
            return { ok: false, error: booking.humanizeError(err) };
        }
    });

    ipcMain.handle('employees:login', async (event, { email, password }) => {
        const { employees } = getDbModels();
        const user = await employees.findOne({ where: { email } });

        if (!user || password !== user.password) {
            return { ok: false, error: 'Неверный email или пароль' };
        }

        const sessionUser = startSession(user);
        return {
            ok: true,
            data: {
                id: sessionUser.id,
                first_name: sessionUser.first_name,
                last_name: sessionUser.last_name,
                email: sessionUser.email,
                role: sessionUser.role,          // нормализованная роль
                permissions: booking.permissionsFor(sessionUser.role),
            },
        };
    });

    // Выход: сбрасываем права, чтобы без входа ничего нельзя было делать
    ipcMain.handle('session:logout', async () => {
        clearSession();
        return { ok: true };
    });
}

module.exports = { registerSessionIpc };
