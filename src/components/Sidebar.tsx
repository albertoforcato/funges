import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

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
    { id: 'EE_north', name: 'East Europe North' },
    { id: 'EE_south', name: 'East Europe South' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      className="fixed top-0 left-0 h-[calc(100vh-40px)] w-20 bg-[rgba(255,252,239,0.9)] flex flex-col items-center py-2 shadow-md overflow-y-auto overflow-x-visible z-40"
      role="complementary"
      aria-label="Toolbar"
    >
      {/* Logo */}
      <div className="mb-4">
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/logo_1.webp"
          alt="Fung.es Logo"
          className="w-16 h-auto"
          loading="lazy"
        />
      </div>

      {/* Image Upload Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-3 w-10 h-10 p-0"
        onClick={onImageUpload}
        aria-label="Identify mushroom or plant from image"
        title="Identify Mushroom"
      >
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/id_mushroom.webp"
          alt=""
          className="w-10 h-auto"
          loading="lazy"
          aria-hidden="true"
        />
      </Button>

      {/* Region Selection Button */}
      <div className="relative mb-3" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 p-0"
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          aria-label="Select foraging region"
          aria-expanded={showRegionDropdown}
          aria-haspopup="listbox"
          title="Select Region"
        >
          <img
            src="https://raw.githubusercontent.com/lodist/funges/main/icons/region_1.webp"
            alt=""
            className="w-10 h-auto"
            loading="lazy"
            aria-hidden="true"
          />
        </Button>

        {/* Region Dropdown */}
        {showRegionDropdown && (
          <div 
            className="absolute left-full top-0 ml-2 bg-[rgba(255,252,239,0.9)] rounded-lg shadow-lg p-1 min-w-[170px] z-50"
            role="listbox"
            aria-label="Select region"
            onKeyDown={handleKeyDown}
          >
            {regions.map((region) => (
              <Button
                key={region.id}
                variant="ghost"
                className="w-full justify-start text-sm h-auto py-2 px-3 hover:bg-[rgba(255,252,239,1)]"
                onClick={() => {
                  onRegionSelect(region.id);
                  setShowRegionDropdown(false);
                }}
                role="option"
                aria-selected={false}
              >
                {region.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Edibles Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-3 w-10 h-10 p-0"
        onClick={onToggleNearby}
        aria-label="Show nearby edible plants and mushrooms"
        title="Nearby Edibles"
      >
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/cooking_1.webp"
          alt=""
          className="w-10 h-auto"
          loading="lazy"
          aria-hidden="true"
        />
      </Button>

      {/* Locate User Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-3 w-10 h-10 p-0"
        onClick={onLocateUser}
        aria-label="Use my current location"
        title="Locate Me"
      >
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/location_1.webp"
          alt=""
          className="w-10 h-auto"
          loading="lazy"
          aria-hidden="true"
        />
      </Button>

      {/* Dark Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-3 w-10 h-10 p-0"
        onClick={onToggleDarkMode}
        aria-label="Toggle dark mode"
        title="Toggle Dark Mode"
      >
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/darkmode_1.webp"
          alt=""
          className="w-10 h-auto"
          loading="lazy"
          aria-hidden="true"
        />
      </Button>

      {/* Numbers Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-3 w-10 h-10 p-0"
        onClick={onToggleNumbers}
        aria-label="Toggle numbers display"
        title="Toggle Numbers"
      >
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/numbers_1.webp"
          alt=""
          className="w-10 h-auto"
          loading="lazy"
          aria-hidden="true"
        />
      </Button>

      {/* Support Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mb-3 w-10 h-10 p-0"
        onClick={onToggleSupport}
        aria-label="Support Fung.es project"
        title="Support"
      >
        <img
          src="https://raw.githubusercontent.com/lodist/funges/main/icons/support_1.webp"
          alt=""
          className="w-10 h-auto"
          loading="lazy"
          aria-hidden="true"
        />
      </Button>
    </aside>
  );
}; 