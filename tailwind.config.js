/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.stories.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
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

        // CSS Variables for dynamic theming
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },

        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          overlay: 'var(--background-overlay)',
          overlayDark: 'var(--background-overlay-dark)',
          overlayFull: 'var(--background-overlay-full)',
        },

        hover: {
          primary: 'var(--hover-primary)',
          secondary: 'var(--hover-secondary)',
        },

        // Status colors
        status: {
          warning: {
            background: 'var(--status-warning-background)',
            text: 'var(--status-warning-text)',
            border: 'var(--status-warning-border)',
          },
          success: 'var(--status-success)',
          error: 'var(--status-error)',
        },
      },

      fontFamily: {
        primary: ['Arial', 'sans-serif'],
        system: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
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

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },

      width: {
        sidebar: '80px',
      },

      height: {
        footer: '40px',
        header: '50px',
      },

      zIndex: {
        base: '0',
        overlay: '1000',
        splash: '2000',
      },
    },
  },
  plugins: [],
};
