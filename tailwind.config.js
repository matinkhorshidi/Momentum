// ====================================================================================
// FILE: tailwind.config.js
// This file configures Tailwind CSS with your custom theme colors and fonts.
// ====================================================================================
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-color': '#121212',
        surface: '#1e1e1e',
        'primary-text': '#e0e0e0',
        'secondary-text': '#a0a0a0',
        accent: '#bb86fc',
        error: '#d40027',
        'border-default': '#333',
        'input-bg': '#2c2c2c',
        'input-border': '#444',
        'button-hover': '#a36ef4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.3s ease-out',
      },
      boxShadow: {
        glow: '0 0 12px 2px var(--glow-color)',
      },
    },
  },
  plugins: [],
};
