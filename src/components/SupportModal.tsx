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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#fffdf6] p-6 rounded-xl text-center max-w-lg w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Support Fung.es Development
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-700">
            Help us keep Fung.es free and improve the foraging experience for everyone!
          </p>

          {/* Support Buttons */}
          <div className="space-y-3">
            {donationOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold no-underline px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: option.color,
                  color: option.textColor,
                }}
              >
                <img
                  src={option.icon}
                  alt={option.name}
                  className="w-6 h-auto"
                />
                {option.name}
              </a>
            ))}
          </div>

          {/* QR Codes Section - Desktop */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Crypto Donations</h3>
            <div className="grid grid-cols-3 gap-4">
              {cryptoOptions.map((crypto) => (
                <div key={crypto.name} className="text-center">
                  <img
                    src={crypto.icon}
                    alt={`${crypto.name} QR Code`}
                    className="w-24 h-24 mx-auto rounded-lg mb-2"
                  />
                  <p className="text-sm font-medium">{crypto.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 text-xs"
                    onClick={() => handleCopyAddress(crypto.address, crypto.name)}
                  >
                    Copy Address
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Crypto Buttons - Mobile */}
          <div className="md:hidden">
            <h3 className="text-lg font-semibold mb-4">Crypto Donations</h3>
            <div className="space-y-3">
              {cryptoOptions.map((crypto) => (
                <div key={crypto.name} className="text-center">
                  <p className="text-sm font-medium mb-2">{crypto.name}</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleCopyAddress(crypto.address, crypto.name)}
                  >
                    Copy {crypto.name} Address
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Thank you for supporting independent development! 🙏
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 