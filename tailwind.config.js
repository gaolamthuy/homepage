/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=pastel]"],
          primary: "#F97316", // orange-500
          secondary: "#FDBA74", // orange-300
          accent: "#FFEDD5", // orange-100
          neutral: "#F8F9FA",
          "base-100": "#FFFFFF",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#F97316",
          secondary: "#FDBA74",
          accent: "#FFEDD5",
          "base-100": "#1E1E1E", // nền tối hơn, dễ nhìn
          "base-content": "#F5F5F5", // chữ sáng hơn
          neutral: "#2B2B2B", // các block hay shadow dùng màu này
        },
      },
    ],
  },
};
