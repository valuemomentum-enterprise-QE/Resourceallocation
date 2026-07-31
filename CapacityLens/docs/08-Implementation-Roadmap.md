# 8. Implementation Roadmap

**Solution:** CapacityLens  
**Document type:** Delivery Plan, Stack, Risk & Governance

---

## 8.1 Phased Implementation Plan

### Phase 0 — Align (2–3 weeks)
**Outcomes**
- Stakeholder map, KPI threshold workshop, source system inventory  
- Agree utilization bands, overhead rate, demand taxonomy  
- Secure access to ADO/Jira/HR/timesheet/PTO  

**Exit criteria:** Signed scope, RACI, success metrics

---

### Phase 1 — Foundation (6–8 weeks)
**Outcomes**
- Lakehouse bronze/silver landing for HR roster, holidays, PTO, one work system (ADO *or* Jira), timesheets  
- DimPerson, DimTeam, DimDate, DimPeriod, FactCapacityPeriod, FactActualHours  
- First Team Manager dashboard (utilization, available capacity, PTO)  
- Data quality quarantine + steward process  

**Exit criteria:** ≥90% roster coverage; daily refresh; manager pilot on 1–2 teams

---

### Phase 2 — Demand & Allocation (6–8 weeks)
**Outcomes**
- Project hub + demand categories  
- Excel/SharePoint allocation template + ingestion  
- FactAllocation, FactDemand; overbook detection  
- Portfolio coverage matrix + Executive scorecard (MVP)  
- RLS by team/org  

**Exit criteria:** Allocations for pilot org; coverage & utilization trusted in monthly review

---

### Phase 3 — Multi-Horizon & Forecast (4–6 weeks)
**Outcomes**
- Sprint + month + quarter grains reconciled  
- Demand forecast (committed/likely/pipeline)  
- Rolling 12-month view  
- Individual “My Capacity” app  
- Alerting subscriptions  

**Exit criteria:** R12 used in quarterly staffing meeting

---

### Phase 4 — Scenarios & Scale (4–6 weeks)
**Outcomes**
- Scenario workspace & playbooks  
- Second work tracker (ADO+Jira if needed)  
- Skills & TLBI / bottleneck analytics  
- Org-wide rollout, training, runbooks  

**Exit criteria:** What-if used for at least one hire/rebalance decision; adoption KPIs met

---

### Phase 5 — Optimize (ongoing)
- Forecast accuracy tuning, automation of allocation seed from work items  
- Cost overlays (optional), contractor optimization  
- Continuous improvement backlog  

```
Phase 0     Phase 1        Phase 2         Phase 3        Phase 4      Phase 5
Align ───► Foundation ───► Demand/Alloc ───► Forecast ───► Scenarios ───► Optimize
 2–3w         6–8w            6–8w            4–6w          4–6w        ongoing
```

**Indicative elapsed time to org-wide MVP:** ~5–7 months depending on data readiness.

---

## 8.2 Recommended Technology Stack

| Layer | Recommended | Alternatives |
|-------|-------------|--------------|
| Orchestration / ETL | Microsoft Fabric Data Factory / Azure Data Factory | Synapse pipelines |
| Storage | Fabric Lakehouse / ADLS Gen2 | Snowflake |
| Transform | Fabric Notebooks / dbt on Fabric | Databricks |
| Semantic model | Power BI / Fabric semantic model | Looker (if multi-cloud std) |
| Dashboards | Power BI Apps + RLS | Tableau |
| Planning input | Standardized Excel/SharePoint lists + Power Apps form | Anaplan (if enterprise FP&A already) |
| What-if | Power BI what-if + scenario tables; optional Planning workbook | Python simulation service |
| Identity / security | Microsoft Entra ID SSO + RLS roles | — |
| Collaboration alerts | Teams + Power Automate | Email only |
| Source connectors | ADO REST, Jira Cloud/DC APIs, HRIS export, timesheet API | Flat-file SFTP |

**Why this stack:** Fits Microsoft-centric QA shops already on ADO + Power BI, minimizes new platforms, supports medallion architecture and governed self-service.

---

## 8.3 Risks and Mitigation Strategies

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Fragmented / poor estimates | Wrong demand → bad staffing | High | Unestimated % KPI; mandatory estimate gates; points→hours calibration |
| Stale Excel plans | Shadow truth | High | Templated intake, freshness alerts, designate system of record |
| Identity mismatches across tools | Broken capacity joins | Medium | Person hub + steward reconciliation weekly |
| Over-complex Phase 1 scope | Delay / distrust | Medium | Pilot 1–2 teams; thin-slice dashboards |
| Gaming utilization | Misleading green | Medium | Pair planned + actual; TLBI; qualitative delivery health |
| PTO feed lag | Overstated capacity | Medium | Manager attestation fallback; conservative default |
| API throttling | Refresh failures | Medium | Incremental sync, backoff, watermarking |
| RLS misconfiguration | Privacy incident | Low–Med | Security review, test personas, break-glass audit |
| Low adoption | Shelfware | Medium | Embed in sprint/month cadences; manager training; exec sponsorship |
| Scenario confusion with baseline | Wrong decisions | Medium | Clear labels, promote workflow, audit log |

---

## 8.4 Adoption and Governance Considerations

### RACI (simplified)

| Decision / Artifact | QA Leadership | Workforce Planner | Team Manager | Data Steward | PMO |
|---------------------|:-------------:|:-----------------:|:------------:|:------------:|:---:|
| Utilization targets | A | R | C | I | C |
| Allocation updates | I | C | R/A | I | C |
| Demand taxonomy | A | C | C | I | R |
| Data quality fixes | I | C | C | R/A | C |
| Scenario promotion | A | R | C | I | C |
| Dashboard release | A | C | C | C | R |

R=Responsible A=Accountable C=Consulted I=Informed

### Operating Cadence
- **Weekly:** Data quality standup (steward + planner)  
- **Sprint:** Capacity commit review (managers)  
- **Monthly:** Utilization & coverage council  
- **Quarterly:** Staffing & scenario workshop (exec)  

### Change Management
- Role-based training (60–90 min) + job aids  
- Champions in each QA tower  
- “Office hours” for first two months post go-live  
- Success stories: hire avoided / burnout prevented with data  

### Data Governance
- KPI glossary as controlled document (see `templates/capacity-kpi-glossary.csv`)  
- Schema changes via change request  
- Retention aligned to HR/PII policy  
- Access reviews quarterly  

### Definition of Done for Adoption
- ≥80% of managers update allocations by monthly cutoff  
- Executive pack generated from CapacityLens (not side spreadsheets)  
- Quarterly hiring decisions reference Forecasted Capacity Gap
