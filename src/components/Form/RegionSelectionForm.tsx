import React from 'react';
import { z } from 'zod';
import { useZodForm } from '../../lib/forms';

// Define the region selection schema
const regionSelectionSchema = z.object({
  region: z.enum([
    'WE_north',
    'WE_south', 
    'NE_north',
    'NE_south',
    'EE_north',
    'EE_south'
  ]),
});

type RegionSelectionData = z.infer<typeof regionSelectionSchema>;

// Region options (moved from legacy JS)
const regionOptions = [
  { value: 'WE_north', label: 'West Europe North' },
  { value: 'WE_south', label: 'West Europe South' },
  { value: 'NE_north', label: 'North Europe North' },
  { value: 'NE_south', label: 'North Europe South' },
  { value: 'EE_north', label: 'East Europe North' },
  { value: 'EE_south', label: 'East Europe South' },
];

interface RegionSelectionFormProps {
  onRegionChange: (data: RegionSelectionData) => void;
  currentRegion?: string;
}

export function RegionSelectionForm({ onRegionChange, currentRegion }: RegionSelectionFormProps) {
  const form = useZodForm(regionSelectionSchema, {
    defaultValues: {
      region: (currentRegion as any) || 'WE_north',
    },
  });

  const { watch, setValue, formState: { errors } } = form;
  const selectedRegion = watch('region');

  // Update parent when region changes
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value.region) {
        onRegionChange(value as RegionSelectionData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onRegionChange]);

  const handleRegionChange = (region: string) => {
    setValue('region', region as any);
  };

  return (
    <div className="region-selection-form">
      <div className="region-dropdown">
        <div className="region-display">
          <span className="current-region">
            {regionOptions.find(opt => opt.value === selectedRegion)?.label || 'Select Region'}
          </span>
          <span className="dropdown-arrow">▼</span>
        </div>
        
        <div className="region-options">
          {regionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`region-option ${selectedRegion === option.value ? 'selected' : ''}`}
              onClick={() => handleRegionChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {errors.region && (
        <div className="error-message">
          {errors.region.message}
        </div>
      )}
    </div>
  );
} 