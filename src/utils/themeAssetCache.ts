/**
 * Lightweight in-memory theme asset preloader.
 *
 * Strategy:
 *  1. poster (.webp) is preloaded with new Image() — completes in <200ms on WiFi.
 *  2. video (.mp4) is primed via a small Range fetch so the Service Worker
 *     stores the first bytes; subsequent <video> requests are served from cache.
 *  3. Only P1/P2 themes are eagerly loaded; others are queued for idle preload.
 */

import { VIDEO_THEMES } from '../data/themeVideoMap';
import { type Theme } from '../store/useMcpStore';

export type AssetStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ThemeAssetState {
  status: AssetStatus;
  posterReady: boolean;
}

const cache = new Map<string, ThemeAssetState>();
const listeners = new Map<string, Set<() => void>>();

function notify(themeId: string) {
  listeners.get(themeId)?.forEach(cb => cb());
}

export function getAssetStatus(themeId: string): AssetStatus {
  return cache.get(themeId)?.status ?? 'idle';
}

export function isPosterReady(themeId: string): boolean {
  return cache.get(themeId)?.posterReady ?? false;
}

export function subscribeToTheme(themeId: string, cb: () => void): () => void {
  if (!listeners.has(themeId)) listeners.set(themeId, new Set());
  listeners.get(themeId)!.add(cb);
  return () => listeners.get(themeId)?.delete(cb);
}

/** Derive poster URL from video src: BG_Hydra.mp4 → BG_Hydra_poster.webp */
export function getPosterUrl(videoSrc: string): string {
  return videoSrc.replace(/\.mp4$/i, '_poster.webp');
}

function preloadPosterImage(url: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/** Prime the Service Worker cache by fetching the first 512 KB of the video.
 *  This is fire-and-forget; failures are silently ignored. */
async function primeVideoCache(url: string): Promise<void> {
  try {
    if ('caches' in window) {
      const cache = await caches.open('mcp-theme-assets-v1');
      if (await cache.match(url)) return; // already cached
    }
    const res = await fetch(url, {
      headers: { Range: 'bytes=0-524287' },
      credentials: 'omit',
    });
    if ('caches' in window && (res.status === 200 || res.status === 206)) {
      const c = await caches.open('mcp-theme-assets-v1');
      await c.put(url, res.clone());
    }
    await res.arrayBuffer(); // consume to complete fetch
  } catch {
    // Silently ignore — network unavailable or CORS restriction
  }
}

/** Preload a single theme's poster + video. Safe to call multiple times. */
export async function preloadTheme(themeId: string, includeVideo = false): Promise<void> {
  const existing = cache.get(themeId);
  if (existing && existing.status !== 'idle' && existing.status !== 'error') return;

  const videoConfig = VIDEO_THEMES[themeId as Theme];
  if (!videoConfig) {
    // No video/poster assets — theme is CSS-only
    cache.set(themeId, { status: 'ready', posterReady: true });
    notify(themeId);
    return;
  }

  cache.set(themeId, { status: 'loading', posterReady: false });
  notify(themeId);

  // Preload poster first — fast, unblocks immediate render
  const posterUrl = getPosterUrl(videoConfig.src);
  const posterOk = await preloadPosterImage(posterUrl);
  cache.set(themeId, { status: 'loading', posterReady: posterOk });
  notify(themeId);

  if (includeVideo) {
    await primeVideoCache(videoConfig.src);
  }

  cache.set(themeId, { status: 'ready', posterReady: posterOk });
  notify(themeId);
}

/** Queue a list of themes for background idle preload (one at a time, low-priority). */
export function preloadThemesInBackground(themeIds: string[]): void {
  const queue = themeIds.filter(id => {
    const s = cache.get(id)?.status;
    return !s || s === 'idle' || s === 'error';
  });
  if (queue.length === 0) return;

  let index = 0;
  const tick = () => {
    if (index >= queue.length) return;
    const id = queue[index++];
    preloadTheme(id, false).then(() => {
      // Space out idle preloads to avoid saturating bandwidth
      setTimeout(tick, 400);
    });
  };

  const kick = () => setTimeout(tick, 800);
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void })
      .requestIdleCallback(kick);
  } else {
    setTimeout(kick, 1500);
  }
}

/** Read persisted Zustand state from localStorage without importing the store
 *  (avoids module initialization order issues at boot time). */
export function getPersistedThemes(): { theme: Theme | null; themeRight: Theme | null } {
  try {
    const raw = localStorage.getItem('mcp-tracker-store');
    if (!raw) return { theme: null, themeRight: null };
    const parsed = JSON.parse(raw) as { state?: { theme?: Theme; leaderRight?: { affiliations?: string[]; name?: string } } };
    const state = parsed?.state ?? {};
    return { theme: state.theme ?? null, themeRight: null };
  } catch {
    return { theme: null, themeRight: null };
  }
}
