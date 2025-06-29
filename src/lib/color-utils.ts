// Color utility functions for consistent usage across the application
import { colors, type ColorTheme } from './colors';

// Color class mappings for Tailwind CSS
export const colorClasses = {
  // Text colors
  text: {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary: 'text-text-tertiary',
    inverse: 'text-text-inverse',
    brand: 'text-primary',
    muted: 'text-muted-foreground',
  },

  // Background colors
  background: {
    primary: 'bg-background-primary',
    secondary: 'bg-background-secondary',
    tertiary: 'bg-background-tertiary',
    overlay: 'bg-background-overlay',
    brand: 'bg-primary',
    muted: 'bg-muted',
    card: 'bg-card',
  },

  // Border colors
  border: {
    primary: 'border-primary',
    secondary: 'border-border',
    muted: 'border-muted',
    brand: 'border-primary',
  },

  // Hover states
  hover: {
    primary: 'hover:bg-hover-primary',
    secondary: 'hover:bg-hover-secondary',
    brand: 'hover:bg-primary/90',
    text: 'hover:text-primary',
  },

  // Focus states
  focus: {
    ring: 'focus:ring-2 focus:ring-ring focus:ring-offset-2',
    border: 'focus:border-primary',
  },

  // Status colors
  status: {
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    info: 'text-status-info',
  },
} as const;

// Semantic color combinations for common use cases
export const colorCombinations = {
  // Button variants
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },

  // Card variants
  card: {
    default: 'bg-card text-card-foreground',
    elevated: 'bg-card text-card-foreground shadow-md',
    bordered: 'bg-card text-card-foreground border border-border',
  },

  // Input variants
  input: {
    default:
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    error: 'border-destructive focus-visible:ring-destructive',
  },

  // Badge variants
  badge: {
    default:
      'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    primary:
      'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive:
      'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
    outline: 'text-foreground',
  },
} as const;

// Utility function to get theme-aware color classes
export const getThemeColorClasses = (theme: ColorTheme = 'light') => {
  return {
    text: {
      primary: theme === 'light' ? 'text-neutral-900' : 'text-neutral-100',
      secondary: theme === 'light' ? 'text-neutral-600' : 'text-neutral-400',
      tertiary: theme === 'light' ? 'text-neutral-500' : 'text-neutral-500',
    },
    background: {
      primary: theme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900',
      secondary: theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800',
      tertiary: theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700',
    },
  };
};

// Utility function to get color value by name
export const getColorValue = (
  colorName: string,
  theme: ColorTheme = 'light'
) => {
  const colorPath = colorName.split('.');
  let current: any = colors;

  for (const path of colorPath) {
    if (current[path] === undefined) {
      return null;
    }
    current = current[path];
  }

  // Handle theme-specific colors
  if (typeof current === 'object' && (current.light || current.dark)) {
    return current[theme];
  }

  return current;
};

// Utility function to get CSS custom property for a color
export const getCSSVariable = (colorName: string) => {
  const variableMap: Record<string, string> = {
    primary: 'var(--primary)',
    'primary-foreground': 'var(--primary-foreground)',
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    'card-foreground': 'var(--card-foreground)',
    popover: 'var(--popover)',
    'popover-foreground': 'var(--popover-foreground)',
    secondary: 'var(--secondary)',
    'secondary-foreground': 'var(--secondary-foreground)',
    muted: 'var(--muted)',
    'muted-foreground': 'var(--muted-foreground)',
    accent: 'var(--accent)',
    'accent-foreground': 'var(--accent-foreground)',
    destructive: 'var(--destructive)',
    'destructive-foreground': 'var(--destructive-foreground)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
    'text-primary': 'var(--text-primary)',
    'text-secondary': 'var(--text-secondary)',
    'text-tertiary': 'var(--text-tertiary)',
    'text-inverse': 'var(--text-inverse)',
    'background-primary': 'var(--background-primary)',
    'background-secondary': 'var(--background-secondary)',
    'background-tertiary': 'var(--background-tertiary)',
    'background-overlay': 'var(--background-overlay)',
    'hover-primary': 'var(--hover-primary)',
    'hover-secondary': 'var(--hover-secondary)',
  };

  return variableMap[colorName] || colorName;
};

// Export commonly used color combinations
export const commonColors = {
  // Brand colors
  brand: {
    primary: colors.primary[500],
    light: colors.primary[100],
    dark: colors.primary[700],
  },

  // Text colors
  text: {
    primary: colors.light.text.primary,
    secondary: colors.light.text.secondary,
    muted: colors.neutral[500],
  },

  // Background colors
  background: {
    primary: colors.light.background.primary,
    secondary: colors.light.background.secondary,
    muted: colors.neutral[100],
  },

  // Status colors
  status: colors.status,
} as const;
