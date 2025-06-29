import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Heart, ExternalLink } from 'lucide-react';
import { useSupportMethods } from '@/data/support';
import { useTranslation } from 'react-i18next';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal = ({ isOpen, onClose }: SupportModalProps) => {
  const { t } = useTranslation('support');
  const supportMethods = useSupportMethods();

  const handleDonationClick = (method: (typeof supportMethods)[0]) => {
    if (method.url) {
      window.open(method.url, '_blank', 'noopener,noreferrer');
    } else if (method.address) {
      // For crypto addresses, we could copy to clipboard or show QR code
      navigator.clipboard.writeText(method.address);
      // You could add a toast notification here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Heart className='h-5 w-5 text-error' />
            {t('support.title')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            {t('support.description')}
          </p>
          <div className='grid gap-3'>
            {supportMethods.map(method => (
              <Card
                key={method.id}
                className='p-4 cursor-pointer hover:bg-accent transition-colors'
                onClick={() => handleDonationClick(method)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div
                      className='p-2 rounded-lg'
                      style={{
                        backgroundColor: method.color
                          ? `${method.color}20`
                          : 'var(--accent)',
                      }}
                    >
                      <method.icon className='h-5 w-5' />
                    </div>
                    <div>
                      <h3 className='font-medium'>{method.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {method.description}
                      </p>
                    </div>
                  </div>
                  {method.url && (
                    <ExternalLink className='h-4 w-4 text-muted-foreground' />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
