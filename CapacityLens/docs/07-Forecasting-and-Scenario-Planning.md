# 7. Forecasting and Scenario Planning

**Solution:** CapacityLens  
**Document type:** Forecasting & What-If Design

---

## 7.1 Forecasting Approach

CapacityLens separates **baseline forecast** (operational truth) from **scenarios** (sandboxed assumptions).

### 7.1.1 Demand Forecast Drivers

| Driver | Method | Horizon fit |
|--------|--------|-------------|
| Committed backlog | Sum remaining estimates by target period | Sprint–Quarter |
| Historical run-rate | Trailing 3/6-month average by category × seasonality | Month–R12 |
| Weighted pipeline | \( Hours \times Probability \) | Quarter–R12 |
| Manager overlay | Explicit adjustments with reason codes | All |
| Velocity-based | Points scheduled × hrs/point | Sprint–Month |

### 7.1.2 Capacity Forecast Drivers

| Driver | Method |
|--------|--------|
| Roster continuity | Active people × future calendars |
| Known PTO | Approved leave in future periods |
| Approved hires | Start date × ramp profile (e.g., 50%/75%/100% over 3 months) |
| Known attrition | End date removes capacity |
| Contractor end dates | Auto-drop unless renewal flag set |

### 7.1.3 Forecast Quality

Track **MAPE**, **bias**, and **coverage of forecast vs actual** by team monthly. Retire methods that systematically over/under-predict.

---

## 7.2 Scenario Planning Workspace

### Mechanics
1. Clone baseline facts into `DimScenario` + scenario fact rows.  
2. Apply parameter changes (UI what-if or planning workbook).  
3. Recompute KPIs with identical formulas.  
4. Compare Scenario vs Baseline deltas.  
5. Promote approved scenario actions to operational plans (controlled workflow).

### Parameters (examples)

| Parameter | Control |
|-----------|---------|
| Demand uplift % by portfolio/project | Slider / input |
| New hire count, role, skill, start month, ramp | Table |
| Attrition count or named exits + dates | Table |
| Project delay (shift demand N periods) | Project × weeks |
| Rebalance move hours team A → team B | Allocation transfer grid |
| Overhead rate / utilization targets | Config |

---

## 7.3 Scenario Playbooks

### 7.3.1 Simulate Increased Project Demand

**Question:** If Project X demand rises 25% next quarter, what breaks?

**Steps**
1. Select scenario “Demand +25% — Project X”.  
2. Scale `FactDemand` / forecast for Project X by 1.25 for Q+1.  
3. Observe Gap FTE, coverage %, team heatmap, critical skills.  
4. Optionally auto-suggest hours to pull from bench teams.

**Outputs:** Gap FTE, newly red projects/teams, recommended borrow list.

---

### 7.3.2 Evaluate Hiring Scenarios

**Question:** Do 2 SDET hires in September close the automation gap?

**Steps**
1. Add candidate capacity with start date and ramp curve.  
2. Tag skill = Test Automation.  
3. Recompute skill-level gap and team utilization.  
4. Compare cost proxy (optional) vs residual gap.

**Outputs:** Before/after gap bridge; month when gap turns ≤0; bench impact.

---

### 7.3.3 Assess Impact of Resource Attrition

**Question:** If two senior QA leave in October, what is the blast radius?

**Steps**
1. Mark persons inactive from attrition date (scenario only).  
2. Redistribute their allocations as **unstaffed demand** (do not silently delete demand).  
3. Highlight projects losing coverage and skills lost.

**Outputs:** Coverage drop by project; over-util cascade on remaining staff; hire urgency.

---

### 7.3.4 Model Project Delays

**Question:** If Release R slips 4 weeks, how does capacity relieve or collide?

**Steps**
1. Shift Project R demand hours by +4 weeks.  
2. Detect new collisions with already committed peaks.  
3. Quantify freed capacity in original window and overload in new window.

**Outputs:** Period-by-period delta heatmap; conflict list.

---

### 7.3.5 Rebalance Resources Across Teams

**Question:** Can Team A’s 15% bench absorb Team B’s shortfall?

**Steps**
1. Identify transferable skills (BridgePersonSkill).  
2. Move N hours or % allocation from A surplus people to B projects.  
3. Recalculate TLBI, utilization, and coverage for both teams.  
4. Flag training lag if proficiency below required level (apply capacity derate, e.g., 70% effective for 4 weeks).

**Outputs:** Dual-team comparison; residual gap; transition plan.

---

## 7.4 Decision Matrix (Scenario → Action)

| Scenario outcome | Prefer |
|------------------|--------|
| Short-lived spike (<1 period) | Overtime / borrow / defer low priority |
| Multi-period shortfall, critical skill | Hire or managed service |
| Surplus ≥2 periods | Reallocate, cross-skill, reduce contractors |
| Coverage hole on committed work | Escalate portfolio prioritization |
| High util + low TLBI | Rebalance internally before hiring |

---

## 7.5 Governance for Scenarios

- Naming: `YYYYMMDD_Author_Purpose`  
- Max active draft scenarios per planner (e.g., 10)  
- Monthly purge of abandoned drafts  
- Only **Workforce Planner + QA Leadership** can promote to baseline  
- Every promotion requires linked action items (hire ticket, allocation change, scope deferral)
