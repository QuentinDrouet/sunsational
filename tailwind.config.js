/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0B0A13',
        'primary': '#141a2f',
        'secondary': '#23294b',
        'accent': '#9140fa',
        'text': '#C8CBDF',
      }
    },
  },
  plugins: [],
}

