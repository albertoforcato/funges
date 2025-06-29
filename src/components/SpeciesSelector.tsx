import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useSpeciesList } from '../lib/query';
import type { Species } from '../types/api';

interface SpeciesSelectorProps {
  selectedSpecies?: Species;
  onSpeciesSelect: (species: Species) => void;
}

export const SpeciesSelector = ({ selectedSpecies, onSpeciesSelect }: SpeciesSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [emojiFilter, setEmojiFilter] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const { data: species = [], isLoading } = useSpeciesList();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojiMap: Record<string, string> = {
    '🍄': 'mushroom',
    '🌱': 'plant',
    '🌰': 'nut',
    '🍇': 'berry',
    '🌸': 'flower',
  };

  const filteredSpecies = species.filter((species) => {
    const matchesText = species.name.toLowerCase().includes(filter.toLowerCase()) ||
                       species.scientificName.toLowerCase().includes(filter.toLowerCase());
    const matchesEmoji = !emojiFilter || species.type === emojiMap[emojiFilter];
    return matchesText && matchesEmoji;
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
        setFocusedIndex(prev => 
          prev < filteredSpecies.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSpecies.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && filteredSpecies[focusedIndex]) {
          handleSpeciesSelect(filteredSpecies[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSpeciesSelect = (species: Species) => {
    onSpeciesSelect(species);
    setIsOpen(false);
    setFilter('');
    setFocusedIndex(-1);
  };

  const handleEmojiFilter = (emoji: string) => {
    setEmojiFilter(emojiFilter === emoji ? '' : emoji);
    setFocusedIndex(-1);
  };

  return (
    <div 
      className="fixed top-19 left-1/2 transform -translate-x-1/2 z-50"
      ref={dropdownRef}
    >
      <Card className="p-0 border-0 shadow-none bg-transparent">
        {/* Species Display Button */}
        <Button
          variant="outline"
          className="px-3 py-2 border border-gray-300 rounded-md bg-[rgba(255,252,239,0.9)] cursor-pointer min-w-[260px] max-w-[360px] text-center text-base"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 100);
            }
          }}
          aria-label="Select a species to display on map"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onKeyDown={handleKeyDown}
        >
          <span className="flex-1">
            {selectedSpecies ? selectedSpecies.name : 'Select Species'}
          </span>
          <span className="ml-2" aria-hidden="true">▼</span>
        </Button>

        {/* Dropdown */}
        {isOpen && (
          <Card 
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-[rgba(255,252,239,0.95)] border border-gray-300 rounded-lg p-3 shadow-lg min-w-[260px] max-w-[360px] max-h-[65vh] overflow-y-auto z-50"
            role="listbox"
            aria-label="Species selection"
          >
            {/* Filter Input */}
            <div className="flex justify-center mb-3">
              <Input
                ref={inputRef}
                type="text"
                placeholder="🔍 Type to filter..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setFocusedIndex(-1);
                }}
                className="text-base"
                aria-label="Filter species by name or scientific name"
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Emoji Filters */}
            <div className="text-center mb-2" role="group" aria-label="Filter by species type">
              {Object.entries(emojiMap).map(([emoji, type]) => (
                <button
                  key={emoji}
                  className={`text-xl px-2 py-1 cursor-pointer rounded-md mx-1 transition-colors ${
                    emojiFilter === emoji ? 'bg-[#ffe]' : 'hover:bg-[#ffe]'
                  }`}
                  onClick={() => handleEmojiFilter(emoji)}
                  aria-label={`Filter by ${type} species`}
                  aria-pressed={emojiFilter === emoji}
                >
                  <span aria-hidden="true">{emoji}</span>
                </button>
              ))}
              <button
                className={`text-xl px-2 py-1 cursor-pointer rounded-md mx-1 transition-colors ${
                  emojiFilter === '' ? 'bg-[#ffe]' : 'hover:bg-[#ffe]'
                }`}
                onClick={() => handleEmojiFilter('')}
                aria-label="Clear species type filter"
                aria-pressed={emojiFilter === ''}
              >
                <span aria-hidden="true">✖️</span>
              </button>
            </div>

            {/* Species List */}
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-4" role="status" aria-live="polite">
                  Loading species...
                </div>
              ) : filteredSpecies.length === 0 ? (
                <div className="text-center py-4 text-gray-500" role="status" aria-live="polite">
                  No species found
                </div>
              ) : (
                filteredSpecies.map((species, index) => (
                  <Button
                    key={species.id}
                    variant="ghost"
                    className={`w-full justify-start text-base py-2 px-3 hover:bg-[#fff4dd] rounded-md ${
                      index === focusedIndex ? 'bg-[#fff4dd] ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleSpeciesSelect(species)}
                    role="option"
                    aria-selected={index === focusedIndex}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <span className="mr-2" aria-hidden="true">
                      {Object.entries(emojiMap).find(([, type]) => type === species.type)?.[0] || '🌿'}
                    </span>
                    <div className="text-left">
                      <div className="font-medium">{species.name}</div>
                      <div className="text-sm text-gray-600">{species.scientificName}</div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
}; 