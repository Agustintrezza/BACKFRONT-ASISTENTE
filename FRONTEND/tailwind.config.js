/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ habilita dark mode por clase
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
