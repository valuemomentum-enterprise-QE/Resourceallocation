# 6. Planning Horizons

**Solution:** CapacityLens  
**Document type:** Multi-Horizon Planning Guide

CapacityLens uses **one capacity engine** and **multiple period grains**. Users change horizon via `PeriodType` without changing KPI definitions.

---

## 6.1 Horizon Overview

| Horizon | Period grain | Primary users | Decision focus | Data emphasis |
|---------|--------------|---------------|----------------|---------------|
| Sprint | Iteration (1–3 weeks) | Team managers, ICs | Commit vs capacity, overbooking | ADO/Jira estimates, PTO, hard allocations |
| Monthly | Calendar/fiscal month | Managers, portfolio | Load balance, intake, coverage | Allocations, BAU retainers, leave |
| Quarterly | Fiscal quarter | Exec, planners | Hiring, cross-skill, portfolio shifts | Demand tiers, forecast gap |
| Rolling 12-month | Month buckets × 12 | Exec, workforce | Structural capacity strategy | Pipeline, attrition, hiring plan |

```
◀────────── Tactical ──────────▶◀──────── Strategic ────────▶
 Sprint          Month           Quarter        Rolling 12M
 Commit work     Balance load    Staff plans    Shape workforce
```

---

## 6.2 Sprint Planning

### Objectives
- Confirm team **net capacity** after PTO/holidays/overhead  
- Fit sprint committed demand into capacity  
- Prevent individual over-allocation before sprint start  

### Process
1. Lock holiday/PTO deductions (T−2 days).  
2. Publish net available hours by person.  
3. Import sprint backlog estimates (hours or points→hours).  
4. Compare demand vs capacity; flag >90% and >100%.  
5. Rebalance stories or borrow capacity.  
6. Snapshot baseline for plan-vs-actual at sprint end.

### Views
- Team Manager → Sprint capacity board  
- Individual → My sprint load  

### Guardrails
- Do not plan above hard overbook threshold without documented exception  
- Unestimated PBIs counted as risk, not zero  

---

## 6.3 Monthly Planning

### Objectives
- Smooth multi-sprint volatility into a managerial control cycle  
- Align project allocations % with monthly demand  
- Update BAU/support reservations  

### Process
1. Roll sprint actuals into prior month variance review.  
2. Refresh allocations for current + next 2 months.  
3. Recompute utilization, bench, coverage.  
4. Decide intake freeze / surge / reallocation.  
5. Feed amber/red teams into quarterly staffing agenda.

### Views
- Team heatmap (person × week/month)  
- Portfolio coverage matrix (month)  

---

## 6.4 Quarterly Planning

### Objectives
- Resolve **forecasted capacity gaps** with hire/reallocate/defer decisions  
- Align skill supply to roadmap themes  
- Set utilization and bench targets for the quarter  

### Process
1. Build quarterly demand stack (Committed + Likely + weighted Pipeline).  
2. Overlay known attrition and approved hires.  
3. Produce Gap FTE by team/skill.  
4. Run scenarios (see section 7).  
5. Lock staffing actions and owners.  
6. Cascade targets into monthly allocation templates.

### Views
- Executive trends + gap bridge  
- Planning workspace scenarios  

---

## 6.5 Rolling 12-Month Forecasting

### Objectives
- Continuous forward view that always shows **next 12 months**  
- Detect structural under/over capacity early  
- Support annual budgeting and contractor strategy  

### Methodology
- Month 0–3: high-confidence (committed + detailed allocations)  
- Month 4–6: medium (likely demand + draft allocations)  
- Month 7–12: directional (pipeline × probability + run-rate)  
- Apply seasonality factors from prior-year actuals where stable  
- Refresh monthly; version snapshots each month-end  

### Outputs
- R12 capacity vs demand chart  
- Cumulative gap FTE  
- Bench trajectory  
- Hiring plan vs gap waterfall  

---

## 6.6 Horizon Consistency Rules

1. **Summing:** Sprint hours within a month must reconcile to monthly facts (±2% after quality gates).  
2. **FTE conversion:** Always use period-specific `HoursPerFTE` (working days vary).  
3. **Locks:** Sprint allocations lock at start; monthly plans soft-lock at month-end snapshot.  
4. **Overrides:** Manager overrides tagged with horizon (Sprint/Month/Quarter) for audit.  

---

## 6.7 Cadence Calendar (Recommended)

| Cadence | Activity |
|---------|----------|
| Daily | Data refresh; overbook alerts |
| Twice weekly | Sprint load check (in-sprint) |
| Sprint boundary | Capacity lock + commit review |
| Monthly | Allocation refresh + variance review |
| Quarterly | Gap/hiring/scenario workshop |
| Monthly (ongoing) | Roll R12 forecast forward |
