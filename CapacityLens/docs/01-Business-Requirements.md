# 1. Business Requirements

**Solution:** CapacityLens — QA Capacity Utilization & Resource Planning  
**Document type:** Business Requirements Specification

---

## 1.1 Problem Statement

The QA organization lacks a consolidated, forward-looking view of **resource capacity versus work demand**. Demand originates from projects, enhancements, maintenance, production support, and operational initiatives, and fluctuates across sprints, months, and quarters. Data is fragmented across Azure DevOps, Jira, Excel plans, SharePoint, timesheets, HR systems, and Power BI datasets — preventing reliable utilization, bottleneck, and staffing decisions.

---

## 1.2 Goals and Success Criteria

| Goal | Success Criteria |
|------|------------------|
| Single source of truth for capacity vs demand | ≥95% of billable/QA FTEs represented in the model within 90 days of go-live |
| Forward visibility | Sprint, monthly, quarterly, and rolling 12-month views available |
| Actionable staffing signals | Sustained over/under-utilization flags drive hire / reallocate / bench decisions |
| Planning accuracy | Forecast error (MAPE) for demand hours improves quarter-over-quarter |
| Adoption | Managers use CapacityLens in sprint & monthly planning cadences |

---

## 1.3 Functional Requirements

### FR-01: Capacity Inventory
- Maintain a master roster of QA resources with role, skill tags, team, location, employment type (FTE/contractor), manager, and availability %.
- Support part-time, shared, and matrixed allocations.

### FR-02: Demand Capture
- Ingest estimated/planned effort from projects, enhancements, maintenance, production support, and other operational work.
- Map work items (ADO/Jira) and planned initiatives (Excel/SharePoint) to standardized demand categories and time buckets.

### FR-03: Actual Effort Capture
- Ingest timesheet / tracked hours for actuals vs plan comparison.
- Support work-item-linked and non-linked time entries.

### FR-04: Calendar & Non-Project Time
- Apply organization holidays, individual vacation/PTO, training, admin, meetings, and other non-project time as capacity deductions.
- Allow configurable default % for untracked overhead (e.g., 10–15% meetings/admin).

### FR-05: Allocation Engine
- Allocate resources to projects/initiatives with start/end dates and % or hours per period.
- Detect double-booking and over-allocation at individual and team levels.

### FR-06: Utilization & Gap Analytics
- Compute capacity, allocated demand, available capacity, utilization %, over/under-utilization for any grain (person, team, skill, project, period).
- Surface bottlenecks by skill, role, and team.

### FR-07: Multi-Horizon Planning
- Support sprint, monthly, quarterly, and rolling 12-month horizons with consistent formulas.

### FR-08: Forecasting
- Project future demand from committed backlog, pipeline probability, historical run-rate, and manual overrides.
- Produce capacity gap forecasts by period, team, and skill.

### FR-09: Scenario Planning
- What-if simulation for demand uplift, hiring, attrition, project delay, and cross-team rebalancing without changing production baselines.

### FR-10: Dashboards & Alerts
- Role-based interactive dashboards (Executive, Portfolio, Team Manager, Individual).
- Configurable alerts for sustained over/under-utilization, coverage gaps, and forecasted capacity shortfalls.

### FR-11: Drill-Through & Audit
- Drill from summary KPIs to person → allocation → work item / demand record.
- Retain lineage of source system, load timestamp, and planner overrides.

### FR-12: Staffing Decision Support
- Recommend actions based on sustained trends: onboard, reallocate, cross-skill, or reduce bench — with supporting evidence windows (e.g., 6–8 weeks).

### FR-13: Data Quality Management
- Flag missing estimates, orphan allocations, inactive resources with demand, and stale plans.

### FR-14: Security & Access
- Row-level security by org unit / team; individual self-view; leadership aggregate view.

---

## 1.4 Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Executive dashboard loads ≤5 seconds for standard filters; team view ≤3 seconds |
| NFR-02 | Freshness | Operational data refresh ≥ daily; critical timesheet/ADO sync ≤ every 4 hours preferred |
| NFR-03 | Scalability | Support 200–2,000+ QA resources and 5+ years of history without redesign |
| NFR-04 | Availability | BI layer ≥99.5% business-hours availability |
| NFR-05 | Accuracy | Capacity and allocation totals reconcile to source within ±2% after data quality gates |
| NFR-06 | Security | SSO (Entra ID), RLS, least-privilege roles, encrypted at rest/in transit |
| NFR-07 | Auditability | All overrides and scenario versions logged with user, timestamp, reason |
| NFR-08 | Usability | Managers complete monthly capacity review in ≤20 minutes using guided views |
| NFR-09 | Extensibility | New source systems addable via connector + mapping without model rewrite |
| NFR-10 | Compliance | Align with enterprise data retention and PII handling policies |
| NFR-11 | Maintainability | Documented star schema, KPI glossary, and naming standards |
| NFR-12 | Localization | Support multi-timezone capacity calendars and regional holiday sets |

---

## 1.5 Stakeholder Groups and Reporting Needs

| Stakeholder | Primary Needs | Key Views / Cadence |
|-------------|---------------|---------------------|
| **QA Leadership / Delivery Head** | Org utilization health, capacity gaps, hire/bench decisions, trend vs targets | Executive scorecard; weekly/monthly |
| **Portfolio / Program Managers** | Cross-project allocation, coverage risk, demand forecast by initiative | Portfolio heatmap & staffing coverage; sprint/month |
| **QA Team Managers / Leads** | Team load, individual overbooking, sprint capacity, skill gaps | Team manager cockpit; every sprint |
| **Resource / Workforce Planners** | Bench %, forecasted gap, hiring scenarios, attrition impact | Planning & scenario workspace; monthly/quarterly |
| **PMO / BA** | Plan vs actual, data quality, process compliance | Governance & quality reports; weekly |
| **Individual Contributors** | Personal allocation, upcoming load, PTO impact | My Capacity view; continuous |
| **Finance / Ops (optional)** | Costed capacity, contractor mix, FTE efficiency | Cost & productivity overlays; monthly |

### Reporting Need Matrix (Summary)

| Need | Exec | Portfolio | Manager | Planner | Individual |
|------|:----:|:---------:|:-------:|:-------:|:----------:|
| Capacity utilization % | ● | ● | ● | ● | ○ |
| Available capacity | ● | ● | ● | ● | ● |
| Bottlenecks / constraints | ● | ● | ● | ● | ○ |
| Demand forecast | ● | ● | ○ | ● | ○ |
| Multi-project allocation | ○ | ● | ● | ● | ● |
| Staffing decisions | ● | ○ | ○ | ● | ○ |
| Sprint planning support | ○ | ○ | ● | ○ | ● |
| Scenario / what-if | ● | ○ | ○ | ● | ○ |

● = primary consumer ○ = secondary / optional

---

## 1.6 In-Scope / Out-of-Scope

**In scope**
- QA resource capacity, allocation, utilization, demand forecasting, scenario planning, and related BI
- Multi-source ingestion and standardized capacity math
- Role-based dashboards and planning horizons

**Out of scope (initial phases)**
- Full enterprise HRIS replacement or payroll
- Automated work assignment / ticket routing engines
- Non-QA workforce (unless later extended using the same model)
- Real-time minute-level tracking

---

## 1.7 Assumptions (Business)

1. Resources have a primary team and optional matrix allocations.
2. Standard workday/week is defined by HR policy (e.g., 8 hrs/day, 40 hrs/week) with regional variants.
3. Demand estimates exist or can be derived for planned work; unestimated work is flagged, not silently ignored.
4. Leadership agrees on utilization target bands (e.g., healthy 75–90%).
5. Source system owners grant API/export access for scheduled refresh.
