/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 500ms ease-in both",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "10%, 30%, 50%, 70%": {
            transform: "translateX(-10px)",
          },
          "20%, 40%, 60%": {
            transform: "translateX(10px)",
          },
          "80%": {
            transform: "translateX(8px)",
          },
          "90%": {
            transform: "translateX(-8px)",
          },
        },
      },
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
