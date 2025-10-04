// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false, // Đảm bảo CSS được bundle đúng cách
    },
  },
  integrations: [react()],
});
