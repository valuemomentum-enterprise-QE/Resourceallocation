import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  plugins: [react()],
  // Repo GitHub Pages URL: https://<org>.github.io/Resourceallocation/
  base: isPages ? "/Resourceallocation/" : "/",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
