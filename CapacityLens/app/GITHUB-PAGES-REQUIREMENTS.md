# GitHub Pages Hosting — PulseDeck Suite

**Status:** Suite deployment via GitHub Actions  
**Home URL:** https://valuemomentum-enterprise-QE.github.io/Resourceallocation/

| Path | App |
|------|-----|
| `/Resourceallocation/` | **PulseDeck** |
| `/Resourceallocation/capacitylens/` | **CapacityLens** |
| `/Resourceallocation/scorepulse/` | **ScorePulse** |
| `/Resourceallocation/flowboard/` | **Flowboard** |

---

## Why static hosting?

GitHub Pages serves **static files only**. Express cannot run on Pages.

| App | Local | GitHub Pages |
|-----|-------|--------------|
| PulseDeck | `:5200` | site root |
| CapacityLens UI + API | `:5173` + `:4000` | `/capacitylens/` + baked `api/*.json` |
| ScorePulse | `:5175` | `/scorepulse/` + `data/scorepulse-data.json` |

Build command (repo root):

```bash
npm run install:suite
npm run build:pages
```

This runs `scripts/build-pages.mjs`, which sets:

- `GITHUB_PAGES=true` — Vite `base` paths under `/Resourceallocation/...`
- `VITE_PAGES=true` — PulseDeck uses relative iframe URLs (not localhost)
- `VITE_STATIC_API=true` — CapacityLens fetches JSON instead of Express

Output folder: `dist-pages/` (uploaded by Actions).

---

## One-time repository setup

1. **Settings → Pages** → Source = **GitHub Actions**
2. Ensure Actions are allowed for the repo / org
3. Private-repo Pages requires an eligible GitHub plan (Team/Enterprise) unless the repo is public

---

## Deploy pipeline

Workflow: [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)

**Triggers**
- Push to `main` changing CapacityLens, ScorePulse, PulseDeck, build scripts, or the workflow
- Manual **Run workflow**

**Jobs:** build suite → upload `dist-pages` → deploy-pages

---

## Direct links after deploy

- https://valuemomentum-enterprise-QE.github.io/Resourceallocation/
- https://valuemomentum-enterprise-QE.github.io/Resourceallocation/capacitylens/
- https://valuemomentum-enterprise-QE.github.io/Resourceallocation/scorepulse/
