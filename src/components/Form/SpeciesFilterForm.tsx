import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useZodForm, type FormFieldProps } from '../../lib/forms';

// Define the species filter schema
const speciesFilterSchema = z.object({
  searchTerm: z.string().optional(),
  emojiFilter: z.string().optional(),
  selectedSpecies: z.array(z.string()).default([]),
});

type SpeciesFilterData = z.infer<typeof speciesFilterSchema>;

// Species options (moved from legacy JS)
const speciesOptions = {
  '🍄 Mushrooms': 'mushroom',
  '🌱 Plants': 'plant',
  '🌰 Nuts': 'nut',
  '🍇 Berries': 'berry',
  '🌸 Flowers': 'flower',
};

interface SpeciesFilterFormProps {
  onFilterChange: (data: SpeciesFilterData) => void;
}

export function SpeciesFilterForm({ onFilterChange }: SpeciesFilterFormProps) {
  const form = useZodForm(speciesFilterSchema, {
    defaultValues: {
      searchTerm: '',
      emojiFilter: '',
      selectedSpecies: [],
    },
  });

  const { watch, setValue } = form;
  const searchTerm = watch('searchTerm');
  const emojiFilter = watch('emojiFilter');
  const selectedSpecies = watch('selectedSpecies');

  // Update parent when form changes
  React.useEffect(() => {
    const subscription = watch((value) => {
      onFilterChange(value as SpeciesFilterData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFilterChange]);

  const handleEmojiFilter = (emoji: string) => {
    setValue('emojiFilter', emojiFilter === emoji ? '' : emoji);
  };

  const handleSpeciesToggle = (species: string) => {
    const newSelected = selectedSpecies.includes(species)
      ? selectedSpecies.filter(s => s !== species)
      : [...selectedSpecies, species];
    setValue('selectedSpecies', newSelected);
  };

  return (
    <div className="species-filter-form">
      <div className="filter-wrapper">
        <input
          type="text"
          placeholder="🔍 Type to filter..."
          value={searchTerm || ''}
          onChange={(e) => setValue('searchTerm', e.target.value)}
          className="species-filter-input"
        />
      </div>
      
      <div className="emoji-filters">
        <span 
          className={`emoji-filter ${emojiFilter === '🍄' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('🍄')}
        >
          🍄
        </span>
        <span 
          className={`emoji-filter ${emojiFilter === '🌱' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('🌱')}
        >
          🌱
        </span>
        <span 
          className={`emoji-filter ${emojiFilter === '🌰' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('🌰')}
        >
          🌰
        </span>
        <span 
          className={`emoji-filter ${emojiFilter === '🍇' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('🍇')}
        >
          🍇
        </span>
        <span 
          className={`emoji-filter ${emojiFilter === '🌸' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('🌸')}
        >
          🌸
        </span>
        <span 
          className={`emoji-filter ${emojiFilter === '' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('')}
        >
          ✖️
        </span>
      </div>

      <div className="species-list">
        {Object.entries(speciesOptions)
          .filter(([label]) => 
            !emojiFilter || label.includes(emojiFilter) ||
            !searchTerm || label.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(([label, value]) => (
            <div key={value} className="species-option">
              <input
                type="checkbox"
                id={value}
                value={value}
                checked={selectedSpecies.includes(value)}
                onChange={() => handleSpeciesToggle(value)}
              />
              <label htmlFor={value}>{label}</label>
            </div>
          ))}
      </div>
    </div>
  );
} 