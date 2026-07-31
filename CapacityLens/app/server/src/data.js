/** Sample QA org capacity dataset for CapacityLens demo */

export const meta = {
  org: "Enterprise QE",
  scenario: "Baseline",
  periodLabel: "Jul 2026",
  refreshedAt: "2026-07-31T06:15:00Z",
  dqScore: 96,
  utilizationBand: { min: 75, max: 90 },
};

export const teams = [
  { id: "payments", name: "Payments QA", lead: "Sam Rivera" },
  { id: "platform", name: "Platform QA", lead: "Jordan Lee" },
  { id: "mobile", name: "Mobile QA", lead: "Priya Shah" },
  { id: "automation", name: "Automation CoE", lead: "Chris Ng" },
];

export const people = [
  { id: "alex", name: "Alex Chen", teamId: "payments", role: "SDET", skills: ["Automation", "API"] },
  { id: "blair", name: "Blair Okonkwo", teamId: "payments", role: "QA Analyst", skills: ["API", "Functional"] },
  { id: "casey", name: "Casey Brooks", teamId: "payments", role: "Senior QA", skills: ["Functional", "Performance"] },
  { id: "drew", name: "Drew Patel", teamId: "payments", role: "QA Analyst", skills: ["Functional"] },
  { id: "eden", name: "Eden Walsh", teamId: "platform", role: "SDET", skills: ["Automation", "API"] },
  { id: "fin", name: "Fin Morales", teamId: "platform", role: "QA Lead", skills: ["API", "Performance"] },
  { id: "gia", name: "Gia Nguyen", teamId: "platform", role: "QA Analyst", skills: ["Functional", "API"] },
  { id: "harper", name: "Harper Singh", teamId: "mobile", role: "Mobile QA", skills: ["Mobile", "Functional"] },
  { id: "indy", name: "Indy Clark", teamId: "mobile", role: "SDET", skills: ["Mobile", "Automation"] },
  { id: "jules", name: "Jules Martin", teamId: "automation", role: "Automation Architect", skills: ["Automation", "Performance"] },
  { id: "kai", name: "Kai Romero", teamId: "automation", role: "SDET", skills: ["Automation", "API"] },
  { id: "lane", name: "Lane Foster", teamId: "automation", role: "SDET", skills: ["Automation"] },
];

export const projects = [
  { id: "proj-a", name: "Payments Rebuild", portfolio: "Digital Banking", priority: "P1" },
  { id: "proj-b", name: "Core API v3", portfolio: "Platform", priority: "P1" },
  { id: "proj-c", name: "Mobile Wallet", portfolio: "Digital Banking", priority: "P2" },
  { id: "support", name: "Prod Support Retainer", portfolio: "BAU", priority: "P0" },
  { id: "enhance", name: "Regression Hardening", portfolio: "Quality", priority: "P2" },
];

/** Person capacity for current month (hours) */
export const capacity = {
  alex: { gross: 176, leave: 8, holiday: 0, overhead: 20, net: 148 },
  blair: { gross: 176, leave: 16, holiday: 0, overhead: 19, net: 141 },
  casey: { gross: 176, leave: 0, holiday: 0, overhead: 21, net: 155 },
  drew: { gross: 176, leave: 24, holiday: 0, overhead: 18, net: 134 },
  eden: { gross: 176, leave: 8, holiday: 0, overhead: 20, net: 148 },
  fin: { gross: 176, leave: 0, holiday: 0, overhead: 21, net: 155 },
  gia: { gross: 176, leave: 8, holiday: 0, overhead: 20, net: 148 },
  harper: { gross: 176, leave: 0, holiday: 0, overhead: 21, net: 155 },
  indy: { gross: 176, leave: 16, holiday: 0, overhead: 19, net: 141 },
  jules: { gross: 176, leave: 8, holiday: 0, overhead: 20, net: 148 },
  kai: { gross: 176, leave: 0, holiday: 0, overhead: 21, net: 155 },
  lane: { gross: 176, leave: 40, holiday: 0, overhead: 16, net: 120 },
};

/** Allocations person → project hours */
export const allocations = [
  { personId: "alex", projectId: "proj-a", hours: 60 },
  { personId: "alex", projectId: "proj-b", hours: 55 },
  { personId: "alex", projectId: "support", hours: 20 },
  { personId: "blair", projectId: "proj-a", hours: 40 },
  { personId: "blair", projectId: "support", hours: 50 },
  { personId: "blair", projectId: "enhance", hours: 20 },
  { personId: "casey", projectId: "proj-a", hours: 110 },
  { personId: "casey", projectId: "proj-b", hours: 50 },
  { personId: "drew", projectId: "proj-b", hours: 45 },
  { personId: "drew", projectId: "support", hours: 30 },
  { personId: "drew", projectId: "enhance", hours: 25 },
  { personId: "eden", projectId: "proj-b", hours: 90 },
  { personId: "eden", projectId: "enhance", hours: 40 },
  { personId: "fin", projectId: "proj-b", hours: 70 },
  { personId: "fin", projectId: "support", hours: 40 },
  { personId: "fin", projectId: "enhance", hours: 30 },
  { personId: "gia", projectId: "proj-b", hours: 55 },
  { personId: "gia", projectId: "proj-a", hours: 40 },
  { personId: "gia", projectId: "support", hours: 25 },
  { personId: "harper", projectId: "proj-c", hours: 100 },
  { personId: "harper", projectId: "support", hours: 30 },
  { personId: "indy", projectId: "proj-c", hours: 95 },
  { personId: "indy", projectId: "enhance", hours: 30 },
  { personId: "jules", projectId: "enhance", hours: 80 },
  { personId: "jules", projectId: "proj-a", hours: 40 },
  { personId: "kai", projectId: "enhance", hours: 70 },
  { personId: "kai", projectId: "proj-b", hours: 60 },
  { personId: "lane", projectId: "enhance", hours: 50 },
  { personId: "lane", projectId: "proj-c", hours: 40 },
];

/** Project demand hours (committed + likely) */
export const demand = [
  { projectId: "proj-a", committed: 280, likely: 40, pipeline: 60 },
  { projectId: "proj-b", committed: 320, likely: 50, pipeline: 80 },
  { projectId: "proj-c", committed: 210, likely: 30, pipeline: 40 },
  { projectId: "support", committed: 195, likely: 0, pipeline: 0 },
  { projectId: "enhance", committed: 260, likely: 45, pipeline: 70 },
];

/** Weekly utilization % by person for heatmap (4 weeks) */
export const weeklyUtil = {
  alex: [95, 110, 88, 92],
  blair: [70, 65, 72, 68],
  casey: [105, 102, 115, 108],
  drew: [60, 55, 58, 62],
  eden: [88, 90, 85, 87],
  fin: [82, 84, 80, 83],
  gia: [78, 81, 79, 76],
  harper: [86, 88, 90, 85],
  indy: [92, 94, 89, 91],
  jules: [84, 86, 88, 85],
  kai: [90, 93, 91, 89],
  lane: [55, 50, 48, 52],
};

/** Rolling capacity vs demand (hours) for org */
export const trend = [
  { month: "Aug 25", capacity: 1680, demand: 1520, forecast: null },
  { month: "Sep 25", capacity: 1700, demand: 1610, forecast: null },
  { month: "Oct 25", capacity: 1650, demand: 1720, forecast: null },
  { month: "Nov 25", capacity: 1720, demand: 1680, forecast: null },
  { month: "Dec 25", capacity: 1400, demand: 1380, forecast: null },
  { month: "Jan 26", capacity: 1750, demand: 1690, forecast: null },
  { month: "Feb 26", capacity: 1680, demand: 1740, forecast: null },
  { month: "Mar 26", capacity: 1720, demand: 1810, forecast: null },
  { month: "Apr 26", capacity: 1700, demand: 1760, forecast: null },
  { month: "May 26", capacity: 1740, demand: 1820, forecast: null },
  { month: "Jun 26", capacity: 1710, demand: 1790, forecast: null },
  { month: "Jul 26", capacity: 1748, demand: 1830, forecast: 1830 },
  { month: "Aug 26", capacity: 1760, demand: null, forecast: 1880 },
  { month: "Sep 26", capacity: 1820, demand: null, forecast: 1950 },
  { month: "Oct 26", capacity: 1840, demand: null, forecast: 1920 },
  { month: "Nov 26", capacity: 1860, demand: null, forecast: 1980 },
  { month: "Dec 26", capacity: 1520, demand: null, forecast: 1600 },
];

export const skillGaps = [
  { skill: "Automation", demand: 420, capacity: 372, gap: -48 },
  { skill: "API Testing", demand: 280, capacity: 292, gap: 12 },
  { skill: "Performance", demand: 160, capacity: 140, gap: -20 },
  { skill: "Mobile", demand: 210, capacity: 296, gap: 86 },
  { skill: "Functional", demand: 350, capacity: 330, gap: -20 },
];

export const exceptions = [
  { id: 1, severity: "red", message: "Casey Brooks over-allocated at 115% in week 3", teamId: "payments", personId: "casey" },
  { id: 2, severity: "red", message: "Payments Rebuild coverage at 78% for next sprint", teamId: "payments", projectId: "proj-a" },
  { id: 3, severity: "amber", message: "4 PBIs unestimated on Core API v3", teamId: "platform", projectId: "proj-b" },
  { id: 4, severity: "amber", message: "Alex Chen PTO collides with Proj A milestone Friday", teamId: "payments", personId: "alex" },
  { id: 5, severity: "amber", message: "Automation skill gap of 48h this month", teamId: "automation" },
  { id: 6, severity: "green", message: "Mobile QA has surplus capacity available to borrow", teamId: "mobile" },
];

export const scenarios = [
  {
    id: "baseline",
    name: "Baseline",
    gapFte: 6.2,
    utilization: 88,
    bench: 11,
    note: "Current committed + likely demand",
  },
  {
    id: "hire-2-sdet",
    name: "Hire 2 SDETs (Sep)",
    gapFte: 2.1,
    utilization: 82,
    bench: 14,
    note: "Adds automation capacity with 3-month ramp",
  },
  {
    id: "demand-25",
    name: "Demand +25% Payments",
    gapFte: 9.8,
    utilization: 96,
    bench: 4,
    note: "Stress test for Payments Rebuild uplift",
  },
  {
    id: "attrition",
    name: "Lose 2 Senior QA (Oct)",
    gapFte: 11.4,
    utilization: 101,
    bench: 2,
    note: "Blast radius on coverage and TLBI",
  },
];
