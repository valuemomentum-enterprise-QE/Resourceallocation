import express from "express";
import cors from "cors";
import {
  meta,
  teams,
  people,
  projects,
  capacity,
  allocations,
  demand,
  weeklyUtil,
  trend,
  skillGaps,
  exceptions,
  scenarios,
} from "./data.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function allocatedHours(personId) {
  return allocations
    .filter((a) => a.personId === personId)
    .reduce((s, a) => s + a.hours, 0);
}

function personMetrics(person) {
  const net = capacity[person.id].net;
  const allocated = allocatedHours(person.id);
  const util = Math.round((allocated / net) * 1000) / 10;
  const available = Math.max(0, net - allocated);
  return {
    ...person,
    teamName: teams.find((t) => t.id === person.teamId)?.name,
    capacity: capacity[person.id],
    allocated,
    available,
    utilization: util,
    status: util > 100 ? "over" : util > 90 ? "high" : util < 75 ? "under" : "healthy",
    weekly: weeklyUtil[person.id],
    allocations: allocations
      .filter((a) => a.personId === person.id)
      .map((a) => ({
        ...a,
        projectName: projects.find((p) => p.id === a.projectId)?.name,
        pct: Math.round((a.hours / net) * 1000) / 10,
      })),
  };
}

function teamMetrics(team) {
  const members = people.filter((p) => p.teamId === team.id).map(personMetrics);
  const net = members.reduce((s, m) => s + m.capacity.net, 0);
  const allocated = members.reduce((s, m) => s + m.allocated, 0);
  const util = net ? Math.round((allocated / net) * 1000) / 10 : 0;
  const mean = members.reduce((s, m) => s + m.utilization, 0) / (members.length || 1);
  const variance =
    members.reduce((s, m) => s + (m.utilization - mean) ** 2, 0) / (members.length || 1);
  const stdev = Math.sqrt(variance);
  const tlbi = mean ? Math.round((1 - stdev / mean) * 100) / 100 : 0;
  const overbooked = members.filter((m) => m.utilization > 100).length;
  const available = Math.max(0, net - allocated);
  const bench = net ? Math.round((available / net) * 1000) / 10 : 0;
  return {
    ...team,
    memberCount: members.length,
    net,
    allocated,
    available,
    utilization: util,
    tlbi,
    overbooked,
    bench,
    members,
  };
}

function projectMetrics(project) {
  const d = demand.find((x) => x.projectId === project.id);
  const allocated = allocations
    .filter((a) => a.projectId === project.id)
    .reduce((s, a) => s + a.hours, 0);
  const demandHours = (d?.committed || 0) + (d?.likely || 0);
  const coverage = demandHours
    ? Math.round((allocated / demandHours) * 1000) / 10
    : 0;
  return {
    ...project,
    committed: d?.committed || 0,
    likely: d?.likely || 0,
    pipeline: d?.pipeline || 0,
    demandHours,
    allocated,
    coverage,
    unstaffed: Math.max(0, demandHours - allocated),
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "CapacityLens API", port: PORT });
});

app.get("/api/meta", (_req, res) => {
  res.json(meta);
});

app.get("/api/executive", (_req, res) => {
  const teamStats = teams.map(teamMetrics);
  const allPeople = people.map(personMetrics);
  const net = allPeople.reduce((s, p) => s + p.capacity.net, 0);
  const allocated = allPeople.reduce((s, p) => s + p.allocated, 0);
  const available = Math.max(0, net - allocated);
  const utilization = Math.round((allocated / net) * 1000) / 10;
  const bench = Math.round((available / net) * 1000) / 10;
  const overUtilPeople = allPeople.filter((p) => p.utilization > 90).length;
  const underUtilPeople = allPeople.filter((p) => p.utilization < 75).length;
  const projectStats = projects.map(projectMetrics);
  const avgCoverage =
    Math.round(
      (projectStats.reduce((s, p) => s + p.coverage, 0) / projectStats.length) * 10
    ) / 10;
  const totalDemand = projectStats.reduce((s, p) => s + p.demandHours, 0);
  const gapHours = totalDemand - net;
  const gapFte = Math.round((gapHours / 148) * 10) / 10;

  res.json({
    meta,
    kpis: {
      utilization,
      bench,
      available,
      gapFte,
      coverage: avgCoverage,
      overUtilPct: Math.round((overUtilPeople / allPeople.length) * 1000) / 10,
      underUtilPct: Math.round((underUtilPeople / allPeople.length) * 1000) / 10,
      headcount: allPeople.length,
    },
    teams: teamStats.map(({ members, ...t }) => t),
    trend,
    skillGaps,
    exceptions: exceptions.slice(0, 5),
    scenarios,
  });
});

app.get("/api/portfolio", (_req, res) => {
  res.json({
    meta,
    projects: projects.map(projectMetrics),
    teams: teams.map((t) => {
      const tm = teamMetrics(t);
      const { members, ...rest } = tm;
      return rest;
    }),
    allocationMatrix: teams.map((team) => {
      const row = { teamId: team.id, teamName: team.name };
      for (const project of projects) {
        const hours = allocations
          .filter(
            (a) =>
              a.projectId === project.id &&
              people.find((p) => p.id === a.personId)?.teamId === team.id
          )
          .reduce((s, a) => s + a.hours, 0);
        row[project.id] = hours;
      }
      return row;
    }),
    demandStack: projects.map(projectMetrics),
  });
});

app.get("/api/teams", (_req, res) => {
  res.json({ meta, teams: teams.map(teamMetrics) });
});

app.get("/api/teams/:teamId", (req, res) => {
  const team = teams.find((t) => t.id === req.params.teamId);
  if (!team) return res.status(404).json({ error: "Team not found" });
  const metrics = teamMetrics(team);
  const teamExceptions = exceptions.filter((e) => e.teamId === team.id);
  const teamSkills = skillGaps; // demo: org-level skills shown in team context
  res.json({
    meta,
    team: metrics,
    exceptions: teamExceptions,
    skillGaps: teamSkills,
    weeks: ["W1", "W2", "W3", "W4"],
  });
});

app.get("/api/people/:personId", (req, res) => {
  const person = people.find((p) => p.id === req.params.personId);
  if (!person) return res.status(404).json({ error: "Person not found" });
  res.json({ meta, person: personMetrics(person) });
});

app.get("/api/scenarios", (_req, res) => {
  res.json({ meta, scenarios });
});

app.listen(PORT, () => {
  console.log(`CapacityLens API running at http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
