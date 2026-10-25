/* Статический smoke-тест связности IPC: каждый вызов window.db_requests.* из
   renderer'а (preload.js) должен иметь свой ipcMain.handle(...) в main.js —
   опечатка в имени канала иначе вылезет только в запущенном приложении. */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const mainSrc = fs.readFileSync(path.join(root, 'electron', 'main.js'), 'utf8');
const preloadSrc = fs.readFileSync(path.join(root, 'electron', 'preload.js'), 'utf8');

const templatesDir = path.join(root, 'templates');
const rendererSrc = (() => {
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) return walk(full);
        return e.name.endsWith('.html') ? [fs.readFileSync(full, 'utf8')] : [];
    });
    return walk(templatesDir).join('\n') + fs.readFileSync(path.join(root, 'www', 'app.js'), 'utf8');
})();

let failed = 0;
const check = (name, fn) => {
    try {
        fn();
        console.log(`ok   ${name}`);
    } catch (error) {
        failed += 1;
        console.log(`FAIL ${name}: ${error.message}`);
    }
};

// 1. Каналы, объявленные в main.js
const handlers = new Set([...mainSrc.matchAll(/ipcMain\.handle\('([^']+)'/g)].map((m) => m[1]));

// 2. Каналы, которые вызывает preload.js (включая шаблоны `${prefix}:create`)
const invoked = new Set([...preloadSrc.matchAll(/ipcRenderer\.invoke\('([^']+)'/g)].map((m) => m[1]));
const crudPrefixes = [...preloadSrc.matchAll(/crud\('([^']+)'/g)].map((m) => m[1]);
const crudSuffixes = [...preloadSrc.matchAll(/call\(`\$\{prefix\}:([a-z]+)`/g)].map((m) => m[1]);
for (const prefix of crudPrefixes) {
    for (const suffix of crudSuffixes) invoked.add(`${prefix}:${suffix}`);
}

check('все каналы из preload.js объявлены в main.js', () => {
    const missing = [...invoked].filter((channel) => !handlers.has(channel));
    assert.strictEqual(missing.length, 0, `нет обработчика: ${missing.join(', ')}`);
});

// 3. API, которое реально используют страницы, есть в contextBridge
const exposed = new Set([...preloadSrc.matchAll(/exposeInMainWorld\('([^']+)'/g)].map((m) => m[1]));
check('contextBridge отдаёт db_requests и authStorage', () => {
    assert.ok(exposed.has('db_requests'));
    assert.ok(exposed.has('authStorage'));
});

check('страницы используют только объявленные методы db_requests', () => {
    const defined = new Set([
        'login', 'logout', 'checkConn', 'getClients', 'adminReg', 'getEmployees',
        'employeesLogin', 'load', 'save', 'clear',
        // crud-объекты
        ...crudPrefixes.flatMap((p) => crudSuffixes.map((s) => `${p}.${s === 'delete' ? 'remove' : s}`)),
        'reports.summary', 'reports.dashboard',
    ]);
    const objectNames = new Set([...crudPrefixes, 'reports']);
    const methods = new Set();
    const objects = new Set();
    const re = /db_requests\.([A-Za-z_]+)(?:\.([A-Za-z_]+))?/g;
    for (const m of rendererSrc.matchAll(re)) {
        const after = rendererSrc[m.index + m[0].length];
        if (m[2]) methods.add(`${m[1]}.${m[2]}`);
        else if (after === '(') methods.add(m[1]);      // db_requests.login(...)
        else objects.add(m[1]);                          // db_requests.clients;
    }
    const missing = [
        ...[...methods].filter((name) => !defined.has(name)).map((name) => `метод ${name}`),
        ...[...objects].filter((name) => !objectNames.has(name)).map((name) => `объект ${name}`),
    ];
    assert.strictEqual(missing.length, 0, missing.join(', '));
});

check('в main.js зарегистрированы обработчики задания №14', () => {
    const required = [
        'clients:list', 'clients:create', 'clients:update', 'clients:delete',
        'employees:list', 'employees:create', 'employees:update', 'employees:delete',
        'services:list', 'services:create', 'services:update', 'services:delete',
        'appointments:list', 'appointments:create', 'appointments:update', 'appointments:delete',
        'reports:summary', 'reports:dashboard',
    ];
    const missing = required.filter((channel) => !handlers.has(channel));
    assert.strictEqual(missing.length, 0, `нет обработчика: ${missing.join(', ')}`);
});

check('все маршруты из routing.js ссылаются на существующие шаблоны', () => {
    const routingSrc = fs.readFileSync(path.join(root, 'www', 'conf', 'routing.js'), 'utf8');
    const names = [...routingSrc.matchAll(/:\s*'([^']+\.html)'/g)].map((m) => m[1]);
    const missing = [...new Set(names)].filter((name) => !fs.existsSync(path.join(templatesDir, name)));
    assert.strictEqual(missing.length, 0, `нет шаблона: ${missing.join(', ')}`);
});

console.log(`\n${failed} ошибок`);
process.exit(failed ? 1 : 0);
