/* Юнит-тесты предметной логики задания №14 (electron/modules/booking.js):
   валидация ввода, проверка занятости мастера, расчёт стоимости и отчёт. */

const assert = require('assert');
const booking = require('../electron/modules/booking.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed += 1;
        console.log(`ok   ${name}`);
    } catch (error) {
        failed += 1;
        console.log(`FAIL ${name}: ${error.message}`);
    }
}

/* ------------------------------ Валидация ------------------------------ */

test('validateClient: корректные данные проходят', () => {
    const { errors, data } = booking.validateClient({
        first_name: ' Анна ', last_name: ' Иванова ', number: '+7 (900) 123-45-67',
        email: 'anna@example.com',
    });
    assert.deepStrictEqual(errors, {});
    assert.strictEqual(data.first_name, 'Анна');
    assert.strictEqual(data.email, 'anna@example.com');
});

test('validateClient: пустые поля и кривой email/телефон дают ошибки', () => {
    const { errors } = booking.validateClient({ first_name: '', last_name: '', number: 'abc', email: 'x' });
    assert.ok(errors.first_name && errors.last_name && errors.number && errors.email);
});

test('validateEmployee: пароль обязателен только при создании', () => {
    const create = booking.validateEmployee({
        first_name: 'Мария', last_name: 'Петрова', email: 'm@x.ru', role: 'master', password: '',
    });
    assert.ok(create.errors.password, 'при создании пароль обязателен');

    const update = booking.validateEmployee({
        id: 5, first_name: 'Мария', last_name: 'Петрова', email: 'm@x.ru', role: 'master', password: '',
    });
    assert.deepStrictEqual(update.errors, {});
    assert.ok(!('password' in update.data), 'пустой пароль не должен попадать в данные');
});

test('validateEmployee: роль вне списка отклоняется', () => {
    const { errors } = booking.validateEmployee({
        first_name: 'А', last_name: 'Б', email: 'a@b.ru', role: 'root', password: 'pass123',
    });
    assert.ok(errors.role);
});

test('validateService: цена должна быть числом не меньше нуля', () => {
    assert.deepStrictEqual(booking.validateService({ title: 'Стрижка', price: '1500' }).errors, {});
    assert.ok(booking.validateService({ title: 'Стрижка', price: '-5' }).errors.price);
    assert.ok(booking.validateService({ title: 'Стрижка', price: 'abc' }).errors.price);
    assert.ok(booking.validateService({ title: '', price: '100' }).errors.title);
});

test('validateService: нормализует цену и описание', () => {
    const { data } = booking.validateService({ title: ' Маникюр ', price: '1200', description: '' });
    assert.strictEqual(data.title, 'Маникюр');
    assert.strictEqual(data.price, 1200);
    assert.strictEqual(data.description, null);
});

test('validateAppointment: дата/время и ссылки обязательны', () => {
    const { errors } = booking.validateAppointment({ date: '25.10.2026', time: '9:00' });
    assert.ok(errors.date && errors.time && errors.client_id && errors.employee_id && errors.service_id);
});

test('validateAppointment: корректные данные нормализуются', () => {
    const { errors, data } = booking.validateAppointment({
        date: '2026-10-25', time: '14:30', client_id: '3', employee_id: 2, service_id: 1,
    });
    assert.deepStrictEqual(errors, {});
    assert.strictEqual(data.time, '14:30:00');
    assert.strictEqual(data.client_id, 3);
    assert.strictEqual(data.status, 'new');
});

test('isDate: отбрасывает несуществующие даты', () => {
    assert.ok(booking.isDate('2026-02-29') === false);
    assert.ok(booking.isDate('2024-02-29') === true);
    assert.ok(booking.isDate('2026-13-01') === false);
});

/* --------------------- Занятость мастера и стоимость -------------------- */

const base = { id: 10, employee_id: 7, date: '2026-10-25', time: '14:30:00', status: 'new' };

test('findConflict: тот же мастер, дата и время — слот занят', () => {
    assert.ok(booking.findConflict([base], { employee_id: 7, date: '2026-10-25', time: '14:30' }));
});

test('findConflict: другой мастер/дата/время — слот свободен', () => {
    assert.strictEqual(booking.findConflict([base], { employee_id: 8, date: '2026-10-25', time: '14:30' }), null);
    assert.strictEqual(booking.findConflict([base], { employee_id: 7, date: '2026-10-26', time: '14:30' }), null);
    assert.strictEqual(booking.findConflict([base], { employee_id: 7, date: '2026-10-25', time: '15:00' }), null);
});

test('findConflict: отменённая запись слот не занимает', () => {
    const cancelled = { ...base, status: 'cancelled' };
    assert.strictEqual(booking.findConflict([cancelled], { employee_id: 7, date: '2026-10-25', time: '14:30' }), null);
    // и новая отменённая запись тоже не конфликтует
    assert.strictEqual(booking.findConflict([base], {
        employee_id: 7, date: '2026-10-25', time: '14:30', status: 'cancelled',
    }), null);
});

test('findConflict: при редактировании своя запись игнорируется', () => {
    assert.strictEqual(booking.findConflict([base], { ...base, id: 10 }), null);
});

test('visitCost/totalCost: считают стоимость посещения', () => {
    assert.strictEqual(booking.visitCost({ price: 1500 }), 1500);
    assert.strictEqual(booking.visitCost(null), 0);
    assert.strictEqual(booking.totalCost([{ price: 1000 }, { price: 500 }]), 1500);
});

/* -------------------------------- Отчёт -------------------------------- */

const rows = [
    { date: '2026-10-01', status: 'done', client_id: 1, employee_id: 7, service_id: 1,
        client: { id: 1, first_name: 'Анна', last_name: 'Иванова' },
        employee: { id: 7, first_name: 'Мария', last_name: 'Петрова' },
        service: { id: 1, title: 'Стрижка', price: 1500 } },
    { date: '2026-10-10', status: 'done', client_id: 2, employee_id: 7, service_id: 1,
        client: { id: 2, first_name: 'Ольга', last_name: 'Сидорова' },
        employee: { id: 7, first_name: 'Мария', last_name: 'Петрова' },
        service: { id: 1, title: 'Стрижка', price: 1500 } },
    { date: '2026-10-15', status: 'cancelled', client_id: 1, employee_id: 8, service_id: 2,
        client: { id: 1, first_name: 'Анна', last_name: 'Иванова' },
        employee: { id: 8, first_name: 'Елена', last_name: 'Кузнецова' },
        service: { id: 2, title: 'Маникюр', price: 900 } },
    { date: '2026-11-05', status: 'new', client_id: 3, employee_id: 8, service_id: 2,
        client: { id: 3, first_name: 'Ирина', last_name: 'Волкова' },
        employee: { id: 8, first_name: 'Елена', last_name: 'Кузнецова' },
        service: { id: 2, title: 'Маникюр', price: 900 } },
];

test('buildReport: выручка считается только по оказанным услугам', () => {
    const report = booking.buildReport(rows, { from: '2026-10-01', to: '2026-10-31' });
    assert.strictEqual(report.total, 3);
    assert.strictEqual(report.done, 2);
    assert.strictEqual(report.revenue, 3000);
    assert.strictEqual(report.planned, 3000);           // отменённая не входит в план
    assert.strictEqual(report.avgCheck, 1500);
    assert.deepStrictEqual(report.statuses, { new: 0, accepted: 0, done: 2, cancelled: 1 });
});

test('buildReport: статус «Принята» входит в план, но не в выручку', () => {
    const accepted = [...rows,
        { date: '2026-10-20', status: 'accepted', client_id: 4, employee_id: 7, service_id: 2,
            client: { id: 4, first_name: 'Полина', last_name: 'Морозова' },
            employee: { id: 7, first_name: 'Мария', last_name: 'Петрова' },
            service: { id: 2, title: 'Маникюр', price: 900 } },
    ];
    const report = booking.buildReport(accepted, { from: '2026-10-01', to: '2026-10-31' });
    assert.strictEqual(report.statuses.accepted, 1);
    assert.strictEqual(report.revenue, 3000, 'выручка только по оказанным');
    assert.strictEqual(report.planned, 3900, 'принятая попадает в план');
    assert.strictEqual(report.done, 2);
});

test('buildReport: bounds сообщает диапазон дат в базе', () => {
    const report = booking.buildReport(rows, { from: '2027-01-01', to: '2027-01-31' });
    assert.strictEqual(report.total, 0, 'за 2027 год записей нет');
    assert.deepStrictEqual(report.bounds, { min: '2026-10-01', max: '2026-11-05', total: 4 });
});

test('buildReport: разбивка по услугам, мастерам и клиентам', () => {
    const report = booking.buildReport(rows, {});
    assert.strictEqual(report.services.length, 1);      // маникюр не оказывался
    assert.strictEqual(report.services[0].title, 'Стрижка');
    assert.strictEqual(report.services[0].count, 2);
    assert.strictEqual(report.masters[0].name, 'Мария Петрова');
    assert.strictEqual(report.masters[0].revenue, 3000);
    assert.strictEqual(report.clients[0].name, 'Анна Иванова');
});

test('buildReport: без дат показываются все записи', () => {
    const report = booking.buildReport(rows, {});
    assert.strictEqual(report.total, 4);
    assert.strictEqual(report.revenue, 3000);
});

/* ---------------------------- Роли и права ----------------------------- */

test('ROLES: админ/менеджер/мастер и статус «Принята»', () => {
    assert.deepStrictEqual(booking.ROLES, ['admin', 'manager', 'master']);
    assert.deepStrictEqual(booking.STATUSES, ['new', 'accepted', 'done', 'cancelled']);
    assert.strictEqual(booking.STATUS_LABELS.accepted, 'Принята');
});

test('normalizeRole: легаси «user» — это менеджер, мусор — мастер', () => {
    assert.strictEqual(booking.normalizeRole('user'), 'manager');
    assert.strictEqual(booking.normalizeRole('admin'), 'admin');
    assert.strictEqual(booking.normalizeRole(''), 'master');
    assert.strictEqual(booking.normalizeRole(null), 'master');
    assert.strictEqual(booking.normalizeRole('root'), 'master');
});

test('can: админ может всё', () => {
    for (const action of booking.ACTIONS) {
        assert.strictEqual(booking.can('admin', action), true, action);
    }
});

test('can: менеджер принимает клиентов, но не заводит сотрудников/услуги', () => {
    assert.strictEqual(booking.can('manager', 'clients.write'), true);
    assert.strictEqual(booking.can('manager', 'appointments.write'), true);
    assert.strictEqual(booking.can('manager', 'appointments.status'), true);
    assert.strictEqual(booking.can('manager', 'reports.read'), true);
    assert.strictEqual(booking.can('manager', 'employees.write'), false);
    assert.strictEqual(booking.can('manager', 'services.write'), false);
});

test('can: мастер только видит свои заказы, принимает и отмечает', () => {
    assert.strictEqual(booking.can('master', 'appointments.read'), true);
    assert.strictEqual(booking.can('master', 'appointments.status'), true);
    assert.strictEqual(booking.can('master', 'appointments.write'), false);
    assert.strictEqual(booking.can('master', 'clients.read'), false);
    assert.strictEqual(booking.can('master', 'reports.read'), false);
});

test('permissionsFor: плоские булевы права для шаблонов', () => {
    const admin = booking.permissionsFor('admin');
    assert.strictEqual(admin.role, 'admin');
    assert.strictEqual(admin.clientsWrite, true);
    assert.strictEqual(admin.employeesWrite, true);
    assert.strictEqual(admin.servicesWrite, true);

    const manager = booking.permissionsFor('user');        // легаси-роль
    assert.strictEqual(manager.role, 'manager');
    assert.strictEqual(manager.clientsWrite, true);
    assert.strictEqual(manager.employeesWrite, false);
    assert.strictEqual(manager.servicesWrite, false);
    assert.strictEqual(manager.reportsRead, true);

    const master = booking.permissionsFor('master');
    assert.strictEqual(master.appointmentsWrite, false);
    assert.strictEqual(master.appointmentsStatus, true);
    assert.strictEqual(master.clientsRead, false);
});

test('formatDate/formatTime приводят данные из БД к виду для UI', () => {
    assert.strictEqual(booking.formatDate('2026-10-25'), '25.10.2026');
    assert.strictEqual(booking.formatTime('14:30:00'), '14:30');
    assert.strictEqual(booking.formatTime('9:00'), '');
});

test('monthRange возвращает границы месяца', () => {
    const range = booking.monthRange(new Date(2026, 1, 10));   // февраль 2026
    assert.deepStrictEqual(range, { from: '2026-02-01', to: '2026-02-28' });
});

test('humanizeError переводит ошибки Sequelize на человеческий язык', () => {
    const unique = { name: 'SequelizeUniqueConstraintError', errors: [{ path: 'email' }] };
    assert.ok(booking.humanizeError(unique).includes('email'));
    assert.strictEqual(booking.humanizeError(new Error('boom')), 'boom');
});

test('formatErrors подписывает поля', () => {
    assert.strictEqual(booking.formatErrors({ email: 'Введите корректный email.' }),
        'Email: Введите корректный email.');
});

console.log(`\n${passed} прошло, ${failed} упало`);
process.exit(failed ? 1 : 0);
