/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f6f7',
          100: '#e1e3e6',
          200: '#c3c7cd',
          300: '#9ea4ad',
          400: '#757d89',
          500: '#5b6470',
          600: '#4a525c',
          700: '#3d444c',
          800: '#34393f',
          900: '#1a1d21',
          950: '#0d0e11',
        },
        accent: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a6ff',
          500: '#3385fc',
          600: '#1b66f0',
          700: '#1451d8',
          800: '#1744af',
          900: '#1a3e8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
