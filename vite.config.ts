/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif,tflite}'],
        runtimeCaching: [
          // TensorFlow Lite models caching
          {
            urlPattern:
              /^https:\/\/pub-92765923660e431daff3170fbef6471d\.r2\.dev\/.*\.tflite$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tensorflow-models-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year - models rarely change
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Local TensorFlow models
          {
            urlPattern: /\/assets\/.*\.tflite$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-models-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          // Mapbox API caching
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          // Mapbox tiles caching
          {
            urlPattern: /^https:\/\/.*\.tiles\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-tiles-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          // Static assets caching
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          // Fonts caching
          {
            urlPattern: /\.(?:woff|woff2|eot|ttf|otf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          // API calls - Network First with fallback
          {
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
        // Offline fallback
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        // Skip waiting for immediate activation
        skipWaiting: true,
        clientsClaim: true,
        // Clean up old caches
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Funges - Wild Mushroom & Edible Plants Foraging Map',
        short_name: 'Funges',
        description:
          'Real-time map of wild mushrooms and edible plants using weather and geospatial data.',
        theme_color: '#3d7e40',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/logo_app.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/logo_funges.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/logo_1.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        // Add categories for better app store discovery
        categories: ['nature', 'education', 'food', 'travel'],
        // Add screenshots for app stores
        screenshots: [
          {
            src: '/icons/logo_app.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Funges App Screenshot',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@routes': '/src/routes',
      '@store': '/src/store',
      '@lib': '/src/lib',
      '@styles': '/src/styles',
      '@i18n': '/src/i18n',
      '@hooks': '/src/hooks',
      '@types': '/src/types',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS preprocessing options can be added here if needed
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
