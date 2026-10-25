/* Предметная логика задания №14 «Управление записью в салон красоты».
   Здесь только чистые функции: валидация ввода, проверка занятости мастера,
   расчёт стоимости посещения и построение отчёта. Ни Electron, ни Sequelize
   не нужны — поэтому логику покрывает обычный node-тест build/smoke-booking.js,
   а main.js лишь собирает её с запросами к БД. */

'use strict';

/* ============================== Константы ============================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9()\- ]{5,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const ROLES = ['admin', 'user', 'master'];
const ROLE_LABELS = { admin: 'Администратор', user: 'Пользователь', master: 'Мастер' };

const STATUSES = ['new', 'done', 'cancelled'];
const STATUS_LABELS = { new: 'Записана', done: 'Оказана', cancelled: 'Отменена' };

const FIELD_LABELS = {
    first_name: 'Имя',
    last_name: 'Фамилия',
    number: 'Телефон',
    email: 'Email',
    role: 'Роль',
    password: 'Пароль',
    title: 'Название',
    price: 'Цена',
    description: 'Описание',
    date: 'Дата',
    time: 'Время',
    client_id: 'Клиент',
    employee_id: 'Мастер',
    service_id: 'Услуга',
    status: 'Статус',
};

/* ============================== Утилиты ============================== */

const text = (v) => String(v === null || v === undefined ? '' : v).trim();

function isDate(value) {
    const v = text(value);
    if (!DATE_RE.test(v)) return false;
    const [y, m, d] = v.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function isTime(value) {
    return TIME_RE.test(text(value));
}

/** Приводит 'HH:MM' и 'HH:MM:SS' к единому виду для сравнения/отображения. */
function normalizeTime(value) {
    const v = text(value);
    if (!isTime(v)) return '';
    return v.length === 5 ? `${v}:00` : v;
}

/** '2026-10-25' → '25.10.2026' */
function formatDate(value) {
    const v = text(value);
    if (!isDate(v)) return '';
    const [y, m, d] = v.split('-');
    return `${d}.${m}.${y}`;
}

/** '14:30:00' → '14:30' */
function formatTime(value) {
    const v = normalizeTime(value);
    return v ? v.slice(0, 5) : '';
}

/** Локальная дата 'YYYY-MM-DD' (не UTC: важна для «сегодняшних» записей). */
function todayISO(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Первый и последний день месяца, в котором лежит `date`. */
function monthRange(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const last = new Date(y, date.getMonth() + 1, 0).getDate();
    return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(last).padStart(2, '0')}` };
}

/** Человеческий текст ошибки Sequelize (остальное — как есть). */
function humanizeError(error) {
    if (!error) return 'Неизвестная ошибка';
    const name = error.name || '';
    if (name === 'SequelizeUniqueConstraintError') {
        const fields = (error.errors || []).map((e) => e.path).filter(Boolean);
        return fields.length
            ? `Запись с такими данными уже существует: ${fields.join(', ')}`
            : 'Запись с такими данными уже существует';
    }
    if (name === 'SequelizeValidationError') {
        return (error.errors || []).map((e) => e.message).join('; ') || 'Некорректные данные';
    }
    if (name === 'SequelizeForeignKeyConstraintError') {
        return 'Связанная запись не найдена или ещё используется в других данных';
    }
    if (name === 'SequelizeConnectionError' || name === 'ECONNREFUSED') {
        return 'Нет соединения с базой данных';
    }
    return error.message || String(error);
}

/** { first_name: 'Введите имя.' } → 'Имя: введите имя.' */
function formatErrors(errors) {
    return Object.entries(errors || {})
        .map(([field, message]) => `${FIELD_LABELS[field] || field}: ${message}`)
        .join(' ');
}

/* ============================== Валидация ============================== */

function validateClient(input = {}) {
    const errors = {};
    const first_name = text(input.first_name);
    const last_name = text(input.last_name);
    const number = text(input.number);
    const email = text(input.email);

    if (!first_name) errors.first_name = 'Введите имя.';
    else if (first_name.length > 255) errors.first_name = 'Максимум 255 символов.';

    if (!last_name) errors.last_name = 'Введите фамилию.';
    else if (last_name.length > 255) errors.last_name = 'Максимум 255 символов.';

    if (!number) errors.number = 'Введите телефон.';
    else if (!PHONE_RE.test(number)) errors.number = 'Телефон: цифры, +, -, скобки и пробелы.';
    else if (number.replace(/\D/g, '').length < 5) errors.number = 'В телефоне должно быть не меньше 5 цифр.';

    if (!email) errors.email = 'Введите email.';
    else if (email.length > 255) errors.email = 'Максимум 255 символов.';
    else if (!EMAIL_RE.test(email)) errors.email = 'Введите корректный email.';

    return { errors, data: { first_name, last_name, number, email } };
}

function validateEmployee(input = {}) {
    const errors = {};
    const first_name = text(input.first_name);
    const last_name = text(input.last_name);
    const email = text(input.email);
    const role = text(input.role);
    const password = text(input.password);
    const isCreate = !input.id;

    if (!first_name) errors.first_name = 'Введите имя.';
    else if (first_name.length > 255) errors.first_name = 'Максимум 255 символов.';

    if (!last_name) errors.last_name = 'Введите фамилию.';
    else if (last_name.length > 255) errors.last_name = 'Максимум 255 символов.';

    if (!email) errors.email = 'Введите email.';
    else if (email.length > 255) errors.email = 'Максимум 255 символов.';
    else if (!EMAIL_RE.test(email)) errors.email = 'Введите корректный email.';

    if (!ROLES.includes(role)) errors.role = 'Выберите роль.';

    if (isCreate) {
        if (!password) errors.password = 'Введите пароль.';
        else if (password.length < 6) errors.password = 'Пароль должен содержать минимум 6 символов.';
        else if (!/[a-zA-Zа-яА-ЯёЁ]/.test(password) || !/\d/.test(password)) {
            errors.password = 'Пароль должен содержать буквы и цифры.';
        }
    } else if (password && password.length < 6) {
        errors.password = 'Пароль должен содержать минимум 6 символов.';
    }

    const data = { first_name, last_name, email, role };
    if (password) data.password = password; // пустой пароль при редактировании = «не менять»
    return { errors, data };
}

function validateService(input = {}) {
    const errors = {};
    const title = text(input.title);
    const rawPrice = text(input.price);
    const description = text(input.description);

    if (!title) errors.title = 'Введите название услуги.';
    else if (title.length > 255) errors.title = 'Максимум 255 символов.';

    if (!rawPrice) errors.price = 'Введите цену.';
    else if (!/^\d+(\.\d{1,2})?$/.test(rawPrice)) errors.price = 'Цена — число не меньше нуля.';
    else if (Number(rawPrice) < 0) errors.price = 'Цена не может быть отрицательной.';
    else if (description.length > 2000) errors.description = 'Максимум 2000 символов.';

    return { errors, data: { title, price: Number(rawPrice) || 0, description: description || null } };
}

function validateAppointment(input = {}) {
    const errors = {};
    const date = text(input.date);
    const time = text(input.time);
    const status = text(input.status) || 'new';

    const toId = (v) => {
        const n = Number(v);
        return Number.isInteger(n) && n > 0 ? n : NaN;
    };
    const client_id = toId(input.client_id);
    const employee_id = toId(input.employee_id);
    const service_id = toId(input.service_id);

    if (!isDate(date)) errors.date = 'Укажите дату в формате ГГГГ-ММ-ДД.';
    if (!isTime(time)) errors.time = 'Укажите время в формате ЧЧ:ММ.';
    if (Number.isNaN(client_id)) errors.client_id = 'Выберите клиента.';
    if (Number.isNaN(employee_id)) errors.employee_id = 'Выберите мастера.';
    if (Number.isNaN(service_id)) errors.service_id = 'Выберите услугу.';
    if (!STATUSES.includes(status)) errors.status = 'Недопустимый статус.';

    return { errors, data: { date, time: normalizeTime(time), client_id, employee_id, service_id, status } };
}

/* ==================== Занятость мастера и стоимость ==================== */

/** Слот свободен, если у мастера в ту же дату/время нет неотменённых записей. */
function findConflict(rows, target) {
    if (!Array.isArray(rows) || !target) return null;
    const wantedDate = text(target.date);
    const wantedTime = normalizeTime(target.time);
    if (!wantedDate || !wantedTime) return null;
    if (text(target.status) === 'cancelled') return null;

    return rows.find((row) => {
        if (String(row.id) === String(target.id)) return false;        // это же редактирование
        if (String(row.employee_id) !== String(target.employee_id)) return false;
        if (text(row.date) !== wantedDate) return false;
        if (text(row.status) === 'cancelled') return false;            // отменённая не занимает слот
        return normalizeTime(row.time) === wantedTime;
    }) || null;
}

/** Стоимость посещения = цена выбранной услуги. */
function visitCost(service) {
    const price = Number(service && service.price);
    return Number.isFinite(price) && price > 0 ? price : 0;
}

/** Сумма всех неотменённых стоимостей (для предварительного расчёта). */
function totalCost(services) {
    return (Array.isArray(services) ? services : []).reduce((sum, s) => sum + visitCost(s), 0);
}

/* ============================== Отчёт ============================== */

/**
 * Отчёт по оказанным услугам и выручке.
 * @param {Array} rows  записи (appointments) с вложенными client/employee/service
 * @param {Object} opts { from, to } — границы периода в формате YYYY-MM-DD
 */
function buildReport(rows, opts = {}) {
    const from = isDate(opts.from) ? text(opts.from) : '';
    const to = isDate(opts.to) ? text(opts.to) : '';

    const list = (Array.isArray(rows) ? rows : []).filter((row) => {
        const date = text(row.date);
        if (!date) return false;
        if (from && date < from) return false;
        if (to && date > to) return false;
        return true;
    });

    const byService = new Map();
    const byMaster = new Map();
    const byClient = new Map();
    const statuses = { new: 0, done: 0, cancelled: 0 };

    let revenue = 0;      // выручка: только оказанные услуги
    let planned = 0;      // план: всё не отменённое
    let doneCount = 0;

    for (const row of list) {
        const status = STATUSES.includes(text(row.status)) ? text(row.status) : 'new';
        statuses[status] += 1;

        const service = row.service || {};
        const employee = row.employee || {};
        const client = row.client || {};
        const price = visitCost(service);

        if (status !== 'cancelled') planned += price;
        if (status !== 'done') continue;

        doneCount += 1;
        revenue += price;

        const serviceKey = service.id ?? row.service_id;
        const serviceItem = byService.get(serviceKey) || {
            id: serviceKey, title: service.title || '—', count: 0, revenue: 0,
        };
        serviceItem.count += 1;
        serviceItem.revenue += price;
        byService.set(serviceKey, serviceItem);

        const masterKey = employee.id ?? row.employee_id;
        const masterItem = byMaster.get(masterKey) || {
            id: masterKey,
            name: employee.first_name ? `${employee.first_name} ${employee.last_name}`.trim() : '—',
            count: 0,
            revenue: 0,
        };
        masterItem.count += 1;
        masterItem.revenue += price;
        byMaster.set(masterKey, masterItem);

        const clientKey = client.id ?? row.client_id;
        const clientItem = byClient.get(clientKey) || {
            id: clientKey,
            name: client.first_name ? `${client.first_name} ${client.last_name}`.trim() : '—',
            count: 0,
            spent: 0,
        };
        clientItem.count += 1;
        clientItem.spent += price;
        byClient.set(clientKey, clientItem);
    }

    const byRevenue = (a, b) => b.revenue - a.revenue || b.count - a.count;
    const services = [...byService.values()].sort(byRevenue);
    const masters = [...byMaster.values()].sort(byRevenue);
    const clients = [...byClient.values()].sort((a, b) => b.spent - a.spent || b.count - a.count);

    return {
        from: from || null,
        to: to || null,
        total: list.length,
        statuses,
        done: statuses.done,
        revenue,
        planned,
        avgCheck: doneCount ? Math.round(revenue / doneCount) : 0,
        services,
        masters,
        clients,
    };
}

module.exports = {
    // константы
    ROLES,
    ROLE_LABELS,
    STATUSES,
    STATUS_LABELS,
    FIELD_LABELS,
    // утилиты
    text,
    isDate,
    isTime,
    normalizeTime,
    formatDate,
    formatTime,
    todayISO,
    monthRange,
    humanizeError,
    formatErrors,
    // валидация
    validateClient,
    validateEmployee,
    validateService,
    validateAppointment,
    // расчёты
    findConflict,
    visitCost,
    totalCost,
    buildReport,
};
