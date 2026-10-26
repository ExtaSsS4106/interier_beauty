/* Записи клиентов: создание с проверкой занятости мастера, изменение
   (мастеру — только смена статуса своих записей), удаление. */

const { ipcMain } = require('electron');
const booking = require('../booking.js');
const {
    guard, models, toJson, appointmentInclude, ensure,
} = require('./context.js');
const { currentSession } = require('../state.js');

function registerAppointmentsIpc() {
    ipcMain.handle('appointments:list', guard('appointments.read', async () => {
        const m = models();
        const user = currentSession();
        // Мастер видит только свои заказы, админ и менеджер — все
        const where = booking.can(user.role, 'appointments.write') ? {} : { employee_id: user.id };
        const rows = await m.appointments.findAll({
            where,
            include: appointmentInclude(m),
            order: [['date', 'DESC'], ['time', 'ASC']],
        });
        return rows.map(toJson);
    }));

    ipcMain.handle('appointments:create', guard('appointments.write', async (payload) => {
        const { errors, data } = booking.validateAppointment(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));

        const m = models();
        const [client, employee, service] = await Promise.all([
            ensure(m.clients, data.client_id, 'Клиент'),
            ensure(m.employees, data.employee_id, 'Мастер'),
            ensure(m.services, data.service_id, 'Услуга'),
        ]);

        // Проверка занятости мастера на дату и время
        const busy = await m.appointments.findAll({
            where: { employee_id: data.employee_id, date: data.date },
            include: appointmentInclude(m),
        });
        const conflict = booking.findConflict(busy.map(toJson), data);
        if (conflict) {
            const who = conflict.client
                ? `${conflict.client.first_name} ${conflict.client.last_name}`.trim()
                : 'клиент';
            throw new Error(
                `Мастер занят: ${booking.formatDate(conflict.date)} в ${booking.formatTime(conflict.time)} `
                + `уже записан(а) ${who}.`,
            );
        }

        const row = await m.appointments.create(data);
        return {
            ...toJson(row),
            client: toJson(client),
            employee: toJson(employee),
            service: toJson(service),
            cost: booking.visitCost(service),
        };
    }));

    ipcMain.handle('appointments:update', guard('appointments.status', async (payload) => {
        const { errors, data } = booking.validateAppointment(payload);
        if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));

        const m = models();
        const user = currentSession();
        const row = await ensure(m.appointments, payload.id, 'Запись');

        // Мастер без права «записи»: только свои заказы и только смена статуса
        if (!booking.can(user.role, 'appointments.write')) {
            if (Number(row.employee_id) !== Number(user.id)) {
                throw new Error('Можно изменять только свои записи.');
            }
            const unchanged = ['date', 'time', 'client_id', 'employee_id', 'service_id']
                .every((key) => String(row[key]) === String(data[key]));
            if (!unchanged) {
                throw new Error('Мастер может менять только статус записи.');
            }
            await row.update({ status: data.status });
            return toJson(row);
        }

        const [client, employee, service] = await Promise.all([
            ensure(m.clients, data.client_id, 'Клиент'),
            ensure(m.employees, data.employee_id, 'Мастер'),
            ensure(m.services, data.service_id, 'Услуга'),
        ]);

        const busy = await m.appointments.findAll({
            where: { employee_id: data.employee_id, date: data.date },
            include: appointmentInclude(m),
        });
        const conflict = booking.findConflict(busy.map(toJson), { ...data, id: row.id });
        if (conflict) {
            const who = conflict.client
                ? `${conflict.client.first_name} ${conflict.client.last_name}`.trim()
                : 'клиент';
            throw new Error(
                `Мастер занят: ${booking.formatDate(conflict.date)} в ${booking.formatTime(conflict.time)} `
                + `уже записан(а) ${who}.`,
            );
        }

        await row.update(data);
        return {
            ...toJson(row),
            client: toJson(client),
            employee: toJson(employee),
            service: toJson(service),
            cost: booking.visitCost(service),
        };
    }));

    ipcMain.handle('appointments:delete', guard('appointments.write', async (id) => {
        const row = await ensure(models().appointments, id, 'Запись');
        await row.destroy();
        return { id: row.id };
    }));
}

module.exports = { registerAppointmentsIpc };
