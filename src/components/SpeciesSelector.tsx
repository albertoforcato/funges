import { useState } from 'react';
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
  
  const { data: species = [], isLoading } = useSpeciesList();

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

  const handleSpeciesSelect = (species: Species) => {
    onSpeciesSelect(species);
    setIsOpen(false);
    setFilter('');
  };

  return (
    <div className="fixed top-19 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="p-0 border-0 shadow-none bg-transparent">
        {/* Species Display Button */}
        <Button
          variant="outline"
          className="px-3 py-2 border border-gray-300 rounded-md bg-[rgba(255,252,239,0.9)] cursor-pointer min-w-[260px] max-w-[360px] text-center text-base"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex-1">
            {selectedSpecies ? selectedSpecies.name : 'Select Species'}
          </span>
          <span className="ml-2">▼</span>
        </Button>

        {/* Dropdown */}
        {isOpen && (
          <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-[rgba(255,252,239,0.95)] border border-gray-300 rounded-lg p-3 shadow-lg min-w-[260px] max-w-[360px] max-h-[65vh] overflow-y-auto z-50">
            {/* Filter Input */}
            <div className="flex justify-center mb-3">
              <Input
                type="text"
                placeholder="🔍 Type to filter..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Emoji Filters */}
            <div className="text-center mb-2">
              {Object.entries(emojiMap).map(([emoji, type]) => (
                <button
                  key={emoji}
                  className={`text-xl px-2 py-1 cursor-pointer rounded-md mx-1 transition-colors ${
                    emojiFilter === emoji ? 'bg-[#ffe]' : 'hover:bg-[#ffe]'
                  }`}
                  onClick={() => setEmojiFilter(emojiFilter === emoji ? '' : emoji)}
                >
                  {emoji}
                </button>
              ))}
              <button
                className={`text-xl px-2 py-1 cursor-pointer rounded-md mx-1 transition-colors ${
                  emojiFilter === '' ? 'bg-[#ffe]' : 'hover:bg-[#ffe]'
                }`}
                onClick={() => setEmojiFilter('')}
              >
                ✖️
              </button>
            </div>

            {/* Species List */}
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-4">Loading species...</div>
              ) : filteredSpecies.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No species found</div>
              ) : (
                filteredSpecies.map((species) => (
                  <Button
                    key={species.id}
                    variant="ghost"
                    className="w-full justify-start text-base py-2 px-3 hover:bg-[#fff4dd] rounded-md"
                    onClick={() => handleSpeciesSelect(species)}
                  >
                    <span className="mr-2">
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