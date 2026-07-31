# CapacityLens

**See demand. Measure capacity. Plan with confidence.**

CapacityLens is a comprehensive **Capacity Utilization and Resource Planning** solution design for QA organizations that need a consolidated, forward-looking view of resource capacity versus work demand.

---

## What Problem Does This Solve?

QA workload arrives from projects, enhancements, maintenance, production support, and operational initiatives — across Azure DevOps, Jira, Excel plans, SharePoint, timesheets, and HR systems. Without a unified model, leaders cannot reliably answer:

- Are we underutilized, fully loaded, or overloaded?
- Where is free capacity over the next sprint, month, or quarter?
- Which skills or teams are bottlenecks?
- Should we hire, reallocate, cross-skill, or reduce bench?

CapacityLens defines the **business requirements, data model, capacity math, KPIs, dashboards, forecasting, and implementation roadmap** to close that gap.

---

## Live demo app

Interactive dashboards (Executive / Portfolio / Team / Individual):

```bash
cd CapacityLens/app
npm run install:all
npm run dev
```

- UI: http://localhost:5173  
- API: http://localhost:4000/api/health  

See [app/README.md](app/README.md).

### GitHub Pages

Suite hosting (PulseDeck + CapacityLens + ScorePulse):  
[app/GITHUB-PAGES-REQUIREMENTS.md](app/GITHUB-PAGES-REQUIREMENTS.md)

- Home: https://valuemomentum-enterprise-QE.github.io/Resourceallocation/
- CapacityLens: https://valuemomentum-enterprise-QE.github.io/Resourceallocation/capacitylens/
- ScorePulse: https://valuemomentum-enterprise-QE.github.io/Resourceallocation/scorepulse/

## Folder Structure

```
CapacityLens/
├── README.md                          ← You are here
├── SOLUTION-DESIGN.md                 ← Master solution design (sections 1–9)
├── app/                               ← Runnable demo (Express API + React UI)
├── docs/
│   ├── 01-Business-Requirements.md
│   ├── 02-Data-Model-Design.md
│   ├── 03-Capacity-Planning-Framework.md
│   ├── 04-KPI-Framework.md
│   ├── 05-Dashboard-and-Reporting.md
│   ├── 06-Planning-Horizons.md
│   ├── 07-Forecasting-and-Scenario-Planning.md
│   ├── 08-Implementation-Roadmap.md
│   └── 09-Sample-Dashboard-Wireframes.md
├── diagrams/
│   └── architecture-overview.md       ← Mermaid architecture & entity diagrams
└── templates/
    └── capacity-kpi-glossary.csv      ← KPI dictionary for BI teams
```

---

## Quick Navigation

| Section | Document |
|---------|----------|
| 1. Business Requirements | [docs/01-Business-Requirements.md](docs/01-Business-Requirements.md) |
| 2. Data Model Design | [docs/02-Data-Model-Design.md](docs/02-Data-Model-Design.md) |
| 3. Capacity Planning Framework | [docs/03-Capacity-Planning-Framework.md](docs/03-Capacity-Planning-Framework.md) |
| 4. KPI Framework | [docs/04-KPI-Framework.md](docs/04-KPI-Framework.md) |
| 5. Dashboard & Reporting | [docs/05-Dashboard-and-Reporting.md](docs/05-Dashboard-and-Reporting.md) |
| 6. Planning Horizons | [docs/06-Planning-Horizons.md](docs/06-Planning-Horizons.md) |
| 7. Forecasting & Scenarios | [docs/07-Forecasting-and-Scenario-Planning.md](docs/07-Forecasting-and-Scenario-Planning.md) |
| 8. Implementation Roadmap | [docs/08-Implementation-Roadmap.md](docs/08-Implementation-Roadmap.md) |
| 9. Sample Dashboard Layout | [docs/09-Sample-Dashboard-Wireframes.md](docs/09-Sample-Dashboard-Wireframes.md) |
| Master Design | [SOLUTION-DESIGN.md](SOLUTION-DESIGN.md) |

---

## Recommended Stack (Summary)

| Layer | Recommendation |
|-------|----------------|
| Ingestion | Azure Data Factory / Fabric Dataflows, Power Automate |
| Storage | Azure Data Lake / Fabric Lakehouse + curated star schema |
| Semantic model | Power BI / Microsoft Fabric semantic model |
| Visualization | Power BI (Exec, Portfolio, Team, Individual apps) |
| What-if | Power BI what-if parameters + Excel / Planning workbook |
| Source systems | Azure DevOps, Jira, Timesheets, HR, SharePoint, Excel |

---

## Audience

- QA Leadership / Delivery Heads  
- Portfolio & Program Managers  
- QA Team Managers / Leads  
- Resource / Workforce Planners  
- PMO / Business Analysts  
- Individual Contributors (self-service utilization view)

---

## Version

| Field | Value |
|-------|-------|
| Solution name | CapacityLens |
| Version | 1.0 |
| Status | Solution Design |
| Domain | QA Resource Planning & Workforce Analytics |
