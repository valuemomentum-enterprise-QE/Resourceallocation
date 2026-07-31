# 9. Sample Dashboard Layout (Wireframe-Style)

**Solution:** CapacityLens  
**Document type:** UX Wireframe Specification  
**Primary page illustrated:** Team Manager Cockpit (most operationally dense)  
**Also outlined:** Executive, Portfolio, Individual

---

## 9.1 Team Manager Cockpit — Detailed Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CapacityLens │ Team Manager                          [Scenario: Baseline ▾]  │
│ Sprint ▾  |  Period: 2026-S14 ▾  |  Team: Payments QA ▾  |  Skill: All ▾   │
│ Last refresh: 2026-07-31 06:15  |  DQ Score: 96%  |  [? Help] [Export]     │
├──────────────────────────────────────────────────────────────────────────────┤
│ SCORECARDS                                                                   │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Utilization│ │ Available  │ │ Overbooked │ │ TLBI       │ │ Bench %    │ │
│ │   92%  ▲   │ │  48 hrs    │ │  3 people  │ │  0.68  ▼   │ │   8%       │ │
│ │ band 75-90 │ │            │ │            │ │            │ │            │ │
│ │ [AMBER]    │ │            │ │ [RED]      │ │ [AMBER]    │ │ [GREEN]    │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
├──────────────────────────────────────────────┬───────────────────────────────┤
│ RESOURCE LOADING HEATMAP (Person × Week)     │ CAPACITY vs DEMAND (Sprint)   │
│        W1    W2    W3                        │      Net Cap ████████  420h   │
│ Alex   95    110   88                        │   Committed  ███████   380h   │
│ Blair  70     65   72                        │      Likely  ██         60h   │
│ Casey 105    102  115                        │   Available  ░░         40h*  │
│ Drew   60     55   58                        │  *after committed only        │
│ (color: green 75-90 | amber | red >100)      │  [Waterfall drill]            │
│ Click cell → Individual view                 │                               │
├──────────────────────────────────────────────┼───────────────────────────────┤
│ ALLOCATION MATRIX (Person × Project)         │ EXCEPTIONS                    │
│         ProjA  ProjB  Support  Train         │ ● Casey over 115% W3          │
│ Alex     40%    45%     5%      0%           │ ● ProjA coverage 78%          │
│ Blair    20%    10%    40%     10%           │ ● 4 PBIs unestimated          │
│ Casey    70%    40%     0%      0%  ← warn   │ ● PTO collision: Alex Fri     │
│ Drew      0%    30%    20%     15%           │                               │
│ stacked bar alternate toggle                 │ [Ack] [Create action]         │
├──────────────────────────────────────────────┴───────────────────────────────┤
│ SKILL SUPPLY vs DEMAND (horizontal bar)                                      │
│ Automation   Demand ████████  Cap ██████   Gap -48h                          │
│ API Testing  Demand ████      Cap █████    Surplus +12h                      │
│ Performance  Demand ██        Cap █        Gap -20h                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ FOOTER ACTIONS: [Rebalance wizard] [Open sprint board] [Submit monthly lock] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### UX Flow — Team Manager
1. Lands on current sprint for their team (RLS).  
2. Scans scorecards → sees Overbooked = 3 (red).  
3. Inspects heatmap → Casey W3 dark red → clicks cell.  
4. Drills to **Individual Resource View** (Casey) with allocations.  
5. Returns; opens exception “ProjA coverage 78%” → Portfolio project sheet.  
6. Uses **Rebalance wizard** to shift 10% from Casey to Drew on ProjA.  
7. Toggles scenario “Hire 1 SDET Sep” to preview quarter impact (read-only from here).  

### Drill-down Paths
| From | To |
|------|----|
| Utilization scorecard | Person utilization table |
| Heatmap cell | Individual view |
| Allocation matrix cell | Allocation detail + linked work items |
| Exception row | Source record / project coverage |
| Skill gap bar | People with skill + eligible borrow list |

---

## 9.2 Executive View — Wireframe Outline

```
┌─────────────────────────────────────────────────────────────┐
│ EXECUTIVE OVERVIEW     Period: Month ▾  Next 12 ▾  Org: QA │
├─────────────────────────────────────────────────────────────┤
│ [Util 86%] [Bench 11%] [Gap +6.2 FTE] [Coverage 91%]        │
├──────────────────────────────┬──────────────────────────────┤
│ Capacity vs Demand (R12)     │ Utilization Heatmap          │
│ line=capacity, area=demand   │ Team × Month                 │
├──────────────────────────────┼──────────────────────────────┤
│ Bottlenecks (skills)         │ Decisions / Watchlist        │
│ ranked gap FTE               │ hires, attrition, deferrals  │
└──────────────────────────────┴──────────────────────────────┘
```

**Drill:** Gap KPI → teams contributing to gap → Team Cockpit.

---

## 9.3 Portfolio View — Wireframe Outline

```
┌─────────────────────────────────────────────────────────────┐
│ PORTFOLIO STAFFING     Tier: Committed+Likely  Quarter: Q3  │
├─────────────────────────────────────────────────────────────┤
│ Coverage Heatmap: Project × Month (green≥95 … red<80)       │
├──────────────────────────────┬──────────────────────────────┤
│ Demand stack by category     │ Unstaffed demand table       │
├──────────────────────────────┼──────────────────────────────┤
│ Allocation matrix Team×Proj  │ People at risk (overbook)    │
└──────────────────────────────┴──────────────────────────────┘
```

**Drill:** Project cell → named roster, skill fit, coverage timeline.

---

## 9.4 Individual Resource View — Wireframe Outline

```
┌─────────────────────────────────────────────────────────────┐
│ MY CAPACITY — Alex Chen          Sprint 14 | Manager: Sam   │
├─────────────────────────────────────────────────────────────┤
│ [Util 91%] [Available 6h] [Projects 3] [PTO 1d this sprint] │
├──────────────────────────────┬──────────────────────────────┤
│ Weekly load bars             │ Allocation list (hrs / %)    │
│ (target band guide)          │ ProjA, ProjB, Support        │
├──────────────────────────────┼──────────────────────────────┤
│ Calendar deductions          │ Upcoming 8-week forecast     │
│ holidays / PTO / training    │                              │
└──────────────────────────────┴──────────────────────────────┘
```

**UX notes:** Read-mostly for ICs; “Request plan change” deep-links to manager. No peer comparison charts.

---

## 9.5 Interaction Patterns

| Pattern | Behavior |
|---------|----------|
| Cross-filter | Clicking any visual filters siblings on page |
| Tooltips | Hours + % + band status |
| Right-click drillthrough | Pass Person/Project/Period filters |
| Bookmark | “Sprint planning” / “Monthly review” saved views |
| Export | Summaries to PPT/PDF for steering committees |
| Mobile | Scorecards + exceptions only (manager phone check) |

---

## 9.6 Accessibility & Trust

- Colorblind-safe palette (not red/green only — use icons + labels)  
- Always show **filter context** and **refresh timestamp**  
- Empty states explain missing data vs true zero capacity  
- Loading skeletons for visuals >1s  

---

## 9.7 Page Map (IA)

```
CapacityLens Apps
├── Executive
│   ├── Org Overview
│   ├── R12 Forecast
│   └── Decision Watchlist
├── Portfolio
│   ├── Coverage Matrix
│   ├── Demand Forecast
│   └── Project Staffing Detail
├── Teams
│   ├── Team Cockpit          ← detailed wireframe above
│   ├── Sprint Board
│   └── Exceptions
├── MyWork
│   └── My Capacity
└── Planning (restricted)
    ├── Scenario Compare
    ├── Hiring Bridge
    └── Gap Explorer
```
