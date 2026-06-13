// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  output: 'static',
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
