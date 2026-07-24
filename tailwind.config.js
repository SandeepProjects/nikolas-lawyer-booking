/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)"
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-display)"]
      }
    }
  },
  plugins: []
};
