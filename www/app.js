import { API_BASE } from "./conf/conf.js";
import { render, scheduleRender, redirect} from "./conf/render.js"
import * as states from "./conf/state.js";

import { loadProfile, login, register, logout } from "./views/auth.js";


/* ============== inutung views functions ==========*/
import * as views from "./views/views.js";
window.app = {views, states};
for (const fn of Object.values(views)){
    if (typeof fn === 'function') await fn();
    
}
/* ======================= Ошибки ======================= */

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// DRF отдаёт ошибки вложенной структурой — разворачиваем в читаемую строку
function flattenMessages(value) {
    if (value === null || value === undefined) return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(flattenMessages);
    if (typeof value === 'object') return Object.values(value).flatMap(flattenMessages);
    return [String(value)];
}




/* ======================= Обработчики ======================= */

// Один раз на документе, делегированием: переживает любую перерисовку #root
// и не требует повторного attach после каждого render().
document.addEventListener('click', (event) => {
    const logoutBtn = event.target.closest('[data-logout]');
    if (!logoutBtn) return;
    event.preventDefault();
    logout();
});

document.addEventListener('submit', (event) => {
    if (!event.target.matches('form[action="/logout/"]')) return;
    event.preventDefault();
    logout();
});



/* ======================= Инициализация ======================= */

async function initialize() {
    if (!window.bootstrap) {
        console.error('[Template] window.bootstrap не определён — модалки и уведомления не работают.');
    }

    const cfg = await states.readDBmeta();
    try {
        const status = (await window.db_requests.checkConn(cfg || undefined));
        // Нет подключения к БД → экран настройки подключения
        if (!status.ok) {
            redirect('/register_db');
            return;
        }
    } catch (error) {
        console.error('db:checkConn', error);
        redirect('/register_db');
        return;
    }

    
    const employees = await window.db_requests.getEmployees();

    if (!Array.isArray(employees)) {
        console.error('Ожидался массив, пришло:', employees);
        return;
    }

    if (employees.length === 0) {
        console.log('Клиентов нет');
        redirect('/admin_reg');
        return;
    }
    // БД есть → авторизация всегда с начала
    redirect('/login');
}

/* ======================= Экспорт для inline-скриптов ======================= */
// Шаблоны (auth/login.html, auth/reg.html) зовут эти функции из своих <script>,
// которые оживляет rehydrateScripts(). Объявляем ДО запуска initialize().

window.taskflowAuth = { login, register, logout };
window.logout = logout;
window.navigate = (path) => redirect(path.startsWith('/') ? path : `/${path}`);





window.addEventListener('hashchange', scheduleRender);
window.addEventListener('popstate', scheduleRender);

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}
