import { usePWA } from '@/hooks/use-pwa';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Download, RefreshCw } from 'lucide-react';
import { showInstallPrompt, canInstallApp } from '@/lib/pwa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator = () => {
  const { t } = useTranslation();
  const { isOnline, isInstalled, hasUpdate, reloadForUpdate } = usePWA();
  const [canInstall, setCanInstall] = useState(canInstallApp());

  const handleInstallClick = async () => {
    const success = await showInstallPrompt();
    if (success) {
      setCanInstall(false);
    }
  };

  if (isOnline && !hasUpdate && !canInstall) {
    return null;
  }

  return (
    <div className='fixed top-4 right-4 z-50 flex flex-col gap-2'>
      {!isOnline && (
        <Badge variant='destructive' className='flex items-center gap-2'>
          <WifiOff className='h-4 w-4' />
          <span>{t('offline.mode')}</span>
        </Badge>
      )}

      {hasUpdate && (
        <Badge
          variant='secondary'
          className='flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
          onClick={reloadForUpdate}
        >
          <RefreshCw className='h-4 w-4' />
          <span>{t('offline.updateAvailable')}</span>
        </Badge>
      )}

      {canInstall && !isInstalled && (
        <Badge
          variant='outline'
          className='flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
          onClick={handleInstallClick}
        >
          <Download className='h-4 w-4' />
          <span>{t('offline.installApp')}</span>
        </Badge>
      )}
    </div>
  );
};
