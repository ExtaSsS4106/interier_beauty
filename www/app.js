import { API_BASE } from "./conf/conf.js";
import { render, scheduleRender, redirect} from "./conf/render.js"
import * as states from "./conf/state.js";

import { loadProfile, login, register, logout } from "./views/auth.js";


/* ============== inutung views functions ==========*/
import * as views from "./views/views.js";

/* ======================= Общие хелперы страниц ======================= */
// Inline-скрипты шаблонов работают через window.ui: форматирование данных из
// БД, подсветка ошибок ввода, тосты и модалка подтверждения вместо confirm().

const escMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const moneyFmt = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('ru-RU');

/** Экранирование перед вставкой в innerHTML (данные приходят из БД). */
function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, (ch) => escMap[ch]);
}

/** '2026-10-25' → '25.10.2026' */
function fmtDate(value) {
    const v = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return '—';
    const [y, m, d] = v.split('-');
    return `${d}.${m}.${y}`;
}

/** '14:30:00' → '14:30' */
function fmtTime(value) {
    const v = String(value || '').trim();
    return /^\d{2}:\d{2}(:\d{2})?$/.test(v) ? v.slice(0, 5) : '—';
}

function money(value) {
    const n = Number(value);
    return moneyFmt.format(Number.isFinite(n) ? n : 0);
}

function num(value) {
    const n = Number(value);
    return numberFmt.format(Number.isFinite(n) ? n : 0);
}

/** Подсветка ошибки поля формы (message пустой — поле корректно). */
function field(input, errorEl, message) {
    if (!input) return !message;
    if (message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) errorEl.textContent = message;
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    return !message;
}

/**
 * Вешает blur-проверку и перепроверку при вводе.
 * fields: { name: { input, error?, check(value) → '' | сообщение } }
 */
function bindValidation(fields) {
    const list = Object.values(fields);
    const validate = (f) => field(f.input, f.error, f.check(f.input.value));
    for (const f of list) {
        const eventName = f.input && f.input.tagName === 'SELECT' ? 'change' : 'blur';
        f.input.addEventListener(eventName, () => validate(f));
        f.input.addEventListener('input', () => {
            if (f.input.classList.contains('is-invalid')) validate(f);
        });
    }
    return () => {
        let firstInvalid = null;
        for (const f of list) {
            if (!validate(f) && !firstInvalid) firstInvalid = f.input;
        }
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    };
}

function toast(message, variant = 'secondary') {
    const host = document.getElementById('toastHost');
    if (!host || !window.bootstrap) { console.log('[toast]', message); return; }
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${variant} border-0`;
    el.setAttribute('role', 'alert');
    el.innerHTML = '<div class="d-flex"><div class="toast-body"></div>'
        + '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button></div>';
    el.querySelector('.toast-body').textContent = message;
    host.appendChild(el);
    const instance = new window.bootstrap.Toast(el, { delay: 3500 });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    instance.show();
}

/** Модалка подтверждения (вместо window.confirm) → Promise<boolean>. */
function confirmDialog({ title = 'Подтверждение', text = '', okLabel = 'Удалить' } = {}) {
    return new Promise((resolve) => {
        const modalEl = document.getElementById('confirmModal');
        if (!modalEl || !window.bootstrap) {
            resolve(window.confirm(`${title}\n${text}`));
            return;
        }
        const titleEl = document.getElementById('confirmModalTitle');
        const bodyEl = document.getElementById('confirmModalBody');
        const okBtn = document.getElementById('confirmModalOk');

        titleEl.textContent = title;
        bodyEl.textContent = text;
        okBtn.textContent = okLabel;

        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        let settled = false;
        const finish = (value) => {
            if (settled) return;
            settled = true;
            okBtn.removeEventListener('click', onOk);
            modalEl.removeEventListener('hidden.bs.modal', onHidden);
            resolve(value);
        };
        const onOk = () => { modal.hide(); finish(true); };
        const onHidden = () => finish(false);

        okBtn.addEventListener('click', onOk);
        modalEl.addEventListener('hidden.bs.modal', onHidden);
        modal.show();
    });
}

/** Блокирует кнопку на время async-операции и показывает спиннер. */
async function withBusy(button, task, busyText = 'Сохраняем…') {
    if (!button) return task();
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>${esc(busyText)}`;
    try {
        return await task();
    } finally {
        button.disabled = false;
        button.innerHTML = original;
    }
}

const ui = {
    esc, fmtDate, fmtTime, money, num,
    field, bindValidation, toast,
    confirm: confirmDialog,
    withBusy,
};

window.ui = ui;
window.app = {views, states, ui};
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

/* ======================= Левая выдвижная шторка ======================= */
// Состояние храним классом на <html>, а не в самом #root: меню переживает
// любую перерисовку страницы и не «закрывается» при переходе между разделами.

const SIDEBAR_KEY = 'sidebar-open';

function applySidebar(open) {
    document.documentElement.classList.toggle('sidebar-open', Boolean(open));
    try {
        localStorage.setItem(SIDEBAR_KEY, open ? '1' : '0');
    } catch {
        // приватный режим — состояние просто не сохранится
    }
}

function initSidebar() {
    let saved = null;
    try {
        saved = localStorage.getItem(SIDEBAR_KEY);
    } catch { /* нет доступа к localStorage */ }
    // по умолчанию: на десктопе меню открыто, на телефоне скрыто.
    // innerWidth === 0 — окно ещё не показано (скрытое окно в e2e-тесте),
    // тогда viewport неизвестен и считаем это десктопом.
    const fallback = window.innerWidth === 0
        || window.matchMedia('(min-width: 992px)').matches;
    applySidebar(saved === null ? fallback : saved === '1');
}

document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-sidebar-toggle]');
    if (toggle) {
        event.preventDefault();
        applySidebar(!document.documentElement.classList.contains('sidebar-open'));
        return;
    }
    // фон или пункт меню — закрываем шторку (ссылка при этом выполняется)
    if (event.target.closest('[data-sidebar-close]')) applySidebar(false);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.documentElement.classList.contains('sidebar-open')) {
        applySidebar(false);
    }
});

initSidebar();



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
