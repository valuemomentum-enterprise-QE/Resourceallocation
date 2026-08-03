# Resourceallocation

Enterprise QE suite for **capacity planning**, **EFL scorecards**, and **delivery productivity**.

## Live site (GitHub Pages)

**Open this URL:** https://valuemomentum-enterprise-QE.github.io/Resourceallocation/

| Page | Link |
|------|------|
| PulseDeck (home) | https://valuemomentum-enterprise-QE.github.io/Resourceallocation/ |
| CapacityLens | https://valuemomentum-enterprise-QE.github.io/Resourceallocation/capacitylens/ |
| ScorePulse | https://valuemomentum-enterprise-QE.github.io/Resourceallocation/scorepulse/ |
| Flowboard | https://valuemomentum-enterprise-QE.github.io/Resourceallocation/flowboard/ |

> Note: this is a **github.io** site, not the github.com repository page.

## PulseDeck (local launcher)

Open apps on demand: http://localhost:5200

| App | Catchphrase | Port |
|-----|-------------|------|
| **CapacityLens** | See demand. Measure capacity. Plan with confidence. | 5173 |
| **ScorePulse** | Catch the signal. Read the scorecard. | 5175 |
| **Flowboard** | Where capacity went. What delivery produced. | 5176 |

```bash
npm install
npm run install:suite
npm run dev:suite
```

Then open **http://localhost:5200** and click an app tile.

## Packages

- [CapacityLens](./CapacityLens/) — capacity utilization & resource planning
- [ScorePulse](./ScorePulse/) — interactive EFL May/June Excel scorecards
- [Flowboard](./Flowboard/) — QE delivery & productivity report (vanilla HTML, preserved)
- [PulseDeck](./PulseDeck/) — navigation hub (loads apps only when clicked)
