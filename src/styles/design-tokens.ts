// Design tokens extracted from legacy Fung.es CSS
export const designTokens = {
  colors: {
    // Primary colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#007BFF',
      600: '#0056b3',
      700: '#004085',
    },
    
    // Neutral colors
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
      primary: '#333',
      secondary: '#444',
      tertiary: '#555',
      inverse: '#fff',
    },
    
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: 'rgba(255, 252, 239, 0.90)', // White halo color
      overlay: 'rgba(0, 0, 0, 0.8)',
      overlayDark: 'rgba(0, 0, 0, 0.9)',
      overlayFull: 'rgba(0, 0, 0, 1)',
    },
    
    // Status colors
    status: {
      warning: {
        background: '#fff3cd',
        text: '#856404',
        border: '#ffa726',
      },
      success: '#3d7e40', // Theme color from manifest
      error: '#dc2626',
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