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
      },
    },
  },
  plugins: [],
};
