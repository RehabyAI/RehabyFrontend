/** @type {import('tailwindcss').Config} */
export default {
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
          600: '#0D9488',
        }
      }
    },
  },
  plugins: [],
}
