/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}", // Ensures subfolders and React/Vue files are scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

