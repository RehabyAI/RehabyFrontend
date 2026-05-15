/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0F172A',
        },
        teal: {
          500: '#14B8A6',
          600: '#0D9488',
        }
      }
    },
  },
  plugins: [],
}
