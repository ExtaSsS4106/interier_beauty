/* Справочник клиентов: чтение, создание, изменение, удаление.
   clients:getAll — легаси-канал без проверки прав (используется страницей
   входа/регистрации); основной рабочий список — clients:list с guard. */

const { ipcMain } = require('electron');
const booking = require('../booking.js');
const {
    guard, models, toJson, ensure, usedByAppointments, appointmentCounts,
} = require('./context.js');

function registerClientsIpc() {
    // Пример: данные тоже отдаёте через IPC, модели в renderer не передать
    ipcMain.handle('clients:getAll', async () => {
        const { clients } = models();
        const rows = await clients.findAll();
        return rows.map((r) => r.toJSON());   // обычные объекты, не инстансы Sequelize
    });

    ipcMain.handle('clients:list', guard('clients.read', async () => {
        const m = models();
        const rows = await m.clients.findAll({ order: [['last_name', 'ASC'], ['first_name', 'ASC']] });
        const counts = await appointmentCounts(m, 'client_id');
        return rows.map((r) => ({ ...toJson(r), appointments_count: counts.get(Number(r.id)) || 0 }));
    }));

    ipcMain.handle('clients:create', guard('clients.write', async (payload) => {
        const { errors, data } = booking.validateClient(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().clients.create(data));
    }));

    ipcMain.handle('clients:update', guard('clients.write', async (payload) => {
        const { errors, data } = booking.validateClient(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().clients, payload.id, 'Клиент');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('clients:delete', guard('clients.write', async (id) => {
        const m = models();
        const row = await ensure(m.clients, id, 'Клиент');
        const used = await usedByAppointments(m, 'client_id', row.id);
        if (used) throw new Error(`Нельзя удалить клиента: к нему привязано записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));
}

module.exports = { registerClientsIpc };
