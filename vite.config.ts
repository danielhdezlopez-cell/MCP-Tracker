import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/MCP-Tracker/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['assets/**/*'],
      manifest: {
        name: 'MCP Tracker',
        short_name: 'MCP Tracker',
        description: 'Marvel Crisis Protocol – Tournament Tracker',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'landscape',
        start_url: base,
        scope: base,
        icons: [
          {
            src: `${base}assets/icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}assets/icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${base}assets/icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        // Pre-cache all static assets (JS, CSS, HTML, images, fonts)
        globPatterns: ['**/*.{js,css,html,ico,png,webp,svg,woff,woff2}'],
        // Round backgrounds are fetched on demand — exclude from precache (8 MB)
        globIgnores: ['backgrounds/**', '*.mp4'],
        // 15 MB max per pre-cached file (for large portrait PNGs/webps)
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        runtimeCaching: [
          // Intro video — network only (too large to cache, needs range requests)
          {
            urlPattern: /\/intro\.mp4$/i,
            handler: 'NetworkOnly',
          },
          // Google Fonts — stylesheet (revalidate in background)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // Google Fonts — actual font files (cache forever)
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Theme poster images — cached immediately on preload
          {
            urlPattern: /\/assets\/backgrounds\/.*_poster\.webp$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mcp-theme-assets-v1',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Theme background videos — cached on first play, served offline after
          {
            urlPattern: /\/assets\/backgrounds\/.*\.mp4$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mcp-theme-assets-v1',
              rangeRequests: true,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200, 206] },
            },
          },
          // Round background JPEGs — cache on first use, serve offline after
          {
            urlPattern: /\/backgrounds\/.*\.jpg$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mcp-round-backgrounds-v1',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // GitHub Pages hosted assets catch-all (handles same-origin assets
          // not matched by pre-cache, e.g. mission cards, leader portraits)
          {
            urlPattern: /^https:\/\/danielhdezlopez-cell\.github\.io\/MCP-Tracker\/assets\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mcp-tracker-assets',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
