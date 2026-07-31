# GitHub Pages Hosting Requirements — CapacityLens

**Status:** Ready for GitHub Actions deployment  
**Target URL:** https://valuemomentum-enterprise-QE.github.io/Resourceallocation/

---

## 1. Why static hosting?

GitHub Pages serves **static files only**. The Express API cannot run on Pages.

CapacityLens is deployed as:

| Layer | Local (`npm run dev`) | GitHub Pages |
|-------|------------------------|--------------|
| UI | Vite React on `:5173` | Built assets under `/Resourceallocation/` |
| Data | Express API on `:4000` | Pre-exported JSON in `/api/*.json` |

The build step `npm run build:pages` exports API payloads to `client/public/api/` and builds the UI with:

- `GITHUB_PAGES=true` → Vite `base: /Resourceallocation/`
- `VITE_STATIC_API=true` → client fetches `*.json` instead of live Express

---

## 2. One-time repository setup (required)

Complete these in GitHub before the site will go live:

### 2.1 Enable GitHub Pages (Actions source)

1. Open **Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Save

### 2.2 Allow Actions permissions

1. **Settings → Actions → General**
2. Ensure Actions are enabled for the repository
3. Under **Workflow permissions**, allow **Read and write permissions**  
   (or keep read-only — this workflow uses the `pages: write` + `id-token` permissions block)

### 2.3 Org / plan prerequisites

| Requirement | Notes |
|-------------|--------|
| Pages enabled for the org | Org owners: Settings → Policies → Pages |
| Private repo Pages | Requires GitHub Team/Enterprise (or public repo) |
| Workflow allowed | Actions not blocked by org policy |

### 2.4 Confirm site URL

After the first successful workflow run:

```
https://valuemomentum-enterprise-QE.github.io/Resourceallocation/
```

Custom domains are optional (Settings → Pages → Custom domain).

---

## 3. Deploy pipeline

Workflow file: [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)

**Triggers**
- Push to `main` that changes `CapacityLens/app/**` or the workflow file
- Manual **Run workflow** (`workflow_dispatch`)

**Jobs**
1. `build` — install deps, `npm run build:pages`, upload artifact  
2. `deploy` — publish artifact to GitHub Pages environment

**Local production build (optional verify)**

```bash
cd CapacityLens/app
npm run install:all
npm run build:pages
npx --prefix client vite preview --base /Resourceallocation/
```

---

## 4. Technical requirements checklist

| # | Item | Owner |
|---|------|-------|
| 1 | Pages source = **GitHub Actions** | Repo admin |
| 2 | Actions allowed by org policy | Org admin |
| 3 | First workflow run succeeds (green check) | Auto on push / manual |
| 4 | `github-pages` environment approved if protection rules exist | Repo admin |
| 5 | Browser can load JS/CSS from `github.io` (no corp block) | Network |

---

## 5. What is and is not hosted

**Hosted on Pages**
- Executive / Portfolio / Team / Individual dashboards
- Scenario compare UI
- Static demo dataset (JSON snapshot)

**Not hosted on Pages**
- Live Express server
- Real-time ADO/Jira connectors
- Authenticated RLS

For production enterprise hosting with live APIs, use Azure Static Web Apps, App Service, or Fabric + Power BI (see solution roadmap).

---

## 6. Refreshing demo data on Pages

1. Edit `CapacityLens/app/server/src/data.js`
2. Commit & push to `main` (or run `npm run build:pages` locally first to verify)
3. Workflow regenerates JSON and redeploys

---

## 7. Done criteria

This hosting setup is **done** when:

1. Requirements doc and workflow are in the repo  
2. `npm run build:pages` succeeds locally  
3. Workflow is pushed to `main`  
4. You (or an admin) set Pages source to **GitHub Actions**  
5. Workflow run completes and the site URL loads the CapacityLens UI  

Items 1–3 are completed by engineering in this change set.  
Items 4–5 require GitHub UI access if Pages has never been enabled for this repo.
