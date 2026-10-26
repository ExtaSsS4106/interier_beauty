/* Справочник услуг: CRUD (цена участвует в расчёте стоимости посещения). */

const { ipcMain } = require('electron');
const booking = require('../booking.js');
const {
    guard, models, toJson, ensure, usedByAppointments,
} = require('./context.js');

function registerServicesIpc() {
    ipcMain.handle('services:list', guard('services.read', async () => {
        const rows = await models().services.findAll({ order: [['title', 'ASC']] });
        return rows.map(toJson);
    }));

    ipcMain.handle('services:create', guard('services.write', async (payload) => {
        const { errors, data } = booking.validateService(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        return toJson(await models().services.create(data));
    }));

    ipcMain.handle('services:update', guard('services.write', async (payload) => {
        const { errors, data } = booking.validateService(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
        const row = await ensure(models().services, payload.id, 'Услуга');
        await row.update(data);
        return toJson(row);
    }));

    ipcMain.handle('services:delete', guard('services.write', async (id) => {
        const m = models();
        const row = await ensure(m.services, id, 'Услуга');
        const used = await usedByAppointments(m, 'service_id', row.id);
        if (used) throw new Error(`Нельзя удалить услугу: на неё оформлено записей — ${used}.`);
        await row.destroy();
        return { id: row.id };
    }));
}

module.exports = { registerServicesIpc };
