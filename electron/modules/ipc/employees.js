/* Справочник сотрудников (мастера, менеджеры, админы): CRUD.
   employees:getAll — легаси-канал без проверки прав; основной список —
   employees:list с guard('employees.read'). */

const { ipcMain } = require('electron');
const booking = require('../booking.js');
const {
    guard, models, toJson, ensure, usedByAppointments, appointmentCounts,
} = require('./context.js');

function registerEmployeesIpc() {
    ipcMain.handle('employees:getAll', async () => {
        const { employees } = models();
        const rows = await employees.findAll();
        return rows.map((r) => r.toJSON());   // обычные объекты, не инстансы Sequelize
    });

    ipcMain.handle('employees:list', guard('employees.read', async () => {
        const m = models();
        const rows = await m.employees.findAll({ order: [['last_name', 'ASC'], ['first_name', 'ASC']] });
        const counts = await appointmentCounts(m, 'employee_id');
        return rows.map((r) => ({ ...toJson(r), appointments_count: counts.get(Number(r.id)) || 0 }));
    }));

    ipcMain.handle('employees:create', guard('employees.write', async (payload) => {
        const { errors, data } = booking.validateEmployee(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().employees.create(data));
    }));

    ipcMain.handle('employees:update', guard('employees.write', async (payload) => {
        const { errors, data } = booking.validateEmployee(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().employees, payload.id, 'Сотрудник');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('employees:delete', guard('employees.write', async (id) => {
        const m = models();
        const row = await ensure(m.employees, id, 'Сотрудник');
        const used = await usedByAppointments(m, 'employee_id', row.id);
        if (used) throw new Error(`Нельзя удалить мастера: к нему привязано записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));
}

module.exports = { registerEmployeesIpc };
