import { defineConfig } from "vite";

const isPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  // Keep original HTML/CSS/JS intact — no React conversion.
  base: isPages ? "/Resourceallocation/flowboard/" : "/",
  server: { port: 5176 },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
