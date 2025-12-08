/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "navy-dark": "#050E3C",
        navy: "#002455",
        "navy-light": "#003d7a",
        "red-dark": "#DC0000",
        red: "#FF3838",
        "red-light": "#ff5c5c",
      },
    },
  },
  plugins: [],
};
