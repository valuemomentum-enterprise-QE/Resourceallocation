# PulseDeck

Launcher for ValueMomentum QE analytics apps.

Apps open **only when clicked** (iframe mounts on demand).

| App | Port | Purpose |
|-----|------|---------|
| PulseDeck | 5200 | Home / navigation |
| CapacityLens | 5173 | Capacity vs demand |
| ScorePulse | 5175 | EFL Excel scorecards |

## Run everything

From repo root:

```bash
npm run install:suite
npm run dev:suite
```

Then open http://localhost:5200
