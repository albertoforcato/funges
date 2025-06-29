// PWA Installation and Update Handling

let deferredPrompt: any;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', e => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  console.log('📱 PWA installation prompt ready');
});

// Handle service worker messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  });
}

// Function to show installation prompt
export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log('No installation prompt available');
    return false;
  }

  try {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
      deferredPrompt = null;
      return true;
    } else {
      console.log('❌ User dismissed the install prompt');
      return false;
    }
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return false;
  }
};

// Function to check if app is installed
export const isAppInstalled = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

// Function to check if app can be installed
export const canInstallApp = (): boolean => {
  return !!deferredPrompt;
};

// Function to reload for updates
export const reloadForUpdate = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
};

// Function to check cache status
export const checkCacheStatus = async (): Promise<{
  models: boolean;
  assets: boolean;
  tiles: boolean;
}> => {
  if (!('caches' in window)) {
    return { models: false, assets: false, tiles: false };
  }

  try {
    const [modelsCache, assetsCache, tilesCache] = await Promise.all([
      caches.open('tensorflow-models-cache'),
      caches.open('images-cache'),
      caches.open('mapbox-tiles-cache'),
    ]);

    const [modelsKeys, assetsKeys, tilesKeys] = await Promise.all([
      modelsCache.keys(),
      assetsCache.keys(),
      tilesCache.keys(),
    ]);

    return {
      models: modelsKeys.length > 0,
      assets: assetsKeys.length > 0,
      tiles: tilesKeys.length > 0,
    };
  } catch (error) {
    console.error('Error checking cache status:', error);
    return { models: false, assets: false, tiles: false };
  }
};

// Function to clear all caches
export const clearAllCaches = async (): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    console.log('🗑️ All caches cleared');
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};
