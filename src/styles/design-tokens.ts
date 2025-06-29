// Design tokens extracted from legacy Fung.es CSS
export const designTokens = {
  colors: {
    // Primary colors (based on new OKLCH color palette - oklch(0.5234 0.1347 144.1672))
    primary: {
      50: '#f0f9f4', // Light green background
      100: '#dcf2e3', // Very light green
      200: '#b8e4c7', // Light green
      300: '#94d6ab', // Medium light green
      400: '#70c88f', // Medium green
      500: '#4cba73', // Main theme color - oklch(0.5234 0.1347 144.1672)
      600: '#3d955c', // Darker green
      700: '#2e7045', // Dark green
      800: '#1f4a2e', // Very dark green
      900: '#102517', // Darkest green
    },

    // Neutral colors for light/dark themes
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },

    // Text colors
    text: {
      light: {
        primary: '#1a1a1a', // Dark text for light theme
        secondary: '#525252', // Medium gray text
      },
      dark: {
        primary: '#f5f5f5', // Light text for dark theme
        secondary: '#a3a3a3', // Medium gray text
      },
    },

    // Background colors
    background: {
      light: {
        primary: '#fafafa', // Light background
        secondary: 'rgba(250, 250, 250, 0.9)', // Light background with opacity
        tertiary: '#f5f5f5', // Slightly darker background
      },
      dark: {
        primary: '#171717', // Dark background
        secondary: 'rgba(23, 23, 23, 0.9)', // Dark background with opacity
        tertiary: '#0a0a0a', // Darker background
      },
    },

    // Status colors
    status: {
      success: '#4cba73', // oklch(0.5234 0.1347 144.1672) - primary color
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    // Hover states
    hover: {
      light: {
        primary: '#e5f7ed', // Light green hover
        secondary: '#d1f2e1', // Medium light green hover
      },
      dark: {
        primary: '#1f2937', // Dark hover
        secondary: '#374151', // Medium dark hover
      },
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'Montserrat, sans-serif',
      serif: 'Merriweather, serif',
      mono: 'Source Code Pro, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  layout: {
    sidebarWidth: '80px',
    footerHeight: '40px',
    headerHeight: '50px',
  },

  zIndex: {
    base: '0',
    overlay: '1000',
    splash: '2000',
  },
} as const;

export type DesignTokens = typeof designTokens;
