/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      colors: {
        astra: {
          black: "#000000",
          white: "#F2F2F2",
          grey: "#8A8A8A",
        },
      },
      screens: {
        xs: "475px",
      },
    },
  },
}
