import { CONFIG } from '../../../conf.js';

function waitFor(selector) {
    return new Promise(resolve => {
        const found = document.querySelector(selector);
        if (found) return resolve(found);

        const obs = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    });
}

export async function onDocumentReady() {
    const button = await waitFor('#button');
    const title  = await waitFor('#title');
    console.log('Button:', button);
    console.log('Title:', title);
    console.log('CONFIG:', CONFIG);

    button?.addEventListener('click', async () => {
        const data = await ping();
        title.textContent = data.message;
    });
};

export async function ping() {
    const response = await fetch(`${CONFIG.API_BASE}/ping`);
    console.log('Request URL:', `${CONFIG.API_BASE}/ping`);
    console.log('Response:', response);
    return response.json();
}