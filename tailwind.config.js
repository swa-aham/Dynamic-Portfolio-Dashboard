// tailwind.config.js
module.exports = {
    darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        positive: "var(--row-positive)",
        negative: "var(--row-negative)",
      },
    },
  },
  plugins: [],
};
