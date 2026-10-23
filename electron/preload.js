const { contextBridge, ipcRenderer } = require('electron');

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
});