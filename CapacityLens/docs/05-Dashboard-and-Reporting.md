# 5. Dashboard and Reporting Design

**Solution:** CapacityLens  
**Document type:** BI Experience Design

---

## 5.1 Design Principles

1. **One job per page** — Exec health, portfolio coverage, team action, personal plan.  
2. **Exception-first** — Surface red/amber before detailed tables.  
3. **Time travel** — Period slicer always present (Sprint / Month / Quarter / R12).  
4. **Drill with purpose** — KPI → team → person → allocation/work item.  
5. **Scenario toggle** — Baseline vs named what-if on planner/exec pages.  
6. **Trust signals** — Last refresh, data quality score, filter context visible.

---

## 5.2 Global Filters (All Apps)

| Filter | Type | Default |
|--------|------|---------|
| Period type | Sprint / Month / Quarter | Month |
| Period | Relative + absolute | Current + next 2 |
| Org unit / Team | Hierarchical | User’s scope (RLS) |
| Role / Skill | Multi-select | All |
| Employment type | FTE / Contractor | All |
| Demand tier | Committed / Likely / Pipeline | Committed+Likely |
| Scenario | Baseline / What-if | Baseline |
| Location | Multi-select | All |

---

## 5.3 Executive View

**Audience:** QA Leadership, Delivery Heads  
**Purpose:** Org health, structural gaps, staffing posture

### Layout
| Zone | Content |
|------|---------|
| Top KPI row | Utilization %, Bench %, Forecasted Gap (FTE), Over-utilized headcount %, Coverage % |
| Trend | Capacity vs Demand (12–18 months) — dual axis / area + line |
| Heatmap | Team × Month utilization (color banded) |
| Insights | Top 5 bottlenecks (skill/team), Top 5 surplus teams |
| Actions | Hiring pipeline vs gap, attrition watchlist |

### Visual recommendations
- Utilization **scorecards** with target band indicators  
- **Capacity vs demand** trend with confidence bands for forecast  
- Org **heatmap** (team × period)  
- Small multiples for portfolio themes  

### Drill-through
Exec KPI → Portfolio page filtered to red teams → Team Manager view

---

## 5.4 Portfolio View

**Audience:** Portfolio / Program Managers  
**Purpose:** Multi-project allocation, staffing coverage, demand forecast

### Layout
| Zone | Content |
|------|---------|
| Coverage matrix | Project × Period staffing coverage % |
| Allocation matrix | Project × Team allocated hours |
| Demand stack | Committed / Likely / Pipeline by month |
| Risk table | Projects with coverage <80% or critical skill gaps |
| Resource loading | Top over-allocated people impacting portfolio |

### Visual recommendations
- **Heat map** coverage project × period  
- **Stacked area** demand forecast vs capacity envelope  
- **Matrix** (matrix visual / pivot) for allocation  
- Conditional formatting for risk thresholds  

### Drill-through
Project row → project staffing sheet (named resources, skills, gaps)

---

## 5.5 Team Manager View

**Audience:** QA Managers / Leads  
**Purpose:** Sprint & monthly load balancing, unblock overbooking

### Layout
| Zone | Content |
|------|---------|
| Team scorecards | Utilization, Available hrs, TLBI, Overbooked count |
| Resource loading | Person × Period utilization heatmap |
| Allocation breakdown | Stacked bars per person (projects) |
| Sprint capacity board | Net capacity, committed demand, stretch, leftover |
| Exceptions | Double-booked, missing estimates, PTO collisions |
| Skill gap | Team demand vs skill supply |

### Visual recommendations
- **Resource loading** Gantt-style or heatmap  
- **100% stacked** allocation per person  
- Sprint **capacity vs demand** bullet / waterfall  
- Alert cards for >100% allocation  

### Drill-through
Person cell → Individual Resource View  
Exception → work item / allocation record

---

## 5.6 Individual Resource View

**Audience:** Individual contributors + managers (via drill)  
**Purpose:** Transparency of personal plan and upcoming load

### Layout
| Zone | Content |
|------|---------|
| My KPIs | Utilization, Available hrs, Allocation count |
| Calendar / loading | Weekly/sprint load bars |
| Allocation list | Projects, %/hours, dates |
| Non-project | PTO, training, holidays applied |
| Upcoming | Next 6–8 weeks forecast load |

### Visual recommendations
- Simple **load timeline**  
- Allocation **donut** or stacked bar  
- List with links to ADO/Jira work items (where permitted)

### Privacy
- Peers cannot see each other’s detailed pages (RLS)  
- Managers see direct reports; leadership sees aggregates by default

---

## 5.7 Cross-Cutting Visual Catalog

| Visual | Best used for |
|--------|----------------|
| Heat maps | Utilization & coverage intensity |
| Capacity vs demand trends | Forward planning confidence |
| Utilization scorecards | Exec/manager glance |
| Allocation matrices | Multi-project staffing |
| Resource loading views | Individual/team overload |
| Forecast models (area + line) | Pipeline vs capacity |
| Waterfalls | Gross → net → allocated → available |
| Box plots / distributions | Load balancing diagnostics |
| What-if comparison bars | Scenario deltas |

---

## 5.8 Alerts & Subscriptions

| Alert | Trigger | Audience |
|-------|---------|----------|
| Hard over-allocation | Person util >110% current/next sprint | Manager |
| Sustained overload | Team util >90% for ≥2 periods | Manager + Planner |
| Coverage risk | Project coverage <80% next period | Portfolio PM |
| Forecast gap | Gap FTE > threshold next quarter | Exec + Planner |
| Stale plan | Excel/SharePoint plan > X days old | PMO |
| Data quality | Quarantine volume spike | Data steward |

Deliver via Power BI subscriptions, Teams adaptive cards, or email digests.

---

## 5.9 App Packaging

| App | Pages |
|-----|-------|
| CapacityLens Executive | Org Overview, Trends, Decisions |
| CapacityLens Portfolio | Coverage, Demand, Project Staffing |
| CapacityLens Teams | Team Cockpit, Sprint Board, Exceptions |
| CapacityLens MyWork | My Capacity |
| CapacityLens Planning (restricted) | Scenarios, Hiring, Gap Bridge |
