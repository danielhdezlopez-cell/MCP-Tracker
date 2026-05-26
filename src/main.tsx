import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/global.css';

// ─── PWA cache buster ──────────────────────────────────────────────────────
// Bump this string whenever a deploy isn't reaching users due to stale SW cache.
// On first load after a version change: unregisters old SW, clears all caches,
// then reloads once so the fresh SW takes over.
const CACHE_VERSION = 'v20260526';
const CACHE_KEY = 'mcp-cache-version';

async function boot() {
  if (localStorage.getItem(CACHE_KEY) !== CACHE_VERSION) {
    localStorage.setItem(CACHE_KEY, CACHE_VERSION);
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    location.reload();
    return;
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

boot();
