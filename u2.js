import { state } from './s.js';
state.auth = true;
console.log('общий объект:', state.auth, '| window.state:', globalThis.state.auth);
globalThis.state.auth = false;
console.log('запись через window видна модулю:', state.auth);
