import { REQUEST_TIMEOUT_MS, API_BASE } from "./conf";
import { redirect } from "./render.js";
import { 
        data,
        set_authenticated, 
        tokens, 
        saveTokens,
        clearTokens
     } from "./state.js";


export function withTimeout(signal) {
    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    if (!signal) return timeout;
    return typeof AbortSignal.any === 'function' ? AbortSignal.any([signal, timeout]) : timeout;
}

export async function apiRequest(path, options = {}, accessToken = '') {
    if (!API_BASE) {
        throw new ApiError('Сервер API не найден в локальной сети', 0);
    }

    const headers = { ...options.headers };REQUEST_TIMEOUT_MS

    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response;
    try {
        response = await fetch(API_BASE + path, {
            ...options,
            headers,
            signal: withTimeout(options.signal),
        });
    } catch (error) {
        console.error('fetch failed:', error);
        if (error?.name === 'TimeoutError') {
            throw new ApiError(
                `Сервер ${API_BASE} не отвечает (таймаут ${REQUEST_TIMEOUT_MS / 1000} с)`,
                0,
            );
        }
        throw new ApiError(`Не удалось подключиться к серверу ${API_BASE}`, 0);
    }

    // 204/205 — тело пустое, парсить нечего
    const body =
        response.status === 204 || response.status === 205
            ? null
            : await response.json().catch(() => null);

    if (!response.ok) {
        const details = body ? flattenMessages(body).join(' ') : '';
        throw new ApiError(details || `Ошибка сервера (${response.status})`, response.status);
    }

    return body;
}

export async function refreshTokens() {
    if (!tokens?.refresh) throw new ApiError('Сессия завершена', 401);
    const refreshed = await apiRequest('/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: tokens.refresh }),
    });
    await saveTokens({
        access: refreshed.access,
        refresh: refreshed.refresh || tokens.refresh,
    });
}

export async function sessionExpired() {
    await clearTokens();
    set_authenticated(false);
    data.authenticated = false;
    data.user = {};
    redirect('/login');
}

// Основной вход в API для авторизованных страниц: сам доставляет access-токен
// и молча (однократно) обновляет его при 401.
export async function authenticatedRequest(path, options = {}) {
    try {
        return await apiRequest(path, options, tokens?.access || '');
    } catch (error) {
        if (error.status === 401 && tokens?.refresh) {
            try {
                await refreshTokens();
            } catch (refreshError) {
                await sessionExpired();
                throw refreshError;
            }
            return await apiRequest(path, options, tokens?.access || '');
        }
        if (error.status === 401) {
            await sessionExpired();
        }
        throw error;
    }
}
