/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a5c38',
        secondary: '#f5c518',
        dark: '#1a1a1a',
      }
    },
  },
  plugins: [],
}
