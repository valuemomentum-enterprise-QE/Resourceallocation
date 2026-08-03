# Flowboard

**Where capacity went. What delivery produced.**

QE delivery and productivity report for ERIE Life and Annuity — capacity bridge, impediments, throughput trends, and method notes.

## Why this is not a React rewrite

The source is a complete vanilla HTML app (`class`, inline scripts, `innerHTML` charts, `REPORT_DATA`). Converting to React would require rewriting event wiring and risk visual/behavior drift. Flowboard serves the **same HTML** via Vite so PulseDeck can open it like CapacityLens and ScorePulse.

## Run

```bash
cd Flowboard
npm install
npm run dev
```

http://localhost:5176

Or open from **PulseDeck** (http://localhost:5200) → Flowboard tile.
