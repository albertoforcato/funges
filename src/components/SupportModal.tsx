import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import { Heart, ExternalLink } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal = ({ isOpen, onClose }: SupportModalProps) => {
  const donationOptions = [
    {
      name: 'Patreon',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/patreon.webp',
      url: 'https://www.patreon.com/funges',
      color: '#ff424d',
      textColor: 'white',
    },
    {
      name: 'Buy Me a Coffee',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/buymeacoffee.webp',
      url: 'https://www.buymeacoffee.com/funges',
      color: '#ffdd00',
      textColor: 'black',
    },
    {
      name: 'Bitcoin',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/bitcoin_qr.webp',
      url: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      color: '#f7931a',
      textColor: 'white',
    },
    {
      name: 'Ethereum',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/ethereum_qr.webp',
      url: 'ethereum:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      color: '#627eea',
      textColor: 'white',
    },
    {
      name: 'IOTA',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/iota_qr.webp',
      url: 'iota:atoi1qzt0nhsf38nh6rs4p6zs5knqp6psgha9wgd74a8u7cgstkcj5jl3y7x0r8',
      color: '#131f37',
      textColor: 'white',
    },
  ];

  const handleDonationClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Support Fung.es
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">
            Help us keep Fung.es free and continue developing new features for the foraging community.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {donationOptions.map((option) => (
              <Card
                key={option.name}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDonationClick(option.url)}
                role="button"
                tabIndex={0}
                aria-label={`Donate via ${option.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDonationClick(option.url);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={option.icon}
                      alt={`${option.name} QR code`}
                      className="w-12 h-12 rounded"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-gray-500">Click to donate</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Thank you for supporting the foraging community! 🌿
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 