/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          500: "#1d4ed8",
          600: "#1e40af",
          700: "#172554",
          900: "#0b1220",
        },
      },
    },
  },
  plugins: [],
};
