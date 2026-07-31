/**
 * Post-build helper for GitHub Pages SPA routing.
 * Copies index.html → 404.html so deep links fall back to the app shell.
 */
import { copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "client", "dist");
const index = join(dist, "index.html");
const fallback = join(dist, "404.html");

if (!existsSync(index)) {
  console.error("Missing client/dist/index.html — run the Vite build first.");
  process.exit(1);
}

copyFileSync(index, fallback);
console.log("Prepared GitHub Pages artifacts: index.html + 404.html");
