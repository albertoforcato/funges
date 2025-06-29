import React from 'react';
import { z } from 'zod';
import { useZodForm } from '../../lib/forms';
import { useSpeciesList } from '../../lib/query';

// Define the species filter schema
const speciesFilterSchema = z.object({
  searchTerm: z.string().optional(),
  emojiFilter: z.string().optional(),
  selectedSpecies: z.array(z.string()).default([]),
});

type SpeciesFilterData = z.infer<typeof speciesFilterSchema>;

// Emoji mapping for species types
const emojiMap: Record<string, string> = {
  mushroom: '🍄',
  plant: '🌱',
  nut: '🌰',
  berry: '🍇',
  flower: '🌸',
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

  // Fetch species list from API
  const { data: speciesList, isLoading, error } = useSpeciesList();

  // Update parent when form changes
  React.useEffect(() => {
    const subscription = watch(value => {
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

  // Filter species by emoji/type and search term
  const filteredSpecies = React.useMemo(() => {
    if (!speciesList) return [];
    return speciesList.filter(sp => {
      const emoji = emojiMap[sp.type];
      const matchesEmoji = !emojiFilter || emoji === emojiFilter;
      const matchesSearch =
        !searchTerm || sp.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesEmoji && matchesSearch;
    });
  }, [speciesList, emojiFilter, searchTerm]);

  return (
    <div className='species-filter-form'>
      <div className='filter-wrapper'>
        <input
          type='text'
          placeholder='🔍 Type to filter...'
          value={searchTerm || ''}
          onChange={e => setValue('searchTerm', e.target.value)}
          className='species-filter-input'
        />
      </div>
      <div className='emoji-filters'>
        {Object.values(emojiMap).map(emoji => (
          <span
            key={emoji}
            className={`emoji-filter ${emojiFilter === emoji ? 'active' : ''}`}
            onClick={() => handleEmojiFilter(emoji)}
          >
            {emoji}
          </span>
        ))}
        <span
          className={`emoji-filter ${emojiFilter === '' ? 'active' : ''}`}
          onClick={() => handleEmojiFilter('')}
        >
          ✖️
        </span>
      </div>
      <div className='species-list'>
        {isLoading && <div>Loading species...</div>}
        {error && <div>Error loading species.</div>}
        {!isLoading &&
          !error &&
          filteredSpecies.map(sp => (
            <div key={sp.id} className='species-option'>
              <input
                type='checkbox'
                id={sp.id}
                value={sp.id}
                checked={selectedSpecies.includes(sp.id)}
                onChange={() => handleSpeciesToggle(sp.id)}
              />
              <label htmlFor={sp.id}>
                {emojiMap[sp.type] || ''} {sp.name}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
}
