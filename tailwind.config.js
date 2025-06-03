/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'timeline-1': '#A56FA6',
        'timeline-2': '#766FA6',
        'timeline-3': '#2A558C',
        'timeline-4': '#42628C',
        primary: {
          100: '#47a6e9',
          200: '#3595d6',
          300: '#2484c4',
          400: '#1272b1',
          500: '#00619e',
        },
        white: '#FFFFFF',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      height: {
        '60vh': '60vh',
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0, 97, 158, 0.15)',
        'hover': '0 8px 24px rgba(0, 97, 158, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
};