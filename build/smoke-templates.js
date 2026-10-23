/* Smoke-тест шаблонов: рендерим их серверным nunjucks с теми же данными,
   что отдаёт www/app.js, и ловим ошибки фильтров/полей. */
const path = require('path');
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
    ['auth/reg.html', { ...base, title: 'Регистрация', user: emptyUser }],
];

let failed = 0;
for (const [name, ctx] of cases) {
    try {
        const html = env.render(name, ctx);
        // stats.html намеренно пуст, когда задач нет — это норма
        if (html === null || html === undefined) throw new Error('undefined вместо строки');
        console.log(`ok   ${name}  (${html.length} симв.)`);
    } catch (err) {
        failed += 1;
        console.log(`FAIL ${name}: ${err.message}`);
    }
}

console.log(failed ? `\n${failed} ошибок` : '\nВсе шаблоны рендерятся');
process.exit(failed ? 1 : 0);
