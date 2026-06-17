/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF4E6',
          100: '#FCE7EA',
          500: '#B11226',
          600: '#951020',
          700: '#7A0B19'
        },
        cream: '#FFF4E6',
        ink: '#191113',
        coal: '#09090B'
      }
    }
  },
  plugins: []
};
