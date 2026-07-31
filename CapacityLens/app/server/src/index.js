import express from "express";
import cors from "cors";
import {
  buildHealth,
  buildMeta,
  buildExecutive,
  buildPortfolio,
  buildTeams,
  buildTeam,
  buildPerson,
  buildScenarios,
} from "./payloads.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ...buildHealth(), port: PORT });
});

app.get("/api/meta", (_req, res) => {
  res.json(buildMeta());
});

app.get("/api/executive", (_req, res) => {
  res.json(buildExecutive());
});

app.get("/api/portfolio", (_req, res) => {
  res.json(buildPortfolio());
});

app.get("/api/teams", (_req, res) => {
  res.json(buildTeams());
});

app.get("/api/teams/:teamId", (req, res) => {
  const payload = buildTeam(req.params.teamId);
  if (!payload) return res.status(404).json({ error: "Team not found" });
  res.json(payload);
});

app.get("/api/people/:personId", (req, res) => {
  const payload = buildPerson(req.params.personId);
  if (!payload) return res.status(404).json({ error: "Person not found" });
  res.json(payload);
});

app.get("/api/scenarios", (_req, res) => {
  res.json(buildScenarios());
});

app.listen(PORT, () => {
  console.log(`CapacityLens API running at http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
