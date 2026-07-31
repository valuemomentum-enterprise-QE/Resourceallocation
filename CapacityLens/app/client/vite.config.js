import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  plugins: [react()],
  // Suite layout on Pages: https://<org>.github.io/Resourceallocation/capacitylens/
  base: isPages ? "/Resourceallocation/capacitylens/" : "/",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
