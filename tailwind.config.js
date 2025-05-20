/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}"
    ]
  },
  theme: {
    extend: {
      colors: {
        primary: '#9370db', // Purple color from the app
        dark: {
          bg: '#121212',     // Dark background
          card: '#1c1c1c',   // Card background
          text: '#ffffff',   // White text
          muted: '#aaaaaa',  // Light gray text
        }
      },
    },
  },
  plugins: [require('nativewind/tailwind/css')],
}

