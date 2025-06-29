import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store in localStorage to remember user's choice
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or user dismissed
  if (
    isInstalled ||
    !showPrompt ||
    localStorage.getItem('pwa-prompt-dismissed')
  ) {
    return null;
  }

  return (
    <div className='fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80'>
      <Card className='shadow-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Smartphone className='h-5 w-5 text-green-600' />
              <CardTitle className='text-lg text-green-800'>
                Install Fung.es
              </CardTitle>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleDismiss}
              className='h-6 w-6 p-0 text-gray-500 hover:text-gray-700'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <CardDescription className='text-green-700 mb-4'>
            Install Fung.es on your device for quick access and offline
            functionality.
          </CardDescription>
          <div className='flex space-x-2'>
            <Button
              onClick={handleInstallClick}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white'
            >
              <Download className='h-4 w-4 mr-2' />
              Install App
            </Button>
            <Button
              variant='outline'
              onClick={handleDismiss}
              className='border-green-300 text-green-700 hover:bg-green-50'
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
