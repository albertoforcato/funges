import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';
import { initializeHtmlLocalization } from '@/lib/html-localization';
import { initializeManifestLocalization } from '@/lib/manifest-localization';

// Import Why Did You Render in development
if (process.env.NODE_ENV === 'development') {
  import('./lib/wdyr');
}

// Initialize HTML and manifest localization
initializeHtmlLocalization();
initializeManifestLocalization();

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New content is available, show update notification
                console.log('🔄 New version available!');
                // You can show a notification to the user here
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
