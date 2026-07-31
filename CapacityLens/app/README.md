# CapacityLens App

Interactive demo of the CapacityLens QA capacity utilization solution.

## Architecture

```
client (Vite + React)  →  http://localhost:5173
        │ proxy /api
        ▼
server (Express API)   →  http://localhost:4000
```

## Run both servers

From this folder:

```bash
npm run install:all
npm run dev
```

Or separately:

```bash
npm run dev:server   # API on :4000
npm run dev:client   # UI on :5173
```

Open **http://localhost:5173**

## Views

| View | What you see |
|------|----------------|
| Executive | Org KPIs, capacity vs demand trend, team util, skill gaps, scenarios |
| Portfolio | Project coverage, demand stack, allocation matrix |
| Team Manager | Heatmap, exceptions, allocation table (drill to person) |
| Individual | Personal capacity, weekly load, project allocations |

Sample data models a 12-person QA org across Payments, Platform, Mobile, and Automation CoE.

## GitHub Pages

Static hosting requirements and setup checklist:

→ **[GITHUB-PAGES-REQUIREMENTS.md](./GITHUB-PAGES-REQUIREMENTS.md)**

Build for Pages locally:

```bash
npm run build:pages
```

Live URL (after Pages is enabled and the workflow succeeds):

https://valuemomentum-enterprise-QE.github.io/Resourceallocation/
