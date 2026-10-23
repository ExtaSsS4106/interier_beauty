// Адрес Django API.
// Задаётся в www/index.html (window.TASKFLOW_API_URL) — для телефона/WebView
// указывайте LAN-IP компьютера, например http://192.168.1.192:8080/api.

export const API_BASE = ('http://127.0.0.1:8080/api').replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 10000;