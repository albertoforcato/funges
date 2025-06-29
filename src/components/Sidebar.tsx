import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Navigation,
  Moon,
  Hash,
  Users,
  Heart,
  Globe,
  Leaf,
} from 'lucide-react';

interface SidebarProps {
  onImageUpload: () => void;
  onRegionSelect: (region: string) => void;
  onLocateUser: () => void;
  onToggleDarkMode: () => void;
  onToggleNumbers: () => void;
  onToggleNearby: () => void;
  onToggleSupport: () => void;
}

export const Sidebar = ({
  onImageUpload,
  onRegionSelect,
  onLocateUser,
  onToggleDarkMode,
  onToggleNumbers,
  onToggleNearby,
  onToggleSupport,
}: SidebarProps) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const regions = [
    { id: 'WE_north', name: 'West Europe North' },
    { id: 'WE_south', name: 'West Europe South' },
    { id: 'NE_north', name: 'North Europe North' },
    { id: 'NE_south', name: 'North Europe South' },
    { id: 'CE_north', name: 'Central Europe North' },
    { id: 'CE_south', name: 'Central Europe South' },
    { id: 'EE_north', name: 'East Europe North' },
    { id: 'EE_south', name: 'East Europe South' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowRegionDropdown(false);
      }
    };

    if (showRegionDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRegionDropdown]);

  // Handle keyboard navigation for dropdown
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowRegionDropdown(false);
    }
  };

  return (
    <aside
      className='fixed left-0 top-0 h-full w-20 bg-background-secondary flex flex-col items-center py-4 gap-4 z-50 shadow-sm'
      role='complementary'
      aria-label='Main controls sidebar'
    >
      {/* Logo */}
      <div className='mb-8'>
        <div className='w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center'>
          <Leaf className='w-8 h-8 text-white' />
        </div>
      </div>

      {/* Image Upload Button */}
      <Button
        onClick={onImageUpload}
        variant='ghost'
        size='icon'
        className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
        aria-label='Upload image for identification'
        title='Upload image for identification'
      >
        <Camera className='w-6 h-6' />
      </Button>

      {/* Region Selection */}
      <div className='relative' ref={dropdownRef}>
        <Button
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          variant='ghost'
          size='icon'
          className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
          aria-label='Select region'
          aria-expanded={showRegionDropdown}
          aria-haspopup='listbox'
          title='Select region'
          onKeyDown={handleKeyDown}
        >
          <Globe className='w-6 h-6' />
        </Button>

        {showRegionDropdown && (
          <div
            className='absolute left-16 top-0 w-48 bg-background-primary rounded-lg shadow-lg border border-border py-2 z-50'
            role='listbox'
            aria-label='Region selection'
          >
            {regions.map(region => (
              <button
                key={region.id}
                onClick={() => {
                  onRegionSelect(region.id);
                  setShowRegionDropdown(false);
                }}
                className='w-full text-left px-4 py-2 hover:bg-hover-secondary focus:bg-hover-secondary focus:outline-none text-text-primary'
                role='option'
                aria-selected='false'
              >
                {region.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locate User Button */}
      <Button
        onClick={onLocateUser}
        variant='ghost'
        size='icon'
        className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
        aria-label='Locate my position'
        title='Locate my position'
      >
        <Navigation className='w-6 h-6' />
      </Button>

      {/* Dark Mode Toggle */}
      <Button
        onClick={onToggleDarkMode}
        variant='ghost'
        size='icon'
        className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
        aria-label='Toggle dark mode'
        title='Toggle dark mode'
      >
        <Moon className='w-6 h-6' />
      </Button>

      {/* Numbers Toggle */}
      <Button
        onClick={onToggleNumbers}
        variant='ghost'
        size='icon'
        className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
        aria-label='Toggle numbers display'
        title='Toggle numbers display'
      >
        <Hash className='w-6 h-6' />
      </Button>

      {/* Nearby Toggle */}
      <Button
        onClick={onToggleNearby}
        variant='ghost'
        size='icon'
        className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
        aria-label='Toggle nearby spots'
        title='Toggle nearby spots'
      >
        <Users className='w-6 h-6' />
      </Button>

      {/* Support Button */}
      <Button
        onClick={onToggleSupport}
        variant='ghost'
        size='icon'
        className='w-12 h-12 rounded-lg hover:bg-hover-primary transition-colors'
        aria-label='Support Fung.es'
        title='Support Fung.es'
      >
        <Heart className='w-6 h-6' />
      </Button>
    </aside>
  );
};
