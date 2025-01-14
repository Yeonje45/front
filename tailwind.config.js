/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
      },
      zIndex: {
        '-1': '-1',
      },
      minHeight: {
        '1/2': '50%',
      },
      gridTemplateColumns: {
        "21": "2fr 1fr",
        "12": "1fr 2fr",
      },
      gridTemplateRows: {
        "21": "2fr 1fr",
        "12": "1fr 2fr",
      }
    },
  },
  plugins: [],
}
