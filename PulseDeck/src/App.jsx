import { useMemo, useState } from "react";

const isPages = import.meta.env.VITE_PAGES === "true";
const base = import.meta.env.BASE_URL || "/";

const APPS = {
  capacitylens: {
    id: "capacitylens",
    name: "CapacityLens",
    eyebrow: "Workforce analytics",
    blurb:
      "Capacity versus demand, utilization, team loading, and staffing scenarios for QA organizations.",
    url: isPages ? `${base}capacitylens/` : "http://localhost:5173/",
    tileClass: "capacity",
    cta: "Open CapacityLens",
  },
  scorepulse: {
    id: "scorepulse",
    name: "ScorePulse",
    eyebrow: "EFL executive scorecard",
    blurb:
      "Interactive RAG scorecard from May/June Excel workbooks — financial, delivery, quality, and every worksheet preserved.",
    url: isPages ? `${base}scorepulse/` : "http://localhost:5175/",
    tileClass: "score",
    cta: "Open ScorePulse",
  },
};

export default function App() {
  const [active, setActive] = useState(null);
  const app = useMemo(() => (active ? APPS[active] : null), [active]);

  function openApp(item) {
    // On GitHub Pages, navigate fully so the app is visible at its own URL.
    // Locally, iframe keeps the suite on one port while child servers run separately.
    if (isPages) {
      window.location.assign(item.url);
      return;
    }
    setActive(item.id);
  }

  if (app) {
    return (
      <div className="deck">
        <div className="app-frame">
          <div className="app-bar">
            <div className="title">{app.name}</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: "1px solid var(--line)",
                  background: "#fff",
                  borderRadius: "999px",
                  padding: "0.4rem 0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Open in new tab
              </a>
              <button type="button" onClick={() => setActive(null)}>
                ← Back to PulseDeck
              </button>
            </div>
          </div>
          <iframe title={app.name} src={app.url} />
        </div>
      </div>
    );
  }

  return (
    <div className="deck">
      <div className="deck-home">
        <h1>PulseDeck</h1>
        <p className="tagline">
          Choose an application. Nothing loads until you click — CapacityLens and ScorePulse open on
          demand.
        </p>
        <div className="tiles">
          {Object.values(APPS).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tile ${item.tileClass}`}
              onClick={() => openApp(item)}
            >
              <div className="eyebrow">{item.eyebrow}</div>
              <h2>{item.name}</h2>
              <p>{item.blurb}</p>
              <span className="cta">{item.cta} →</span>
            </button>
          ))}
        </div>
        <p className="status">
          {isPages ? (
            <>
              Live on GitHub Pages · Direct links:{" "}
              <a href={`${base}capacitylens/`}>CapacityLens</a>
              {" · "}
              <a href={`${base}scorepulse/`}>ScorePulse</a>
            </>
          ) : (
            <>
              Local servers: CapacityLens <code>:5173</code> · ScorePulse <code>:5175</code> ·
              PulseDeck <code>:5200</code>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
