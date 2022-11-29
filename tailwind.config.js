/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: {
          DEFAULT: "#23252C",
        },
        brand: {
          DEFAULT: "#e03e5e",
          500: "#e03e5e",
          600: "#c51f4a",
          700: "#aa0036",
          800: "#900024",
          900: "#760013",
          1000: "#5c0000",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
