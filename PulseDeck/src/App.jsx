import { useMemo, useState } from "react";

const APPS = {
  capacitylens: {
    id: "capacitylens",
    name: "CapacityLens",
    eyebrow: "Workforce analytics",
    blurb: "Capacity versus demand, utilization, team loading, and staffing scenarios for QA organizations.",
    url: "http://localhost:5173",
    tileClass: "capacity",
    cta: "Open CapacityLens",
  },
  scorepulse: {
    id: "scorepulse",
    name: "ScorePulse",
    eyebrow: "EFL executive scorecard",
    blurb: "Interactive RAG scorecard from May/June Excel workbooks — financial, delivery, quality, and every worksheet preserved.",
    url: "http://localhost:5175",
    tileClass: "score",
    cta: "Open ScorePulse",
  },
};

export default function App() {
  const [active, setActive] = useState(null);
  const app = useMemo(() => (active ? APPS[active] : null), [active]);

  if (app) {
    return (
      <div className="deck">
        <div className="app-frame">
          <div className="app-bar">
            <div className="title">{app.name}</div>
            <button type="button" onClick={() => setActive(null)}>
              ← Back to PulseDeck
            </button>
          </div>
          {/* iframe mounts only after click — app is not loaded on the home screen */}
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
          Choose an application. Nothing loads until you click — CapacityLens and ScorePulse open on demand.
        </p>
        <div className="tiles">
          {Object.values(APPS).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tile ${item.tileClass}`}
              onClick={() => setActive(item.id)}
            >
              <div className="eyebrow">{item.eyebrow}</div>
              <h2>{item.name}</h2>
              <p>{item.blurb}</p>
              <span className="cta">{item.cta} →</span>
            </button>
          ))}
        </div>
        <p className="status">
          Requires local servers: CapacityLens <code>:5173</code> · ScorePulse <code>:5175</code> · PulseDeck <code>:5200</code>
        </p>
      </div>
    </div>
  );
}
