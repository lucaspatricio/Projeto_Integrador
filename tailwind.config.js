/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8f2",
          100: "#d9efdf",
          500: "#348753",
          600: "#267345",
          700: "#205c39",
          900: "#183a2a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(25, 43, 31, 0.06)",
      },
    },
  },
  plugins: [],
};
