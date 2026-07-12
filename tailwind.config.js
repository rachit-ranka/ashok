/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './blog/*.html', './aiocd/*.html'],
  theme: {
    extend: {
      colors: {
        brand: '#1F3C88',
        'brand-hover': '#2E5BFF',
        cyan: '#00B4D8',
        pink: '#FF4D8D',
        dark: '#1F2937',
        medium: '#6B7280',
        'light-grey': '#F5F7FA',
        'soft-grey': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
