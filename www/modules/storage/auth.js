import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Capacitor } from '@capacitor/core';

const KEY = 'auth';

// Реализация для Android (и iOS)
const capacitorStorage = {
  async load() {
    const raw = await SecureStorage.get(KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async save(tokens) {
    await SecureStorage.set(KEY, JSON.stringify(tokens));
  },
  async clear() {
    await SecureStorage.remove(KEY);
  },
};

// Заглушка для обычного браузера (отладка)
const browserStorage = {
  async load() {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async save(tokens) {
    sessionStorage.setItem(KEY, JSON.stringify(tokens));
  },
  async clear() {
    sessionStorage.removeItem(KEY);
  },
};

function pickStorage() {
  if (window.authStorage) return window.authStorage;      // Electron (preload)
  if (Capacitor.isNativePlatform()) return capacitorStorage; // Android
  return browserStorage;                                   // браузер
}

export const auth = pickStorage();