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

        // CSS Variables for dynamic theming
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
        },

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Status colors
        success: '#4cba73', // oklch(0.5234 0.1347 144.1672) - primary color
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },

      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Source Code Pro', 'monospace'],
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
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
