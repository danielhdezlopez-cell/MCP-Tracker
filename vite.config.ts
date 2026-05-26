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
        name: 'MCP Tracker',
        short_name: 'MCP Tracker',
        description: 'Marvel Crisis Protocol Game Tracker',
        theme_color: '#070b14',
        background_color: '#070b14',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,mp4}'],
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 MB — covers large video themes
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
