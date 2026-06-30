// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
export default defineConfig({
  site: "https://gaolamthuy.vn",
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
    },
    server: {
      allowedHosts: [
        '90c62df8d938.ngrok-free.app',
      ],
    },
  },
});
