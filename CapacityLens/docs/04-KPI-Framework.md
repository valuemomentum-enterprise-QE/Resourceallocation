# 4. KPI Framework

**Solution:** CapacityLens  
**Document type:** KPI Definitions & Formulas

All KPIs are computable at **Individual, Team, Skill, Portfolio, and Org** grains unless noted. Default time grains: Sprint, Month, Quarter, Rolling 12 Months.

---

## 4.1 KPI Dictionary

### 4.1.1 Capacity Utilization %

| Field | Detail |
|-------|--------|
| **Definition** | Share of net available capacity consumed by allocated (planned) or actual project work |
| **Formula (Planned)** | \( \frac{AllocatedHours}{NetAvailableHours} \times 100 \) |
| **Formula (Actual)** | \( \frac{ActualProjectHours}{NetAvailableHours} \times 100 \) |
| **Target band** | 75% – 90% |
| **Interpretation** | Mid-band = healthy load; persistent >90% = delivery/burnout risk; <75% = idle/bench risk |
| **Visual** | KPI card + bullet chart vs target band |

---

### 4.1.2 Allocation %

| Field | Detail |
|-------|--------|
| **Definition** | How a person’s (or team’s) net capacity is distributed across projects/categories |
| **Formula** | \( Allocation\%_{p,j,t} = \frac{AllocatedHours_{p,j,t}}{NetAvailableHours_{p,t}} \times 100 \) |
| **Check** | \( \sum_j Allocation\%_{p,j,t} \) should approximate Planned Utilization % |
| **Interpretation** | Reveals concentration risk (e.g., 80% on one project) and fragmentation |
| **Visual** | 100% stacked bar / allocation matrix |

---

### 4.1.3 Available Capacity

| Field | Detail |
|-------|--------|
| **Definition** | Remaining hours that can still accept work |
| **Formula** | \( AvailableHours = \max(0,\ NetAvailableHours - AllocatedHours) \) |
| **Optional** | Also show negative as “deficit hours” when over-allocated |
| **Interpretation** | Primary signal for intake of new work or borrowing capacity |
| **Visual** | Waterfall (Gross → deductions → allocated → available) |

---

### 4.1.4 Over-Utilization %

| Field | Detail |
|-------|--------|
| **Definition** | Magnitude of load above the healthy maximum (or above 100% capacity) |
| **Formula (vs band)** | If \( Util > UtilMax \): \( \frac{Util - UtilMax}{UtilMax} \times 100 \); else 0 |
| **Formula (hard)** | If \( Allocated > Net \): \( \frac{Allocated - Net}{Net} \times 100 \) |
| **Headcount view** | \( \%\ of\ people\ with\ Util > UtilMax \) |
| **Interpretation** | Sustained over-utilization drives reallocation, scope deferral, or hiring |
| **Visual** | Red zone on heatmap; trend of over-utilized headcount |

---

### 4.1.5 Under-Utilization %

| Field | Detail |
|-------|--------|
| **Definition** | Magnitude of load below the healthy minimum |
| **Formula (vs band)** | If \( Util < UtilMin \): \( \frac{UtilMin - Util}{UtilMin} \times 100 \); else 0 |
| **Headcount view** | \( \%\ of\ people\ with\ Util < UtilMin \) |
| **Interpretation** | Signals bench, onboarding ramp, or demand shortfall |
| **Visual** | Blue/cool zone on heatmap; bench trend |

---

### 4.1.6 Resource Demand Forecast

| Field | Detail |
|-------|--------|
| **Definition** | Expected future demand hours by period, category, team/skill |
| **Formula** | \( ForecastDemand_t = Committed_t + Likely_t + \sum (Pipeline_{i,t} \times Prob_i) \) |
| **Methods** | Backlog burn-up, historical run-rate, weighted pipeline, manager override |
| **Accuracy KPI** | MAPE / bias of forecast vs actual demand (trailing 3–6 periods) |
| **Visual** | Area chart: capacity line vs stacked demand tiers |

---

### 4.1.7 Team Load Balancing Index (TLBI)

| Field | Detail |
|-------|--------|
| **Definition** | How evenly utilization is distributed across team members (lower dispersion = better balance) |
| **Formula** | \( TLBI = 1 - \frac{\sigma(Util_{p})}{\mu(Util_{p})} \) for active people \(p\) in team (coefficient of variation inverted) |
| **Alternate** | Gini coefficient of allocated hours (report as imbalance score) |
| **Range** | TLBI near 1 = well balanced; near 0 or negative = highly skewed |
| **Interpretation** | High average util + low TLBI = hidden burnout on a few people |
| **Visual** | Team scorecard + distribution box plot |

---

### 4.1.8 Project Staffing Coverage

| Field | Detail |
|-------|--------|
| **Definition** | How much of project demand is covered by allocated capacity |
| **Formula** | \( Coverage\%_{j,t} = \frac{AllocatedHours_{j,t}}{DemandHours_{j,t}} \times 100 \) |
| **Target** | ≥ 95% for committed work in current/next period; ≥ 80% for +1 quarter |
| **Interpretation** | <80% = staffing risk; >110% may indicate overstaffing or inflated allocation |
| **Visual** | Coverage matrix project × period |

---

### 4.1.9 Forecasted Capacity Gap

| Field | Detail |
|-------|--------|
| **Definition** | Forward difference between forecast demand and net capacity |
| **Formula** | \( Gap_{g,t} = ForecastDemand_{g,t} - NetAvailableHours_{g,t} \) |
| **FTE expression** | \( GapFTE_{g,t} = Gap_{g,t} / HoursPerFTE_{t} \) |
| **Interpretation** | Positive gap = shortfall FTEs to hire/borrow; negative = surplus/bench |
| **Visual** | Gap bars by month + cumulative gap |

---

### 4.1.10 Resource Bench Percentage

| Field | Detail |
|-------|--------|
| **Definition** | Share of net capacity that is unallocated (or below under-utilization threshold) |
| **Formula (hours)** | \( Bench\% = \frac{AvailableHours}{NetAvailableHours} \times 100 \) |
| **Formula (headcount)** | \( \frac{Count(people\ with\ Util < UtilMin)}{Count(active\ people)} \times 100 \) |
| **Target** | Typically 5–15% strategic bench depending on demand volatility |
| **Interpretation** | Too low = no surge capacity; too high = cost inefficiency |
| **Visual** | Trend line with target band |

---

## 4.2 Supporting / Operational KPIs

| KPI | Formula / Notes |
|-----|-----------------|
| Plan vs Actual hours variance | \( (Actual - Allocated) / Allocated \) |
| Estimate quality | \( Actual / OriginalEstimate \) for completed work |
| Unestimated demand % | Demand items without hours / total demand items |
| Data freshness lag | Hours since last successful source refresh |
| Overbooked people count | Count where Allocated > Net × 1.0 |
| Critical skill gap hours | Demand − Capacity for skills marked critical |
| Contractor mix % | Contractor net hours / total net hours |

---

## 4.3 KPI Target Summary

| KPI | Green | Amber | Red |
|-----|-------|-------|-----|
| Capacity Utilization % | 75–90 | 70–75 or 90–100 | <70 or >100 |
| Available Capacity | Meets intake needs | Tight (<5% bench) | Negative / none |
| Over-Utilization % (people) | <10% of team | 10–20% | >20% |
| Under-Utilization % (people) | <15% | 15–25% | >25% |
| Project Staffing Coverage | ≥95% | 80–95% | <80% |
| Forecasted Capacity Gap | ≤0 or planned hire | Small shortfall <5% | ≥5% FTE shortfall |
| Resource Bench % | 5–15% | 15–25% or 3–5% | >25% or <3% |
| Team Load Balancing Index | ≥0.75 | 0.60–0.75 | <0.60 |

*Thresholds are starting defaults — calibrate with QA leadership in Phase 0.*

---

## 4.4 Calculation Notes

1. Always use **NetAvailableHours** as denominator for utilization — never gross without documenting the choice.  
2. Exclude people with `NetAvailableHours = 0` (full-month leave) from utilization averages or weight carefully.  
3. Report **Planned** and **Actual** utilization as sibling metrics; do not blend without labeling.  
4. Scenario KPIs use the same formulas against `DimScenario` filtered facts.
