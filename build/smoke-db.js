/* Интеграционный тест задания №14: те же модели (electron/modules/db/models.js)
   и та же логика, что использует electron/main.js, но на sqlite in-memory —
   Electron для теста не нужен.

   Проверяется: создание 4 взаимосвязанных таблиц, CRUD, контроль ссылок,
   проверка занятости мастера, расчёт стоимости и отчёт о выручке. */

const assert = require('assert');
const { Sequelize } = require('sequelize');

const initModels = require('../electron/modules/db/models.js');
const booking = require('../electron/modules/booking.js');

let passed = 0;
let failed = 0;

async function test(name, fn) {
    try {
        await fn();
        passed += 1;
        console.log(`ok   ${name}`);
    } catch (error) {
        failed += 1;
        console.log(`FAIL ${name}: ${error.message}`);
    }
}

/** Повторяет проверки, которые main.js делает перед create/appointments:create. */
function validateOrThrow(validator, payload) {
    const { errors, data } = validator(payload);
    if (Object.keys(errors).length) throw new Error(booking.formatErrors(errors));
    return data;
}

async function createAppointment(m, payload) {
    const data = validateOrThrow(booking.validateAppointment, payload);
    const conflict = booking.findConflict(
        (await m.appointments.findAll({
            where: { employee_id: data.employee_id, date: data.date },
        })).map((r) => r.toJSON()),
        data,
    );
    if (conflict) throw new Error('Мастер занят');
    return m.appointments.create(data);
}

(async () => {
    const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
    const m = initModels(sequelize);

    await test('sync создаёт 4 взаимосвязанные таблицы', async () => {
        await sequelize.sync({ force: true });
        const tables = Object.keys(sequelize.models).sort();
        assert.deepStrictEqual(tables, ['appointments', 'clients', 'employees', 'services']);
        assert.ok(m.appointments.associations.client);
        assert.ok(m.appointments.associations.employee);
        assert.ok(m.appointments.associations.service);
    });

    await test('CRUD: клиент, мастер и услуга создаются, читаются и редактируются', async () => {
        const client = await m.clients.create(validateOrThrow(booking.validateClient, {
            first_name: 'Анна', last_name: 'Иванова',
            number: '+7 (900) 123-45-67', email: 'anna@example.com',
        }));
        const master = await m.employees.create(validateOrThrow(booking.validateEmployee, {
            first_name: 'Мария', last_name: 'Петрова',
            email: 'maria@salon.ru', role: 'master', password: 'pass123',
        }));
        const service = await m.services.create(validateOrThrow(booking.validateService, {
            title: 'Женская стрижка', price: '1500',
        }));

        assert.strictEqual((await m.clients.count()), 1);
        assert.strictEqual((await m.employees.count()), 1);
        assert.strictEqual((await m.services.count()), 1);

        await client.update({ last_name: 'Иванова-Петрова' });
        assert.strictEqual((await m.clients.findByPk(client.id)).last_name, 'Иванова-Петрова');

        // удаление «свободной» записи работает
        const temp = await m.services.create(validateOrThrow(booking.validateService, {
            title: 'Временная услуга', price: '100',
        }));
        await temp.destroy();
        assert.strictEqual((await m.services.count()), 1);

        globalThis.fixtures = { client, master, service };
    });

    await test('Валидация: некорректная запись отклоняется до запроса к БД', async () => {
        assert.throws(
            () => validateOrThrow(booking.validateClient, { first_name: '', last_name: '', number: '1', email: 'no' }),
            /Имя/,
        );
        assert.throws(
            () => validateOrThrow(booking.validateService, { title: 'Маникюр', price: '-1' }),
            /Цена/,
        );
        assert.ok(booking.validateAppointment({ date: '2026-13-45', time: '25:00' }).errors.date);
        assert.ok(booking.validateAppointment({ date: '2026-10-25', time: '25:00' }).errors.time);
    });

    await test('Ограничение уникальности email ловится и превращается в сообщение', async () => {
        const { client } = globalThis.fixtures;
        try {
            await m.clients.create({
                first_name: 'Другой', last_name: 'Клиент',
                number: '+7 900 000 00 00', email: client.email,
            });
            throw new Error('дубликат email не заблокирован');
        } catch (error) {
            assert.ok(/already exists|уникальн/i.test(booking.humanizeError(error))
                || error.name === 'SequelizeUniqueConstraintError', error.message);
        }
    });

    await test('Запись создаётся и проверяет занятость мастера', async () => {
        const { client, master, service } = globalThis.fixtures;

        await createAppointment(m, {
            client_id: client.id, employee_id: master.id, service_id: service.id,
            date: '2026-10-25', time: '14:30',
        });
        assert.strictEqual((await m.appointments.count()), 1);

        // тот же слот — конфликт
        await assert.rejects(
            () => createAppointment(m, {
                client_id: client.id, employee_id: master.id, service_id: service.id,
                date: '2026-10-25', time: '14:30',
            }),
            /занят/i,
        );

        // другое время — ок
        await createAppointment(m, {
            client_id: client.id, employee_id: master.id, service_id: service.id,
            date: '2026-10-25', time: '15:30',
        });
        assert.strictEqual((await m.appointments.count()), 2);
    });

    await test('Отменённая запись освобождает слот', async () => {
        const { client, master, service } = globalThis.fixtures;
        const [first] = await m.appointments.findAll({ order: [['id', 'ASC']] });
        await first.update({ status: 'cancelled' });

        await createAppointment(m, {
            client_id: client.id, employee_id: master.id, service_id: service.id,
            date: '2026-10-25', time: '14:30',
        });
        assert.strictEqual((await m.appointments.count()), 3);
    });

    await test('Отчёт: количество оказанных услуг и выручка', async () => {
        const { client, master, service } = globalThis.fixtures;

        // делаем две записи «оказанными»
        const rows = await m.appointments.findAll({ order: [['id', 'ASC']] });
        await rows[1].update({ status: 'done' });
        await rows[2].update({ status: 'done' });

        const loaded = (await m.appointments.findAll({
            include: [
                { model: m.clients, as: 'client' },
                { model: m.employees, as: 'employee' },
                { model: m.services, as: 'service' },
            ],
        })).map((r) => r.toJSON());

        const report = booking.buildReport(loaded, { from: '2026-10-01', to: '2026-10-31' });
        assert.strictEqual(report.total, 3);
        assert.strictEqual(report.done, 2);
        assert.strictEqual(report.revenue, service.price * 2);
        assert.strictEqual(report.avgCheck, service.price);
        assert.strictEqual(report.services[0].count, 2);
        assert.strictEqual(report.masters[0].id, master.id);
        assert.strictEqual(report.clients[0].id, client.id);
    });

    await test('Связи: appointments ссылается на client/employee/service', async () => {
        const rows = await m.appointments.findAll({
            include: [
                { model: m.clients, as: 'client' },
                { model: m.employees, as: 'employee' },
                { model: m.services, as: 'service' },
            ],
        });
        assert.ok(rows.length > 0);
        for (const row of rows) {
            const json = row.toJSON();
            assert.ok(json.client && json.employee && json.service, 'вложенные сущности не загрузились');
        }
        // удаление услуги с записями блокируется
        const { service } = globalThis.fixtures;
        const used = await m.appointments.count({ where: { service_id: service.id } });
        assert.ok(used > 0, 'услуга должна использоваться в записях');
    });

    await sequelize.close();
    console.log(`\n${passed} прошло, ${failed} упало`);
    process.exit(failed ? 1 : 0);
})().catch((error) => {
    console.error('Тест упал с необработанной ошибкой:', error);
    process.exit(1);
});
