const { contextBridge, ipcRenderer } = require('electron');

// Общий вызов CRUD-обработчиков main-процесса: они всегда отвечают
// { ok: true, data } либо { ok: false, error } — на ошибке бросаем Exception,
// чтобы страница могла показать понятное сообщение.
async function call(channel, payload) {
    const res = payload === undefined
        ? await ipcRenderer.invoke(channel)
        : await ipcRenderer.invoke(channel, payload);
    if (res && res.ok === false) throw new Error(res.error || 'Ошибка базы данных');
    if (res && res.ok === true && 'data' in res) return res.data;
    return res;
}

const crud = (prefix, { withList = true } = {}) => {
    const api = {
        create: (payload) => call(`${prefix}:create`, payload),
        update: (payload) => call(`${prefix}:update`, payload),
        remove: (id) => call(`${prefix}:delete`, id),
    };
    if (withList) api.list = () => call(`${prefix}:list`);
    return api;
};

contextBridge.exposeInMainWorld('authStorage', {
    load: () => ipcRenderer.invoke('auth:load'),
    save: (params) => ipcRenderer.invoke('auth:save', params),
    clear: () => ipcRenderer.invoke('auth:clear'),
});

contextBridge.exposeInMainWorld('db_requests', {
    login: async (params) => {
        const res = await ipcRenderer.invoke('db:login', params);
        if (!res.ok) throw new Error(res.error);
    },
    logout: () => ipcRenderer.invoke('db:logout'),
    checkConn: (params) => ipcRenderer.invoke('db:checkConn', params),
    getClients: () => ipcRenderer.invoke('clients:getAll'),
    adminReg: (params) => ipcRenderer.invoke('admin:register', params),
    getEmployees: () => ipcRenderer.invoke('employees:getAll'),
    employeesLogin: async (params) => {
        const res = await ipcRenderer.invoke('employees:login', params);
        if (!res.ok) throw new Error(res.error || 'Не удалось войти');
        return res;
    },
    
    load: () => ipcRenderer.invoke('db_config:load'),
    save: (params) => ipcRenderer.invoke('db_config:save', params),
    clear: () => ipcRenderer.invoke('db_config:clear'),

    // Задание №14: CRUD по таблицам clients / employees / services / appointments
    clients: crud('clients'),
    employees: crud('employees'),
    services: crud('services'),
    appointments: crud('appointments'),
    reports: {
        summary: (period) => call('reports:summary', period),
        dashboard: () => call('reports:dashboard'),
    },
});