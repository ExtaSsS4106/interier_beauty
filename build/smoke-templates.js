/* Smoke-тест шаблонов: рендерим их серверным nunjucks с теми же данными,
   что отдаёт www/app.js, и ловим ошибки фильтров/полей. */
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const nunjucks = require('nunjucks');

const env = nunjucks.configure(path.join(__dirname, '..', 'templates'), {
    autoescape: true,
    throwOnUndefined: false,
});

const user = {
    username: 'john',
    first_name: 'John',
    last_name: '',
    email: 'john@example.com',
    initial: 'J',
    initials: 'J',
    date_joined_label: '03.10.2026',
};

const emptyUser = { initial: '?', initials: '?', date_joined_label: '' };

// Права ролей: рендерим шаблоны под каждой ролью, чтобы проверить ветки {% if %}
const PERMISSION_KEYS = [
    'clientsRead', 'clientsWrite',
    'employeesRead', 'employeesWrite',
    'servicesRead', 'servicesWrite',
    'appointmentsRead', 'appointmentsWrite', 'appointmentsStatus',
    'reportsRead',
];

function roleUser(role, allowed = PERMISSION_KEYS) {
    const permissions = { role };
    for (const key of PERMISSION_KEYS) permissions[key] = allowed.includes(key);
    return { ...user, first_name: role, permissions };
}

const adminUser = roleUser('admin');
const managerUser = roleUser('manager', [
    'clientsRead', 'clientsWrite', 'employeesRead', 'servicesRead',
    'appointmentsRead', 'appointmentsWrite', 'appointmentsStatus', 'reportsRead',
]);
const masterUser = roleUser('master', ['appointmentsRead', 'appointmentsStatus']);

const base = {
    appName: 'Tasker',
    title: 'Задачи',
    authenticated: true,
    user,
    tasks: [],
    stats: { total: 0, active: 0, completed: 0, overdue: 0, donePercent: 0 },
    filters: { all: 0, active: 0, completed: 0 },
    sorts: [
        { value: 'due_asc', label: 'Срок: ближайшие' },
        { value: 'due_desc', label: 'Срок: поздние' },
        { value: 'title_asc', label: 'Название: А → Я' },
        { value: 'title_desc', label: 'Название: Я → А' },
        { value: 'newest', label: 'Сначала новые' },
        { value: 'oldest', label: 'Сначала старые' },
    ],
    currentFilter: 'all',
    currentSort: 'due_asc',
    searchQuery: 'покупк',
    hasSearch: true,
    selectedCount: 1,
    allSelected: false,
    loading: false,
    busy: false,
};

const tasks = [
    {
        id: 1, title: 'Купить молоко', description: 'Обезжиренное',
        completed: false, duePart: '2026-10-01', dueLabel: '01.10.2026',
        overdue: true, dueToday: false, selected: true, imgUrl: 'http://192.168.1.192:8080/media/t.png',
    },
    {
        id: 2, title: 'Сделать домашку', description: '',
        completed: true, duePart: '2026-10-05', dueLabel: '05.10.2026',
        overdue: false, dueToday: false, selected: false, imgUrl: '',
    },
    {
        id: 3, title: 'Very long task title that should not break the layout at all',
        description: 'Очень длинное описание задачи, которое тоже не должно ломать вёрстку',
        completed: false, duePart: '', dueLabel: '',
        overdue: false, dueToday: true, selected: false, imgUrl: '',
    },
];

const cases = [
    ['home.html', { ...base, tasks }],
    ['home.html', { ...base, tasks: [], selectedCount: 0, hasSearch: false, searchQuery: '' }],
    ['home.html', { ...base, tasks: [], loading: true, selectedCount: 0, hasSearch: false }],
    ['profile.html', { ...base, title: 'Профиль' }],
    ['profile.html', { ...base, title: 'Профиль', user: emptyUser }],
    ['auth/login.html', { ...base, title: 'Вход', user: emptyUser }],
    ['auth/admin_reg.html', { ...base, title: 'Регистрация', user: emptyUser }],

    // Задание №14 — страницы салона красоты
    ['home.html', { ...base, path: '/' }],
    ['clients.html', { ...base, title: 'Клиенты', path: '/clients' }],
    ['masters.html', { ...base, title: 'Мастера', path: '/masters' }],
    ['services.html', { ...base, title: 'Услуги', path: '/services' }],
    ['appointments.html', { ...base, title: 'Записи', path: '/appointments' }],
    ['reports.html', { ...base, title: 'Отчёты', path: '/reports' }],

    // Шторка (меню) вместо шапки
    ['sidebar.html', { ...base, path: '/reports' }],
    ['sidebar.html', { ...base, path: '', user: emptyUser }],
    ['topbar.html', { ...base, path: '/reports' }],
    ['topbar.html', { ...base, path: '', user: emptyUser }],

    // Разделение прав: админ видит всё, менеджер — без сотрудников/услуг,
    // мастер — только свои заказы
    ['sidebar.html', { ...base, path: '/', user: adminUser }],
    ['sidebar.html', { ...base, path: '/', user: managerUser }],
    ['sidebar.html', { ...base, path: '/', user: masterUser }],
    ['home.html', { ...base, path: '/', user: adminUser }],
    ['home.html', { ...base, path: '/', user: managerUser }],
    ['home.html', { ...base, path: '/', user: masterUser }],
    ['clients.html', { ...base, title: 'Клиенты', path: '/clients', user: adminUser }],
    ['clients.html', { ...base, title: 'Клиенты', path: '/clients', user: masterUser }],
    ['masters.html', { ...base, title: 'Мастера', path: '/masters', user: adminUser }],
    ['masters.html', { ...base, title: 'Мастера', path: '/masters', user: managerUser }],
    ['services.html', { ...base, title: 'Услуги', path: '/services', user: managerUser }],
    ['appointments.html', { ...base, title: 'Записи', path: '/appointments', user: adminUser }],
    ['appointments.html', { ...base, title: 'Записи', path: '/appointments', user: managerUser }],
    ['appointments.html', { ...base, title: 'Записи', path: '/appointments', user: masterUser }],
    ['reports.html', { ...base, title: 'Отчёты', path: '/reports', user: managerUser }],
    ['reports.html', { ...base, title: 'Отчёты', path: '/reports', user: masterUser }],
];

let failed = 0;
for (const [name, ctx] of cases) {
    try {
        // app.js отдаёт шаблонам {data: …}, поэтому оборачиваем контекст так же:
        // иначе data.user/data.path молча undefined и ветки прав не проверяются
        const html = env.render(name, { ...ctx, data: ctx });
        // stats.html намеренно пуст, когда задач нет — это норма
        if (html === null || html === undefined) throw new Error('undefined вместо строки');

        // Дубликаты id ломают document.getElementById: привязка валидации
        // молча уходит не на то поле (например, #email в navbar).
        const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
        const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
        if (duplicates.length) {
            failed += 1;
            console.log(`FAIL ${name}: повторяющиеся id — ${duplicates.join(', ')}`);
            continue;
        }

        console.log(`ok   ${name}  (${html.length} симв.)`);
    } catch (err) {
        failed += 1;
        console.log(`FAIL ${name}: ${err.message}`);
    }
}

/* Синтаксис inline-скриптов страниц: nunjucks проверяет только разметку,
   а JavaScript внутри {% block extra_js %} выполняется уже в приложении. */
function htmlFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return htmlFiles(full);
        return entry.name.endsWith('.html') ? [full] : [];
    });
}

let scriptErrors = 0;
for (const file of htmlFiles(path.join(__dirname, '..', 'templates'))) {
    const source = fs.readFileSync(file, 'utf8');
    const scripts = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    for (const [, code] of scripts) {
        try {
            new vm.Script(code, { filename: file });
        } catch (err) {
            scriptErrors += 1;
            console.log(`FAIL script ${path.relative(path.join(__dirname, '..'), file)}: ${err.message}`);
        }
    }
}
console.log(scriptErrors ? `\n${scriptErrors} ошибок в inline-скриптах` : 'Inline-скрипты синтаксически корректны');

console.log(failed ? `\n${failed} ошибок` : '\nВсе шаблоны рендерятся');
process.exit(failed || scriptErrors ? 1 : 0);
