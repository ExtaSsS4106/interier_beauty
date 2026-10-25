import { auth } from "../modules/storage/auth.js";
import { DBstorage } from "../modules/storage/db.js";

// Общее состояние приложения.
// Вынесено в отдельный модуль, потому что render.js должен видеть `data`,
// а app.js — не может просто прокинуть его аргументом: render() вызывается
// ещё и из hashchange/popstate, где аргументов нет. Флаги тут же — чтобы
// guard "ещё не инициализировано" проверял состояние, а не параметр вызова.

// Единственный объект, который видят шаблоны Nunjucks (renderPage(name, data)).
// Сюда складываем только то, что реально нужно на страницах.
export const data = {
    appName: 'Template',
    title: 'Главная',
    authenticated: false,
    user: {},
    db: null,
};


// true после того, как initialize() восстановил сессию (или убедился, что её нет).
export let authReady = false;

// Ошибка старта (например, API недоступен) — показывается на странице входа.
export let startupError = '';

export function markAuthReady() {
    authReady = true;
}

export function setStartupError(message) {
    startupError = message;
}
export let authenticated;
export function set_authenticated(value){
    authenticated = value;
}

/**
 * Текущий вошедший сотрудник: профиль + права (permissions из main-процесса).
 * Шаблоны показывают/прячут кнопки и пункты меню по data.user.permissions.*,
 * а настоящая проверка выполняется в main-процессе.
 */
export function setUser(user) {
    const value = user && typeof user === 'object' ? { ...user } : {};
    if (!value.permissions || typeof value.permissions !== 'object') {
        value.permissions = {};
    }
    data.user = value;
}

export function clearUser() {
    data.user = {};
}

export let tokens = null;
export function setTokens(value){
    tokens = value;
}


export async function readTokens() {
    return auth.load();
}

export async function saveTokens(value) {
    setTokens(value);
    await auth.save(value);
}

export async function clearTokens() {
    setTokens(null);
    await auth.clear();
}

//DB

export async function readDBmeta(){
    const cfg = await DBstorage.load();
    data.db = cfg;
    return cfg;
}

export async function setDBmeta(cfg){
    data.db = cfg;
    await DBstorage.save(cfg);
}

export async function clearDBmeta(){
    data.db = null;
    await DBstorage.clear();
}