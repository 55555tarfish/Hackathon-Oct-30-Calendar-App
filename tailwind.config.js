/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        roboto: ['"Roboto"', 'sans-serif'],
      },
      borderColor: {
        'dark-brown': '#542a18',
      },
      colors: {
        'dark-brown': {
          DEFAULT: '#3b1d11',
          border: '#542a18',
          muted: '#5c2e1b',
          deep: '#2d140b',
        },
        peach: {
          50: '#fff7f2',
          100: '#ffe8db',
          200: '#fed2bd',
          300: '#fcbd9d',
          400: '#f8a176',
          500: '#f1804b',
          600: '#e0652d',
          700: '#be4d1c',
          800: '#5c2e1b',
          900: '#3b1d11',
          950: '#2d0e01',
        },
        brand: {
          50: '#fff7f2',
          100: '#ffe8db',
          200: '#fed2bd',
          300: '#fcbd9d',
          400: '#f8a176',
          500: '#f1804b',
          600: '#e0652d',
          700: '#be4d1c',
          800: '#5c2e1b',
          900: '#3b1d11',
          950: '#2d0e01',
        }
      }
    },
  },
  plugins: [],
}
