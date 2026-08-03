/**
 * Builds the full suite for GitHub Pages:
 *   /Resourceallocation/                 → PulseDeck
 *   /Resourceallocation/capacitylens/    → CapacityLens (static API)
 *   /Resourceallocation/scorepulse/      → ScorePulse
 *   /Resourceallocation/flowboard/       → Flowboard (vanilla HTML report)
 */
import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist-pages");

function run(cmd, cwd, env = {}) {
  console.log(`\n> (${cwd}) ${cmd}`);
  execSync(cmd, {
    cwd: join(root, cwd),
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: true,
  });
}

function ensureIndex(dir) {
  const index = join(dir, "index.html");
  if (!existsSync(index)) {
    throw new Error(`Missing ${index}`);
  }
  copyFileSync(index, join(dir, "404.html"));
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const pagesEnv = {
  GITHUB_PAGES: "true",
  VITE_PAGES: "true",
  VITE_STATIC_API: "true",
};

function writeEnv(relDir) {
  const file = join(root, relDir, ".env.production");
  writeFileSync(file, "VITE_PAGES=true\nVITE_STATIC_API=true\n", "utf8");
  console.log(`wrote ${relDir}/.env.production`);
}

writeEnv("CapacityLens/app/client");
writeEnv("ScorePulse/client");
writeEnv("PulseDeck");
writeEnv("Flowboard");

run("npm run export-static", "CapacityLens/app", pagesEnv);
run("npm run build --prefix client", "CapacityLens/app", pagesEnv);
run("node scripts/prepare-pages.js", "CapacityLens/app", pagesEnv);

run("npm run build", "ScorePulse/client", pagesEnv);
run("npm run build", "Flowboard", pagesEnv);
run("npm run build", "PulseDeck", pagesEnv);

cpSync(join(root, "PulseDeck", "dist"), out, { recursive: true });
mkdirSync(join(out, "capacitylens"), { recursive: true });
mkdirSync(join(out, "scorepulse"), { recursive: true });
mkdirSync(join(out, "flowboard"), { recursive: true });
cpSync(join(root, "CapacityLens", "app", "client", "dist"), join(out, "capacitylens"), {
  recursive: true,
});
cpSync(join(root, "ScorePulse", "client", "dist"), join(out, "scorepulse"), { recursive: true });
cpSync(join(root, "Flowboard", "dist"), join(out, "flowboard"), { recursive: true });

ensureIndex(out);
ensureIndex(join(out, "capacitylens"));
ensureIndex(join(out, "scorepulse"));
ensureIndex(join(out, "flowboard"));

writeFileSync(join(out, ".nojekyll"), "", "utf8");

console.log(`\nGitHub Pages suite ready at ${out}`);
console.log("  /                     PulseDeck");
console.log("  /capacitylens/        CapacityLens");
console.log("  /scorepulse/          ScorePulse");
console.log("  /flowboard/           Flowboard");
