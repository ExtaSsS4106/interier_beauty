// innerHTML не исполняет <script> — пересоздаём их, чтобы браузер запустил
import { routes, titles, PUBLIC_ROUTES } from "./routing.js";
import { data, authReady, startupError, authenticated } from "./state.js";


let lastRender = '';
let pendingRender = 0;
let peddingData = null;

export function rehydrateScripts(root) {
    root.querySelectorAll('script').forEach((old) => {
        const next = document.createElement('script');
        for (const attr of [...old.attributes]) next.setAttribute(attr.name, attr.value);
        if (old.src) next.src = old.src;
        else next.textContent = old.textContent;
        old.replaceWith(next);
    });
}

// Старые инстансы Bootstrap-модалок внутри #root + бэкдропы и блокировка скролла
export function disposeModals(root) {
    const B = window.bootstrap;
    if (B) {
        root.querySelectorAll('.modal').forEach((el) => {
            const inst = B.Modal.getInstance(el);
            if (inst) inst.dispose();
        });
    }
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
}

export function getCurrentPath() {
    if (location.hash && location.hash.startsWith('#/')) {
        return location.hash.slice(1) || '/';
    }
    return location.pathname || '/';
}

// authReady/startupError/data приходят из state.js как live-биндинги:
// render() дергается и из hashchange/popstate, где передавать их аргументами нельзя.
export async function render(force = false, extraData = null) {
    if (extraData === null && peddingData !== null){
        extraData = peddingData;
        peddingData = null;
    }
    console.log("render: "+extraData);
    console.log("data render: "+data);
    if (pendingRender) {
        cancelAnimationFrame(pendingRender);
        pendingRender = 0;
    }

    const path = getCurrentPath();
    const isPublic = PUBLIC_ROUTES.includes(path);

    // Нормализуем URL: чистый pathname приводим к hash-роуту #/
    if (!location.hash) {
        location.hash = '#/';
        return;
    }

    // Неизвестный маршрут → на главную (иначе nunjucks упадёт на отсутствующем шаблоне)
    if (!routes[path]) {
        redirect('/');
        return;
    }

    const key = `${path}|${authenticated ? 1 : 0}`;
    if (!force && key === lastRender) return;
    lastRender = key;

    

    data.title = titles[path] || data.appName;
    data.path = path;
    document.title = `${data.title} — ${data.appName}`;

    const root = document.getElementById('root');
    const template = routes[path];

    disposeModals(root);

    console.log({data: data, extraData: extraData});
    
    root.innerHTML = window.renderPage(template, {data: data, extraData: extraData});
    
    
    rehydrateScripts(root);

}

export function scheduleRender() {
    if (pendingRender) return;
    pendingRender = requestAnimationFrame(() => {
        pendingRender = 0;
        render();
    });
}

export function redirect(path, data = null) {
    const target = `#${path.startsWith('/') ? path : `/${path}`}`;
    lastRender = '';
    // hash тот же → hashchange не будет, рисуем сами (через rAF, чтобы не было рекурсии)
    if (location.hash === target) { peddingData = data; scheduleRender(); return; }
    peddingData = data;
    location.hash = target;
}
