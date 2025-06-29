/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/funges-fork/', // GitHub Pages base path
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
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
