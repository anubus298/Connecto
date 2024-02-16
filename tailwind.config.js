/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1d1d1b",
        primary: "#ac47f5",
        secondary: "#fee253",
        orangy: "#ff9f48",
      },
    },
  },
  plugins: [],
};
