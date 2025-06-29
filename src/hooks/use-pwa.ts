import { useState, useEffect } from 'react';

interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  hasUpdate: boolean;
  isLoading: boolean;
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isOnline: navigator.onLine,
    isInstalled: false,
    hasUpdate: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if app is installed (PWA)
    const checkInstallation = () => {
      const isInstalled =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      setStatus(prev => ({ ...prev, isInstalled, isLoading: false }));
    };

    // Handle online/offline status
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setStatus(prev => ({ ...prev, isOnline: false }));

    // Check installation status
    checkInstallation();

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for display mode changes (PWA installation)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallation);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', checkInstallation);
    };
  }, []);

  // Function to install PWA
  const installPWA = async () => {
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
      const promptEvent = (window as any).deferredPrompt;
      if (promptEvent) {
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') {
          setStatus(prev => ({ ...prev, isInstalled: true }));
        }
        (window as any).deferredPrompt = null;
      }
    }
  };

  // Function to reload app for updates
  const reloadForUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      });
    }
  };

  return {
    ...status,
    installPWA,
    reloadForUpdate,
  };
};
