import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useSpeciesList } from '../lib/query';
import { Search, ChevronDown, Filter } from 'lucide-react';
import type { Species } from '../types/api';

interface SpeciesSelectorProps {
  selectedSpecies?: Species;
  onSpeciesSelect: (species: Species) => void;
}

export const SpeciesSelector = ({ selectedSpecies, onSpeciesSelect }: SpeciesSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const { data: species = [], isLoading } = useSpeciesList();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const typeMap: Record<string, string> = {
    'mushroom': '🍄',
    'plant': '🌿',
    'berry': '🫐',
    'nut': '🌰',
    'flower': '🌸',
  };

  const filteredSpecies = species.filter((s) => {
    const matchesFilter = s.name.toLowerCase().includes(filter.toLowerCase()) ||
                         s.scientificName.toLowerCase().includes(filter.toLowerCase());
    const matchesType = !typeFilter || s.type === typeFilter;
    return matchesFilter && matchesType;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredSpecies.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && filteredSpecies[focusedIndex]) {
          onSpeciesSelect(filteredSpecies[focusedIndex]);
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    setFocusedIndex(-1);
  }, [filter, typeFilter]);

  return (
    <div className="relative w-full max-w-md">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-between"
        aria-label="Select species"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onKeyDown={handleKeyDown}
      >
        <span className="flex items-center gap-2">
          {selectedSpecies ? (
            <>
              <span>{typeMap[selectedSpecies.type]}</span>
              <span>{selectedSpecies.name}</span>
            </>
          ) : (
            'Select a species...'
          )}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 p-4 max-h-96 overflow-y-auto z-50">
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search species..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Type Filter */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter by type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={typeFilter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('')}
                className="text-sm"
              >
                All
              </Button>
              {Object.entries(typeMap).map(([type, emoji]) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className="text-sm"
                >
                  {emoji} {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Species List */}
          <div role="listbox" aria-label="Species selection">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading species...</div>
            ) : filteredSpecies.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No species found</div>
            ) : (
              filteredSpecies.map((species, index) => (
                <button
                  key={species.id}
                  onClick={() => {
                    onSpeciesSelect(species);
                    setIsOpen(false);
                    setFocusedIndex(-1);
                  }}
                  className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    focusedIndex === index ? 'bg-gray-100' : ''
                  }`}
                  role="option"
                  aria-selected={focusedIndex === index}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{typeMap[species.type]}</span>
                    <div>
                      <div className="font-medium">{species.name}</div>
                      <div className="text-sm text-gray-500 italic">{species.scientificName}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}; 