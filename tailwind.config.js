/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.stories.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We'll add custom colors here later when we extract design tokens
      },
      fontFamily: {
        // We'll add custom fonts here later
      },
      spacing: {
        // We'll add custom spacing here later
      },
    },
  },
  plugins: [],
} 