# ScorePulse

**Catch the signal. Read the scorecard.**

Interactive visualization of the VM **EFL Executive Scorecards** (May & June Excel workbooks).

## What it does

- Unifies both Excel files on a **common 16-worksheet model** (identical sheet set)
- Preserves **every non-empty cell** in a worksheet explorer (no invented values)
- Parses the **Scorecard** sheet into RAG snapshot tiles, trends, and May vs June compare
- Surfaces Financial / Delivery / Quality metric series with thresholds and remarks

## Common ground (May + June)

Both workbooks share:

Instructions, Scorecard, Financial, Quality, Sprints, Formulas, Team Sprints Input, VAM Team Sprint-CostperSprint, Team Median Input, FTPR, Backlog, EAC Notes, Discussion Points, Monthly Burn Variance Reasons, Risks_Decisions_Improvements, Prod Leakage Details

## Run

```bash
cd ScorePulse/client
npm install
npm run dev
```

Open http://localhost:5175

Or use **PulseDeck** launcher at http://localhost:5200

## Data

- Source Excel: `source-data/`
- Extracted JSON: `data/scorepulse-data.json` (also copied to `client/public/data/`)
- Re-extract: `python CapacityLens/_excel_probe/extract_scorepulse.py`
