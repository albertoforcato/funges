import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';

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
      name: 'PayPal',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/paypal.webp',
      url: 'https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_ID',
      color: '#0070ba',
      textColor: 'white',
    },
  ];

  const cryptoOptions = [
    {
      name: 'Bitcoin',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/bitcoin_qr.webp',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    },
    {
      name: 'Ethereum',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/ethereum_qr.webp',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    },
    {
      name: 'IOTA',
      icon: 'https://raw.githubusercontent.com/lodist/funges/main/QR/iota_qr.webp',
      address: 'atoi1qzt0nhsf38nh6rs4p6zs5knqp6psgha9wsv74uaj2w3g2xlz6ue4a0ulvf',
    },
  ];

  const handleCopyAddress = (address: string, name: string) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
    alert(`${name} address copied to clipboard!`);
  };

  const handleDonationClick = (url: string, name: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // Track donation click if needed
    console.log(`Donation clicked: ${name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Support Fung.es</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Help us keep Fung.es free and improve our services. Choose your preferred way to support:
          </p>

          {/* Donation Options */}
          <div className="space-y-3">
            {donationOptions.map((option) => (
              <Card
                key={option.name}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDonationClick(option.url, option.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDonationClick(option.url, option.name);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Support via ${option.name}`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={option.icon}
                    alt={`${option.name} QR code`}
                    className="w-12 h-12 rounded"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-gray-500">Click to donate</p>
                  </div>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: option.color,
                      color: option.textColor,
                    }}
                    className="hover:opacity-90"
                    aria-label={`Donate via ${option.name}`}
                  >
                    Donate
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Support Info */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              Your support helps us maintain and improve the Fung.es platform.
            </p>
            <p>
              Thank you for helping us keep foraging knowledge accessible to everyone!
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              aria-label="Close support modal"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 