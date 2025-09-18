export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#F0E6D2",
          DEFAULT: "#D4AF37",
          dark: "#AA8C2C",
        },
        blush: {
          light: "#FFE4E1",
          DEFAULT: "#FFC0CB",
          dark: "#E6A0AB",
        },
        luxe: {
          black: "#1A1A1A",
          white: "#FAFAFA",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}