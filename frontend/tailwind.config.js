/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#0F172A",
        "primary-accent": "#10B981",
        "secondary-accent": "#3B82F6",
        "background-main": "#F8FAFC",
        "card-bg": "#FFFFFF",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        "danger": "#EF4444",
        "border-color": "#E2E8F0",
      },
    },
  },
  plugins: [],
}