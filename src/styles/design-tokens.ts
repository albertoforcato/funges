// Design tokens extracted from legacy Fung.es CSS
export const designTokens = {
  colors: {
    // Primary colors (based on old project theme color #3d7e40)
    primary: {
      50: '#f0f9f0',
      100: '#e0f2e0',
      200: '#c4e6c4',
      300: '#9dd69d',
      400: '#6bc26b',
      500: '#3d7e40', // Main theme color from old project
      600: '#2f632f',
      700: '#254d25',
      800: '#1f3f1f',
      900: '#1a351a',
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

    // Text colors for light/dark themes
    text: {
      light: {
        primary: '#1a1a1a',
        secondary: '#404040',
        tertiary: '#6b7280',
        inverse: '#ffffff',
      },
      dark: {
        primary: '#ffffff',
        secondary: '#e5e7eb',
        tertiary: '#d1d5db',
        inverse: '#1a1a1a',
      },
    },

    // Background colors for light/dark themes
    background: {
      light: {
        primary: '#ffffff',
        secondary: 'rgba(255, 252, 239, 0.9)', // White halo color from old project
        tertiary: '#f9fafb',
        overlay: 'rgba(0, 0, 0, 0.8)',
        overlayDark: 'rgba(0, 0, 0, 0.9)',
        overlayFull: 'rgba(0, 0, 0, 1)',
      },
      dark: {
        primary: '#1a1a1a',
        secondary: 'rgba(26, 26, 26, 0.9)',
        tertiary: '#262626',
        overlay: 'rgba(0, 0, 0, 0.8)',
        overlayDark: 'rgba(0, 0, 0, 0.9)',
        overlayFull: 'rgba(0, 0, 0, 1)',
      },
    },

    // Status colors
    status: {
      warning: {
        light: {
          background: '#fff3cd',
          text: '#856404',
          border: '#ffa726',
        },
        dark: {
          background: '#3d2c00',
          text: '#fbbf24',
          border: '#f59e0b',
        },
      },
      success: {
        light: '#3d7e40', // Theme color from manifest
        dark: '#4ade80',
      },
      error: {
        light: '#dc2626',
        dark: '#f87171',
      },
    },

    // Hover colors for light/dark themes
    hover: {
      light: {
        primary: '#f0eada', // Warm hover color from old project
        secondary: '#f3f4f6',
      },
      dark: {
        primary: '#374151',
        secondary: '#4b5563',
      },
    },
  },

  typography: {
    fontFamily: {
      primary: 'Arial, sans-serif',
      system: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      bold: '700',
    },
    lineHeight: {
      tight: '1.1',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '15px',
    xl: '20px',
    '2xl': '40px',
    '3xl': '60px',
  },

  borderRadius: {
    sm: '5px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '2px 0 5px rgba(0, 0, 0, 0.1)',
    lg: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    dark: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '2px 0 5px rgba(0, 0, 0, 0.3)',
      lg: '0 -2px 5px rgba(0, 0, 0, 0.3)',
    },
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
