/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-orange': '#CE5F44',
        'custom-yellow': '#F9AE53',
        'custom-blue': '#16A1C0',
        'custom-soil': '#FFF6E0',
        'custom-dark': '#333333',
      },
      fontFamily: {
        sans: ["var(--font-josefin)", "sans-serif"], // default body
        heading: ["var(--font-anton)", "sans-serif"], // headings
        poppins : ["Poppins", "sans-serif"],
        montserrat : ["Montserrat", "sans-serif"]
      
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
