# 3. Capacity Planning Framework

**Solution:** CapacityLens  
**Document type:** Capacity Calculation & Allocation Methodology

---

## 3.1 Capacity Calculation Approach

Capacity is computed **bottom-up** from people and calendars, then aggregated to team, skill, and org.

### 3.1.1 Gross Capacity

For person \(p\) in period \(t\):

\[
GrossHours_{p,t} = WorkingDays_{p,t} \times StandardHoursPerDay_{p} \times FtePercent_{p}
\]

Where:
- \(WorkingDays_{p,t}\) = weekdays in period for the person’s location calendar (excluding weekends)
- \(StandardHoursPerDay_{p}\) = typically 8 (configurable by region/contract)
- \(FtePercent_{p}\) = 1.0 for full-time, 0.5 for half-time, etc.

### 3.1.2 Deductions (Non-Available Time)

| Deduction | Source | Treatment |
|-----------|--------|-----------|
| Org holidays | Holiday calendar | Subtract full day hours |
| Approved PTO / vacation | Leave system | Subtract approved hours |
| Training / enablement | Plan or timesheet category | Subtract planned or actual |
| Admin / meetings overhead | Policy default or actual | Apply default % or tracked hours |
| Other non-project (recruiting support, audits) | Plan / timesheet | Subtract categorized hours |

\[
NetAvailableHours_{p,t} = GrossHours_{p,t}
 - HolidayHours_{p,t}
 - LeaveHours_{p,t}
 - TrainingHours_{p,t}
 - AdminOverheadHours_{p,t}
 - OtherNonProjectHours_{p,t}
\]

**Admin overhead (default method):**

\[
AdminOverheadHours_{p,t} = (GrossHours_{p,t} - HolidayHours_{p,t} - LeaveHours_{p,t}) \times OverheadRate
\]

Recommended starting `OverheadRate` = **0.10 to 0.15** (10–15%), tuned by team after 2–3 months of actuals.

### 3.1.3 Team / Org Capacity

\[
NetAvailableHours_{team,t} = \sum_{p \in team} NetAvailableHours_{p,t}
\]

For matrixed resources, attribute capacity to teams using `BridgePersonTeam` split percentages.

---

## 3.2 Utilization Formulas

Define two complementary views:

### Planned Utilization (Allocation-based)

\[
PlannedUtilization\%_{p,t} =
\frac{AllocatedHours_{p,t}}{NetAvailableHours_{p,t}} \times 100
\]

### Actual Utilization (Timesheet-based)

\[
ActualUtilization\%_{p,t} =
\frac{ActualProjectHours_{p,t}}{NetAvailableHours_{p,t}} \times 100
\]

### Org / Team Utilization

\[
Utilization\%_{g,t} =
\frac{\sum AllocatedHours_{p,t}}{\sum NetAvailableHours_{p,t}} \times 100
\quad (p \in group\ g)
\]

**Healthy band (recommended default):** 75% – 90% planned utilization.  
- Below 75% → under-utilization / bench risk  
- Above 90% → overload / burnout / delivery risk  
- Above 100% → hard over-allocation (requires immediate action)

---

## 3.3 Demand versus Capacity Methodology

### 3.3.1 Demand Stack

Demand hours by project/category for period \(t\):

| Tier | Definition | Inclusion |
|------|------------|-----------|
| **Committed** | Funded / scheduled work with estimates | Always in baseline demand |
| **Likely** | High-probability enhancements / near-term pipeline | Included in “expected” forecast |
| **Pipeline** | Uncertain future work × win probability | Scenario / upside views |

\[
DemandHours_{t}^{baseline} = \sum Committed + \sum Likely
\]

\[
DemandHours_{t}^{upside} = DemandHours_{t}^{baseline} + \sum (PipelineHours \times Probability)
\]

### 3.3.2 Capacity Gap

\[
CapacityGap_{g,t} = DemandHours_{g,t} - NetAvailableHours_{g,t}
\]

- Gap > 0 → **shortfall** (need hire, overtime, defer scope, or reallocate in)  
- Gap < 0 → **surplus** (bench / available capacity)

\[
Coverage\%_{g,t} =
\frac{NetAvailableHours_{g,t}}{DemandHours_{g,t}} \times 100
\]

### 3.3.3 Matching Logic

1. Aggregate demand by period, team (or skill), and category.  
2. Aggregate net capacity on the same dimensions.  
3. Compare gap; drill to person-level allocation conflicts.  
4. Reconcile **AllocatedHours** (supply commitment) vs **DemandHours** (work need) — they may differ when work is unstaffed.

| Signal | Meaning |
|--------|---------|
| Demand > Capacity | Organizational shortfall |
| Allocated > Capacity | Over-booking of people |
| Demand > Allocated | Unstaffed demand (coverage hole) |
| Allocated > Demand | Over-staffed vs stated need |

---

## 3.4 Handling Vacation, Holidays, Training, Non-Project Activities

| Activity | Capacity Impact | Demand Impact | Notes |
|----------|-----------------|---------------|-------|
| Public holiday | Reduce gross → net | None | Location-specific |
| Vacation / PTO | Reduce net | None | Prefer approved leave feed |
| Sick leave | Reduce net (actuals) | None | May be lagged |
| Training | Reduce net (or tag as investment capacity) | Optional “enablement” demand | Show separately on dashboards |
| Meetings / admin | Overhead rate or actual | None | Don’t double-count if timesheeted |
| Production support retainer | Optionally reserve capacity | Count as demand category | Use capacity reservation pattern |
| On-call | Partial capacity reservation | ProdSupport demand | Configurable hours/week |

**Capacity reservation pattern** (for BAU support):

\[
ReservedSupportHours_{team,t} = PolicyHoursPerFTE \times FTE_{team,t}
\]

Remaining flexible capacity:

\[
FlexibleCapacity_{team,t} = NetAvailableHours_{team,t} - ReservedSupportHours_{team,t}
\]

---

## 3.5 Resource Allocation Logic

### 3.5.1 Allocation Inputs
- Planner-entered % or hours by person × project × period  
- Optional auto-seed from ADO/Jira assignments (estimate ÷ remaining period) — **advisory only** until confirmed  
- Soft bookings (pipeline) vs hard bookings (committed)

### 3.5.2 Validation Rules

1. \(\sum AllocatedHours_{p,t} \le NetAvailableHours_{p,t} \times OverbookThreshold\)  
   - Default soft warn at 100%, hard flag at 110%  
2. Allocation dates must overlap person’s active employment window  
3. Project must be active / in planning status  
4. Skill mismatch warnings when project required skills ∉ person skills  
5. Changes after period lock require manager + planner override reason  

### 3.5.3 Allocation Priority (when demand exceeds capacity)

1. Production support / regulatory / Sev-1 commitments  
2. Committed project milestones in current/next sprint  
3. Funded enhancements  
4. Likely pipeline  
5. Discretionary / low-priority work  

### 3.5.4 Rebalancing Heuristics (Decision Support)

| Condition (sustained ≥ 2 periods) | Suggested Action |
|-----------------------------------|------------------|
| Team utilization > 95% and gap rising | Hire / borrow / defer scope |
| Person utilization > 100% | Immediate reallocation |
| Team utilization < 70% | Cross-train, reallocate out, or reduce bench |
| Critical skill gap > 20% of demand | Targeted hire or upskilling plan |
| Project coverage < 80% | Staffing risk escalation to portfolio |

---

## 3.6 Worked Example

**Person:** Alex (FTE 100%), Sprint = 10 working days, 8 hrs/day  
**Gross** = 10 × 8 × 1.0 = **80 hrs**  
**Leave** = 1 day (8 hrs), **Holiday** = 0, **Overhead 12%** on (80−8) = 8.64 hrs  
**Net available** = 80 − 8 − 8.64 = **63.36 hrs**  

**Allocations:** Project A 40 hrs + Project B 30 hrs = **70 hrs**  
**Planned utilization** = 70 / 63.36 ≈ **110.5%** → over-allocated; flag for manager.

---

## 3.7 Configuration Parameters (Governance-Owned)

| Parameter | Default | Owner |
|-----------|---------|-------|
| StandardHoursPerDay | 8 | HR / Ops |
| OverheadRate | 12% | QA Leadership |
| Healthy utilization min/max | 75% / 90% | QA Leadership |
| Soft / hard overbook thresholds | 100% / 110% | Workforce Planner |
| Demand tiers included in baseline | Committed + Likely | Portfolio |
| Period lock lead time | 2 business days before sprint start | PMO |
