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

function allocatedHours(personId) {
  return allocations
    .filter((a) => a.personId === personId)
    .reduce((s, a) => s + a.hours, 0);
}

export function personMetrics(person) {
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

export function teamMetrics(team) {
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

export function projectMetrics(project) {
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

export function buildHealth(mode = "live") {
  return { ok: true, service: "CapacityLens API", mode };
}

export function buildMeta() {
  return meta;
}

export function buildExecutive() {
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

  return {
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
  };
}

export function buildPortfolio() {
  return {
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
  };
}

export function buildTeams() {
  return { meta, teams: teams.map(teamMetrics) };
}

export function buildTeam(teamId) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;
  return {
    meta,
    team: teamMetrics(team),
    exceptions: exceptions.filter((e) => e.teamId === team.id),
    skillGaps,
    weeks: ["W1", "W2", "W3", "W4"],
  };
}

export function buildPerson(personId) {
  const person = people.find((p) => p.id === personId);
  if (!person) return null;
  return { meta, person: personMetrics(person) };
}

export function buildScenarios() {
  return { meta, scenarios };
}

export { teams, people };
