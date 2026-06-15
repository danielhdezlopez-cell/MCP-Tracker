import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/global.css';
import { preloadTheme, preloadThemesInBackground, getPersistedThemes } from './utils/themeAssetCache.ts';
import { VIDEO_THEMES } from './data/themeVideoMap.ts';

// ─── PWA cache buster ──────────────────────────────────────────────────────
// Bump this string whenever a deploy isn't reaching users due to stale SW cache.
// On first load after a version change: unregisters old SW, clears all caches,
// then reloads once so the fresh SW takes over.
const CACHE_VERSION = 'v20260615-3';
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

  // Preload the current theme immediately (non-blocking — does not delay render)
  const { theme } = getPersistedThemes();
  if (theme) preloadTheme(theme, true);

  // After first paint, queue all remaining video themes for background preload
  const allVideoThemes = Object.keys(VIDEO_THEMES).filter(id => id !== theme);
  setTimeout(() => preloadThemesInBackground(allVideoThemes), 3000);
}

boot();
