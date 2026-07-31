/**
 * Exports API payloads as static JSON for GitHub Pages hosting.
 * Run: node src/export-static.js
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildHealth,
  buildMeta,
  buildExecutive,
  buildPortfolio,
  buildTeams,
  buildTeam,
  buildPerson,
  buildScenarios,
  teams,
  people,
} from "./payloads.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../../client/public/api");

function write(relPath, data) {
  const full = join(outDir, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, JSON.stringify(data, null, 2));
  console.log(`wrote api/${relPath}`);
}

mkdirSync(outDir, { recursive: true });
write("health.json", buildHealth("static"));
write("meta.json", buildMeta());
write("executive.json", buildExecutive());
write("portfolio.json", buildPortfolio());
write("teams.json", buildTeams());
write("scenarios.json", buildScenarios());

for (const team of teams) {
  write(`teams/${team.id}.json`, buildTeam(team.id));
}
for (const person of people) {
  write(`people/${person.id}.json`, buildPerson(person.id));
}

console.log(`\nStatic API snapshot ready at ${outDir}`);
