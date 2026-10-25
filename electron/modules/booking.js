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

const ROLES = ['admin', 'manager', 'master'];
const ROLE_LABELS = { admin: 'Администратор', manager: 'Менеджер', master: 'Мастер' };
/** Старая роль «user» из первой версии проекта — права менеджера. */
const LEGACY_ROLES = { user: 'manager' };

const STATUSES = ['new', 'accepted', 'done', 'cancelled'];
const STATUS_LABELS = {
    new: 'Записана',
    accepted: 'Принята',
    done: 'Оказана',
    cancelled: 'Отменена',
};

/* ====================== Роли и права (matrix) ====================== */

// <раздел>.<действие> — единый источник прав: и для main.js (IPC), и для UI
const ACTIONS = [
    'clients.read', 'clients.write',
    'employees.read', 'employees.write',
    'services.read', 'services.write',
    'appointments.read', 'appointments.write', 'appointments.status',
    'reports.read',
];

const ROLE_ACTIONS = {
    // админ видит всё и создаёт сотрудников/услуги
    admin: ACTIONS.slice(),
    // менеджер принимает клиентов и записывает их к мастерам
    manager: [
        'clients.read', 'clients.write',
        'employees.read', 'services.read',
        'appointments.read', 'appointments.write', 'appointments.status',
        'reports.read',
    ],
    // мастер только видит свои заказы, принимает их и отмечает оказанными
    master: ['appointments.read', 'appointments.status'],
};

/** 'user' → 'manager', неизвестные роли — к мастеру (права по умолчанию минимальны). */
function normalizeRole(role) {
    const value = text(role);
    if (ROLES.includes(value)) return value;
    return LEGACY_ROLES[value] || 'master';
}

function can(role, action) {
    const actions = ROLE_ACTIONS[normalizeRole(role)] || [];
    return actions.includes(action);
}

/**
 * Плоский объект прав для шаблонов: { role: 'admin', clientsRead: true, ... }
 * Отдаётся рендеру вместе с пользователем после входа/регистрации.
 */
function permissionsFor(role) {
    const normalized = normalizeRole(role);
    const actions = ROLE_ACTIONS[normalized] || [];
    const result = { role: normalized };
    for (const action of ACTIONS) {
        const [section, verb] = action.split('.');
        const key = section + verb.charAt(0).toUpperCase() + verb.slice(1);
        result[key] = actions.includes(action);
    }
    return result;
}

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
 * Отбор записей по периоду и набору статусов.
 * @param {Array} rows  записи с вложенными client/employee/service
 * @param {Object} opts { from, to, statuses } — from/to в YYYY-MM-DD,
 *                       statuses — массив статусов (пустой/нет = все)
 */
function filterRows(rows, opts = {}) {
    const from = isDate(opts.from) ? text(opts.from) : '';
    const to = isDate(opts.to) ? text(opts.to) : '';
    const allowed = Array.isArray(opts.statuses) && opts.statuses.length
        ? opts.statuses.map(text).filter((s) => STATUSES.includes(s))
        : null;

    return (Array.isArray(rows) ? rows : []).filter((row) => {
        const date = text(row.date);
        if (!date) return false;
        if (from && date < from) return false;
        if (to && date > to) return false;
        if (allowed) {
            const status = text(row.status);
            if (!allowed.includes(STATUSES.includes(status) ? status : 'new')) return false;
        }
        return true;
    });
}

/**
 * Отчёт по оказанным услугам и выручке.
 * @param {Array} rows  записи (appointments) с вложенными client/employee/service
 * @param {Object} opts { from, to, statuses } — границы периода и статусы
 */
function buildReport(rows, opts = {}) {
    const from = isDate(opts.from) ? text(opts.from) : '';
    const to = isDate(opts.to) ? text(opts.to) : '';
    const list = filterRows(rows, opts);

    const byService = new Map();
    const byMaster = new Map();
    const byClient = new Map();
    const statuses = { new: 0, accepted: 0, done: 0, cancelled: 0 };

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
        bounds: reportBounds(rows),
        services,
        masters,
        clients,
    };
}

/** Границы дат по всем записям (без учёта периода) — подсказка для отчёта. */
function reportBounds(rows) {
    const dates = (Array.isArray(rows) ? rows : [])
        .map((row) => text(row.date))
        .filter(Boolean)
        .sort();
    return { min: dates[0] || null, max: dates[dates.length - 1] || null, total: dates.length };
}

/* ====================== Экспорт отчёта в Excel ====================== */

// Разделы, которые можно включить в выгрузку (порядок = порядок листов)
const EXPORT_SECTIONS = ['summary', 'services', 'masters', 'clients', 'appointments'];
const EXPORT_SECTION_TITLES = {
    summary: 'Сводка',
    services: 'Услуги',
    masters: 'Мастера',
    clients: 'Клиенты',
    appointments: 'Записи',
};

const money = (value) => ({ value: Number(value) || 0, style: 'money' });
const integer = (value) => ({ value: Number(value) || 0, style: 'int' });
const boldText = (value) => ({ value, style: 'bold' });
const boldMoney = (value) => ({ value: Number(value) || 0, style: 'boldMoney' });
const boldInt = (value) => ({ value: Number(value) || 0, style: 'boldInt' });

/**
 * Готовит «блоки» отчёта: заголовок, ширины колонок и строки данных.
 * Чистая функция — используется main.js для генерации xlsx и покрывается тестами.
 *
 * @param {Object} report  результат buildReport()
 * @param {Array} rows     отфильтрованные записи (для листа «Записи»)
 * @param {Object} opts    { sections: [...], layout: 'sheets' | 'single' }
 */
function exportBlocks(report, rows, opts = {}) {
    const wanted = Array.isArray(opts.sections) && opts.sections.length
        ? opts.sections.map(text)
        : EXPORT_SECTIONS;
    const sections = EXPORT_SECTIONS.filter((key) => wanted.includes(key));
    const bounds = report.bounds || {};
    const st = report.statuses || {};
    const period = report.from || report.to
        ? `${formatDate(report.from) || '…'} — ${formatDate(report.to) || '…'}`
        : 'всё время';
    const share = (value) => (report.revenue ? (Number(value) || 0) / report.revenue : 0);
    const sum = (list, key) => (list || []).reduce((total, item) => total + Number(item[key] || 0), 0);

    const blocks = [];

    if (sections.includes('summary')) {
        blocks.push({
            key: 'summary',
            title: EXPORT_SECTION_TITLES.summary,
            widths: [46, 34],
            header: ['Показатель', 'Значение'],
            rows: [
                ['Период отчёта', period],
                ['Показано записей', integer(report.total)],
                ['Записана (ждёт подтверждения)', integer(st.new || 0)],
                ['Принята (мастер принял)', integer(st.accepted || 0)],
                ['Оказана', integer(st.done || 0)],
                ['Отменена', integer(st.cancelled || 0)],
                [boldText('Выручка (только оказанные)'), boldMoney(report.revenue)],
                ['План (без отменённых)', money(report.planned)],
                ['Средний чек', money(report.avgCheck)],
                ['Записей в базе всего', integer(bounds.total || 0)],
                ['Диапазон дат в базе',
                    `${formatDate(bounds.min) || '—'} — ${formatDate(bounds.max) || '—'}`],
            ],
        });
    }

    if (sections.includes('services')) {
        blocks.push({
            key: 'services',
            title: EXPORT_SECTION_TITLES.services,
            widths: [40, 14, 18, 12],
            header: ['Услуга', 'Кол-во', 'Выручка', 'Доля'],
            rows: [
                ...(report.services || []).map((s) => [
                    s.title,
                    integer(s.count),
                    money(s.revenue),
                    { value: share(s.revenue), style: 'pct' },
                ]),
                [boldText('ИТОГО'), boldInt(sum(report.services, 'count')),
                    boldMoney(report.revenue), { value: report.revenue ? 1 : 0, style: 'boldPct' }],
            ],
        });
    }

    if (sections.includes('masters')) {
        blocks.push({
            key: 'masters',
            title: EXPORT_SECTION_TITLES.masters,
            widths: [40, 18, 18, 12],
            header: ['Мастер', 'Оказано услуг', 'Выручка', 'Доля'],
            rows: [
                ...(report.masters || []).map((m) => [
                    m.name,
                    integer(m.count),
                    money(m.revenue),
                    { value: share(m.revenue), style: 'pct' },
                ]),
                [boldText('ИТОГО'), boldInt(sum(report.masters, 'count')),
                    boldMoney(report.revenue), { value: report.revenue ? 1 : 0, style: 'boldPct' }],
            ],
        });
    }

    if (sections.includes('clients')) {
        blocks.push({
            key: 'clients',
            title: EXPORT_SECTION_TITLES.clients,
            widths: [40, 20, 18],
            header: ['Клиент', 'Оказано услуг', 'Сумма'],
            rows: [
                ...(report.clients || []).map((c) => [
                    c.name,
                    integer(c.count),
                    money(c.spent),
                ]),
                [boldText('ИТОГО'), boldInt(sum(report.clients, 'count')),
                    boldMoney(sum(report.clients, 'spent'))],
            ],
        });
    }

    if (sections.includes('appointments')) {
        const list = [...(rows || [])].sort((a, b) => String(a.date).localeCompare(String(b.date))
            || String(a.time).localeCompare(String(b.time)));
        blocks.push({
            key: 'appointments',
            title: EXPORT_SECTION_TITLES.appointments,
            widths: [13, 10, 28, 28, 32, 16, 16],
            header: ['Дата', 'Время', 'Клиент', 'Мастер', 'Услуга', 'Стоимость', 'Статус'],
            rows: [
                ...list.map((row) => {
                    const client = row.client || {};
                    const employee = row.employee || {};
                    const service = row.service || {};
                    const status = STATUSES.includes(text(row.status)) ? text(row.status) : 'new';
                    return [
                        formatDate(row.date) || text(row.date),
                        formatTime(row.time) || text(row.time),
                        [client.last_name, client.first_name].filter(Boolean).join(' ') || '—',
                        [employee.last_name, employee.first_name].filter(Boolean).join(' ') || '—',
                        service.title || '—',
                        money(visitCost(service)),
                        STATUS_LABELS[status] || status,
                    ];
                }),
                [boldText('ИТОГО'), '', '', '', '',
                    boldMoney(list.reduce((total, row) => total + visitCost(row.service || {}), 0)),
                    `${list.length} записей`],
            ],
        });
    }

    return blocks;
}

/**
 * Превращает блоки в листы xlsx.
 * opts.layout === 'single' — один лист «Отчёт» с разделами подряд,
 * иначе (по умолчанию) — отдельный лист на каждый раздел.
 */
function exportSheets(report, rows, opts = {}) {
    const blocks = exportBlocks(report, rows, opts);
    if (!blocks.length) return [{ name: 'Отчёт', rows: [] }];

    if (text(opts.layout) === 'single') {
        const columns = Math.max(...blocks.map((block) => block.header.length));
        const widths = Array.from({ length: columns }, (_, index) => Math.max(
            ...blocks.map((block) => Number(block.widths[index] || 20)),
        ));
        const outRows = [];
        blocks.forEach((block, index) => {
            if (index) outRows.push([]);                       // пустая строка между разделами
            outRows.push([{ value: block.title, style: 'section' }]);
            outRows.push(block.header.map((title) => ({ value: title, style: 'bold' })));
            outRows.push(...block.rows);
        });
        return [{ name: 'Отчёт', widths, rows: outRows }];
    }

    return blocks.map((block) => ({
        name: block.title,
        widths: block.widths,
        header: block.header,
        rows: block.rows,
    }));
}

/** Имя файла без запрещённых для ФС знаков и обязательно с расширением .xlsx. */
function safeFileName(name, fallback = 'Отчёт') {
    const cleaned = text(name)
        .replace(/[*/:<>?\\|[\]"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
    const base = cleaned || fallback;
    return /\.xlsx$/i.test(base) ? base : `${base}.xlsx`;
}

/** Предлагаемое имя файла: «Отчёт 2026-10-01_2026-10-31.xlsx». */
function defaultReportName(opts = {}) {
    const from = isDate(opts.from) ? text(opts.from) : '';
    const to = isDate(opts.to) ? text(opts.to) : '';
    const tail = from && to ? `${from}_${to}` : (from || to || 'всё-время');
    return safeFileName(`Отчёт ${tail}`);
}

module.exports = {
    // константы
    ROLES,
    ROLE_LABELS,
    STATUSES,
    STATUS_LABELS,
    ACTIONS,
    ROLE_ACTIONS,
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
    // роли и права
    normalizeRole,
    can,
    permissionsFor,
    // расчёты
    findConflict,
    visitCost,
    totalCost,
    filterRows,
    buildReport,
    reportBounds,
    // экспорт в Excel
    EXPORT_SECTIONS,
    EXPORT_SECTION_TITLES,
    exportBlocks,
    exportSheets,
    safeFileName,
    defaultReportName,
};
