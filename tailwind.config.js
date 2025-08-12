/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f1ff',
          500: '#5B47E0',
          600: '#4936cc',
          700: '#3d2eb3'
        },
        secondary: {
          500: '#8B7FE8',
          600: '#7066d9'
        },
        accent: {
          500: '#FF6B6B',
          600: '#e65555'
        },
        surface: '#FFFFFF',
        background: '#F8F9FB'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out'
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}