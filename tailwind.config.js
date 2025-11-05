const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Primary color
          light: '#6366F1', // Lighter variant
          dark: '#4338CA', // Darker variant
        },
        secondary: {
          DEFAULT: '#10B981', // Secondary color
          light: '#34D399', // Lighter variant
          dark: '#059669', // Darker variant
        },
      },
    },
  },
  plugins: [],
};