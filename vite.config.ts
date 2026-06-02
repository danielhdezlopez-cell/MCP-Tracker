import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/MCP-Tracker/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/**/*'],
      manifest: {
        name: 'MCP Tracker VS Overlay',
        short_name: 'MCP VS',
        description: 'Marvel Crisis Protocol – Tournament VS Overlay (experimental)',
        theme_color: '#07010f',
        background_color: '#07010f',
        display: 'fullscreen',
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
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // Cache assets loaded from the original MCP-Tracker GitHub Pages
            urlPattern: /^https:\/\/danielhdezlopez-cell\.github\.io\/MCP-Tracker\/assets\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mcp-tracker-assets',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
