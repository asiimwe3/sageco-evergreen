/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a6b3c",
        secondary: "#f5c842",
        dark: "#111827",
        mtn: "#ffcc00",
        airtel: "#e40000",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        'base': ['1.0625rem', '1.7rem'],
        'lg': ['1.125rem', '1.8rem'],
        'xl': ['1.25rem', '1.9rem'],
      },
    },
  },
  plugins: [],
}
