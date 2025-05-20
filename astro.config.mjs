// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    server: {
      allowedHosts: ["7582-116-108-18-237.ngrok-free.app"],
    },
  },
});
