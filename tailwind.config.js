/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1d1d1b",
        primary: {
          light: "#ac47f5",
          dark: "#60099f",
          DEFAULT: "#ac47f5",
        },
        secondary: "#fee253",
        orangy: "#ff9f48",
        white: {
          light: "#ffffff",
          DEFAULT: "#ffffff",
          dark: "#181a1b",
        },
      },
    },
  },
  plugins: [],
};
