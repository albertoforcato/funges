// Color constants for the application
// These colors are used across components and should be theme-aware

// Map color scales for different species types
export const MAP_COLORS = {
  // Mushroom color scale (warm colors)
  mushrooms: {
    light: [
      '#ffffcc', // Very low
      '#ffe4b5', // Low
      '#fbae7e', // Medium-low
      '#fb6d51', // Medium
      '#a60310', // High
      '#800020', // Very high
    ],
    dark: [
      '#2d2d00', // Very low
      '#4d3d1a', // Low
      '#6d4d2a', // Medium-low
      '#8d5d3a', // Medium
      '#ad6d4a', // High
      '#cd7d5a', // Very high
    ],
  },

  // Berry color scale (blue colors)
  berries: {
    light: [
      '#f0f8ff', // Very low
      '#e6f3ff', // Low
      '#b3d9ff', // Medium-low
      '#80bfff', // Medium
      '#4da6ff', // High
      '#1a8cff', // Very high
    ],
    dark: [
      '#0a1a2e', // Very low
      '#1a2a3e', // Low
      '#2a3a4e', // Medium-low
      '#3a4a5e', // Medium
      '#4a5a6e', // High
      '#5a6a7e', // Very high
    ],
  },

  // Herb color scale (green colors - updated to match new theme)
  herbs: {
    light: [
      '#f0f9f4', // Very low - light green
      '#dcf2e3', // Low - very light green
      '#b8e4c7', // Medium-low - light green
      '#94d6ab', // Medium - medium light green
      '#70c88f', // High - medium green
      '#4cba73', // Very high - main theme color
    ],
    dark: [
      '#0a1a0e', // Very low
      '#1a2a1e', // Low
      '#2a3a2e', // Medium-low
      '#3a4a3e', // Medium
      '#4a5a4e', // High
      '#5a6a5e', // Very high
    ],
  },

  // Nut color scale (orange/yellow colors)
  nuts: {
    light: [
      '#fff8dc', // Very low
      '#ffe4b5', // Low
      '#ffd700', // Medium-low
      '#ffa500', // Medium
      '#ff8c00', // High
      '#ff4500', // Very high
    ],
    dark: [
      '#3a2d1a', // Very low
      '#4a3d2a', // Low
      '#5a4d3a', // Medium-low
      '#6a5d4a', // Medium
      '#7a6d5a', // High
      '#8a7d6a', // Very high
    ],
  },
};

// Map border and overlay colors
export const MAP_UI_COLORS = {
  border: {
    light: '#666666',
    dark: '#999999',
  },
  hover: {
    light: '#000000',
    dark: '#ffffff',
  },
  pin: {
    light: '#4cba73', // Updated to new primary color - oklch(0.5234 0.1347 144.1672)
    dark: '#4cba73', // Updated to new primary color - oklch(0.5234 0.1347 144.1672)
  },
};

// Score colors for confidence indicators
export const SCORE_COLORS = {
  excellent: {
    light: '#4cba73', // oklch(0.5234 0.1347 144.1672) - primary color
    dark: '#4cba73',
  },
  good: {
    light: '#70c88f', // Medium green
    dark: '#70c88f',
  },
  fair: {
    light: '#f59e0b', // Warning color
    dark: '#f59e0b',
  },
  poor: {
    light: '#ef4444', // Error color
    dark: '#ef4444',
  },
};

// Status colors
export const STATUS_COLORS = {
  success: '#4cba73', // oklch(0.5234 0.1347 144.1672) - primary color
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Theme-aware color getters
export const getThemeColor = (
  color: string,
  theme: 'light' | 'dark' = 'light'
) => {
  const colorMap: Record<string, { light: string; dark: string }> = {
    primary: {
      light: '#4cba73', // oklch(0.5234 0.1347 144.1672)
      dark: '#4cba73',
    },
    background: {
      light: '#fafafa',
      dark: '#171717',
    },
    text: {
      light: '#1a1a1a',
      dark: '#f5f5f5',
    },
  };

  return colorMap[color]?.[theme] || colorMap[color]?.light || color;
};

// Utility function to get color based on theme and score
export const getScoreColor = (
  score: number,
  theme: 'light' | 'dark' = 'light'
) => {
  if (score >= 8) return SCORE_COLORS.excellent[theme];
  if (score >= 6) return SCORE_COLORS.good[theme];
  if (score >= 4) return SCORE_COLORS.fair[theme];
  return SCORE_COLORS.poor[theme];
};

// Utility function to get species color scale
export const getSpeciesColorScale = (
  species: string,
  theme: 'light' | 'dark' = 'light'
) => {
  const colorScale = MAP_COLORS[species as keyof typeof MAP_COLORS];
  return colorScale ? colorScale[theme] : MAP_COLORS.mushrooms[theme];
};

// Utility function to get color for a specific score
export const getColorForScore = (
  score: number,
  species: string,
  theme: 'light' | 'dark' = 'light'
) => {
  const colors = getSpeciesColorScale(species, theme);

  if (score <= 2) return colors[0];
  if (score <= 4) return colors[1];
  if (score <= 6) return colors[2];
  if (score <= 8) return colors[3];
  if (score <= 9) return colors[4];
  return colors[5];
};

// Utility: Map season to semantic class names
export const getSeasonClass = (season?: string) => {
  if (!season) return 'bg-background-secondary text-text-primary';
  if (season.includes('spring')) return 'bg-success/10 text-success';
  if (season.includes('summer')) return 'bg-warning/10 text-warning';
  if (season.includes('fall')) return 'bg-warning/10 text-warning'; // fallback, can be mapped to a semantic if desired
  if (season.includes('winter')) return 'bg-primary/10 text-primary'; // fallback, can be mapped to a semantic if desired
  return 'bg-background-secondary text-text-primary';
};

// Utility: Map habitat to semantic class names
export const getHabitatClass = (habitat?: string) => {
  if (!habitat) return 'bg-background-secondary text-text-primary';
  if (habitat === 'forest') return 'bg-success/10 text-success';
  if (habitat === 'meadows') return 'bg-success/10 text-success'; // fallback
  if (habitat === 'hedgerows') return 'bg-warning/10 text-warning'; // fallback
  return 'bg-background-secondary text-text-primary';
};

// Utility: Map confidence to semantic class names for badges
export const getConfidenceBadgeClass = (confidence: number) => {
  if (confidence >= 0.8) return 'bg-success/10 text-success border-success/30';
  if (confidence >= 0.6) return 'bg-warning/10 text-warning border-warning/30';
  return 'bg-error/10 text-error border-error/30';
};

// Utility: Map confidence to semantic class names for progress bars
export const getConfidenceBarClass = (confidence: number) => {
  if (confidence >= 0.8) return 'bg-success';
  if (confidence >= 0.6) return 'bg-warning';
  return 'bg-error';
}; 
