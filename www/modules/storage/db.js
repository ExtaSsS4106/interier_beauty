import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Capacitor } from '@capacitor/core';

const KEY = 'db_config';

function parse(raw) {
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

// Реализация для Android (и iOS)
const capacitorStorage = {
  async load() {
    const raw = await SecureStorage.get(KEY);
    return parse(typeof raw === 'string' ? raw : raw && JSON.stringify(raw));
  },
  async save(cfg) {
    await SecureStorage.set(KEY, JSON.stringify(cfg));
  },
  async clear() {
    await SecureStorage.remove(KEY);
  },
};

// Заглушка для обычного браузера (отладка).
// localStorage, а не sessionStorage: реквизиты БД не должны пропадать при закрытии вкладки.
const browserStorage = {
  async load() {
    return parse(localStorage.getItem(KEY));
  },
  async save(cfg) {
    localStorage.setItem(KEY, JSON.stringify(cfg));
  },
  async clear() {
    localStorage.removeItem(KEY);
  },
};

function pickStorage() {
  if (window.dbConfigStorage) return window.dbConfigStorage;   // Electron (preload)
  if (Capacitor.isNativePlatform()) return capacitorStorage;   // Android / iOS
  return browserStorage;                                       // браузер
}

export const DBstorage = pickStorage();

