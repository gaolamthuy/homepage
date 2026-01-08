// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  output: 'static', // Static site generation - tất cả trang sẽ được pre-render
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false, // Đảm bảo CSS được bundle đúng cách
    },
  },
  integrations: [react()],
});
