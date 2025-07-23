/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class", // Cho phép chuyển dark mode bằng class
  theme: {
    extend: {
      colors: {
        // Light theme colors (amber-based)
        primary: {
          DEFAULT: "#f59e0b", // amber-500
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Dark theme colors (slate-based)
        dark: {
          DEFAULT: "#334155", // slate-700
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Background colors
        background: {
          DEFAULT: "#ffffff",
          secondary: "#f8fafc",
          dark: "#0f172a",
          "dark-secondary": "#1e293b",
        },
        // Text colors
        foreground: {
          DEFAULT: "#0f172a",
          secondary: "#64748b",
          dark: "#f8fafc",
          "dark-secondary": "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["Nunito", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
