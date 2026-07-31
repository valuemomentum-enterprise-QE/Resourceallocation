# Resourceallocation

Enterprise QE suite for **capacity planning** and **EFL scorecards**.

## PulseDeck (launcher)

Open apps on demand: http://localhost:5200

| App | Catchphrase | Port |
|-----|-------------|------|
| **CapacityLens** | See demand. Measure capacity. Plan with confidence. | 5173 |
| **ScorePulse** | Catch the signal. Read the scorecard. | 5175 |

```bash
npm install
npm run install:suite
npm run dev:suite
```

Then open **http://localhost:5200** and click an app tile.

## Packages

- [CapacityLens](./CapacityLens/) — capacity utilization & resource planning (design + demo app)
- [ScorePulse](./ScorePulse/) — interactive EFL May/June Excel scorecards
- [PulseDeck](./PulseDeck/) — navigation hub (loads apps only when clicked)

## ScorePulse data fidelity

Both Excel workbooks share the same 16 worksheets. Extraction keeps every non-empty cell; scorecard metrics are parsed without inventing values. Excel errors (`#DIV/0!`, etc.) are retained.
