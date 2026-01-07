// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  output: 'server', // Enable SSR để có thể đọc URL params tại runtime
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false, // Đảm bảo CSS được bundle đúng cách
    },
  },
  integrations: [react()],
});
