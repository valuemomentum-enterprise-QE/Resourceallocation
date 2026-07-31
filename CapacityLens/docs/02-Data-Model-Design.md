# 2. Data Model Design

**Solution:** CapacityLens  
**Document type:** Logical & Physical Data Design

---

## 2.1 Required Data Sources

| Source | Data Provided | Typical Grain | Refresh |
|--------|---------------|---------------|---------|
| **Azure DevOps** | Work items, estimates, iterations, assignments, area paths | Work item / iteration | 2–4 hrs |
| **Jira** | Issues, story points/hours, sprints, assignees, projects | Issue / sprint | 2–4 hrs |
| **Excel resource plans** | Planned allocations %, initiative demand | Person × project × period | Daily / on change |
| **SharePoint lists** | Operational initiatives, enhancement queues | Item | Daily |
| **Timesheet systems** | Actual hours by project/activity | Person × day × activity | Daily |
| **HR / resource mgmt** | Roster, FTE%, start/end, role, manager, location | Person | Daily |
| **Holiday / PTO calendars** | Org holidays, approved leave | Person × day / org × day | Daily |
| **Power BI / existing datasets** | Legacy metrics for reconciliation | Aggregate | As available |
| **Skills inventory** (HR/Excel) | Skill tags, proficiency | Person × skill | Weekly |
| **Other trackers** | Prod support queues, on-call rotations | Ticket / shift | Daily |

---

## 2.2 Recommended Data Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SOURCE SYSTEMS                                  │
│  ADO │ Jira │ Excel │ SharePoint │ Timesheets │ HR │ PTO │ Skills      │
└───────────────┬─────────────────────────────────────────────────────────┘
                │  ADF / Fabric Dataflows / Power Automate / APIs
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  BRONZE (Raw) — Lakehouse / ADLS                                       │
│  Immutable landed files + source metadata (system, extract_ts, hash)    │
└───────────────┬─────────────────────────────────────────────────────────┘
                │  Cleanse, standardize, dedupe, map IDs
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SILVER (Conformed) — Normalized entities                               │
│  Person, Team, Project, WorkItem, TimeEntry, Leave, Skill, Calendar     │
└───────────────┬─────────────────────────────────────────────────────────┘
                │  Business rules: capacity math, allocation, forecasts
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  GOLD (Analytics Star Schema)                                           │
│  FactCapacityPeriod │ FactAllocation │ FactDemand │ FactActualHours     │
│  FactForecast │ DimDate │ DimPerson │ DimTeam │ DimProject │ DimSkill   │
└───────────────┬─────────────────────────────────────────────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌───────────────┐  ┌─────────────────────┐
│ Semantic Model│  │ Scenario / What-If   │
│ (Power BI)    │  │ Sandbox tables       │
└───────┬───────┘  └─────────────────────┘
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  CONSUMPTION — Power BI Apps (Exec / Portfolio / Manager / Individual)  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Design principles**
- Medallion (Bronze → Silver → Gold) for lineage and reprocessing
- Conformed dimensions across sources (Person Hub, Project Hub)
- Period grain fact tables for sprint / month / quarter reporting
- Separate **baseline** vs **scenario** fact partitions
- Surrogate keys + business keys; soft-delete / effective dating for roster

---

## 2.3 Data Entities and Relationships

### 2.3.1 Core Dimensions

| Entity | Key Attributes | Notes |
|--------|----------------|-------|
| **DimPerson** | PersonKey, EmployeeId, Name, Email, Role, EmploymentType, FtePercent, PrimaryTeamKey, ManagerKey, Location, StartDate, EndDate, IsActive | Hub for all capacity |
| **DimTeam** | TeamKey, TeamName, OrgUnit, CostCenter, LeadPersonKey | Org hierarchy support |
| **DimProject** | ProjectKey, ProjectCode, Name, Portfolio, Priority, Status, DemandCategory | Includes initiatives |
| **DimWorkItem** | WorkItemKey, SourceSystem, ExternalId, Type, Title, EstimateHours, StoryPoints, IterationKey | Optional detail |
| **DimDate** | DateKey, Date, Week, SprintId, Month, Quarter, Year, IsHoliday, IsWorkday | Multi-calendar |
| **DimPeriod** | PeriodKey, PeriodType (Sprint/Month/Quarter), StartDate, EndDate, WorkingDays | Planning buckets |
| **DimSkill** | SkillKey, SkillName, Category, IsCritical | For bottleneck analysis |
| **DimDemandCategory** | CategoryKey, Name (Project, Enhancement, Maintenance, ProdSupport, Operational, Other) | Demand taxonomy |
| **DimScenario** | ScenarioKey, Name, Type, CreatedBy, IsBaseline | What-if versions |

### 2.3.2 Bridge / Relationship Tables

| Entity | Purpose |
|--------|---------|
| **BridgePersonSkill** | Person ↔ Skill with proficiency level |
| **BridgePersonTeam** | Matrix membership / secondary teams with % |
| **MapSourcePerson** | Source system user id → PersonKey |
| **MapSourceProject** | ADO project / Jira project / Excel code → ProjectKey |

### 2.3.3 Fact Tables

| Fact | Grain | Measures / Keys |
|------|-------|-----------------|
| **FactCapacityPeriod** | Person × Period × Scenario | GrossHours, HolidayHours, LeaveHours, TrainingHours, AdminHours, NetAvailableHours |
| **FactAllocation** | Person × Project × Period × Scenario | AllocatedHours, AllocatedPercent |
| **FactDemand** | Project × Period × DemandCategory × Scenario (± Skill) | DemandHours, Confidence, Source |
| **FactActualHours** | Person × Project × Date (or Period) | ActualHours, BillableFlag |
| **FactForecastDemand** | Project/Category × Period × Scenario | ForecastHours, Method, Probability |
| **FactUtilization** *(optional materialized)* | Person × Period × Scenario | Capacity, Allocated, Actual, UtilizationPct, Available |

### 2.3.4 Entity Relationship (Logical)

```
DimTeam 1───* DimPerson *───* DimSkill
                 │
                 │ 1
                 │
                 * FactCapacityPeriod *───1 DimPeriod ───* DimDate
                 │
                 * FactAllocation *───1 DimProject ───1 DimDemandCategory
                 │                      │
                 │                      * FactDemand
                 │
                 * FactActualHours
                 
DimScenario ─── (filters all facts for baseline vs what-if)
```

---

## 2.4 Standardization Rules

| Topic | Rule |
|-------|------|
| Hours vs points | Convert story points → hours via team velocity factor; store both raw and converted |
| Identity | Prefer HR EmployeeId as golden person key; map ADO/Jira accounts |
| Project codes | Maintain enterprise Project Hub; reject unmapped codes to quarantine |
| Period alignment | Sprint dates from ADO/Jira; months/quarters from fiscal calendar |
| Timezone | Normalize to org planning timezone for day boundaries |
| Soft deletes | IsActive=false retained for history; excluded from current capacity |

---

## 2.5 Assumptions and Dependencies

### Assumptions
1. HR roster is authoritative for who is “on capacity.”
2. A person has one primary FTE% and optional matrix splits that sum ≤ 100% of net capacity (configurable).
3. Excel/SharePoint plans can be templated to a controlled schema within Phase 1.
4. Historical timesheets exist for at least 6–12 months for forecast calibration.
5. Leadership defines utilization healthy band and demand confidence tiers (Committed / Likely / Pipeline).

### Dependencies
1. API credentials and throttling limits for ADO/Jira.
2. Timesheet export or API availability.
3. Approved holiday calendars per location.
4. PTO data feed (or manager attestation process if feed delayed).
5. Skills taxonomy ownership (QA CoE / HR).
6. Power BI / Fabric workspace capacity and RLS groups in Entra ID.
7. Change management: managers update allocations in the designated planning tool of record.

### Risks to Data Quality
- Duplicate people across contractors and employee IDs  
- Unestimated backlog treated as zero demand  
- Allocations that don’t match work-item assignments  
- Stale Excel plans after tool migration  

**Mitigation:** quarantine tables, data quality dashboard, weekly steward review (see Roadmap).
