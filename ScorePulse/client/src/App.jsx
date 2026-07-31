import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

function formatValue(v, type) {
  if (v == null || v === "NIL" || v === "") return "—";
  if (typeof v === "object" && v.error) return v.error;
  if (type === "percent" && typeof v === "number") return `${(v * 100).toFixed(1)}%`;
  if (type === "currency" && typeof v === "number") {
    return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  if (type === "days" && typeof v === "number") return `${v.toFixed(2)}d`;
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(2);
  return String(v);
}

function statusClass(s) {
  if (!s) return "Unknown";
  if (["Green", "Yellow", "Red"].includes(s)) return s;
  const t = String(s);
  if (t.includes("Green")) return "Green";
  if (t.includes("Yellow")) return "Yellow";
  if (t.includes("Red")) return "Red";
  return "Unknown";
}

function gridToMatrix(sheet) {
  const maxC = sheet.maxCol || 1;
  const rows = [];
  for (const item of sheet.grid) {
    const arr = Array(maxC).fill(null);
    for (const [c, v] of Object.entries(item.cells)) {
      arr[Number(c) - 1] = v;
    }
    rows.push({ rowNum: item.row, cells: arr });
  }
  return rows;
}

function SheetTable({ sheet }) {
  const rows = useMemo(() => gridToMatrix(sheet), [sheet]);
  if (!rows.length) return <p>No data in this sheet.</p>;
  const maxC = sheet.maxCol;
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>#</th>
            {Array.from({ length: maxC }, (_, i) => (
              <th key={i}>C{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.rowNum}>
              <td>{r.rowNum}</td>
              {r.cells.map((cell, i) => {
                const text =
                  cell == null
                    ? ""
                    : typeof cell === "object" && cell.error
                      ? cell.error
                      : String(cell);
                const isStatus = /green|yellow|red/i.test(text);
                return (
                  <td key={i} className={text.length > 40 ? "wrap" : ""}>
                    {isStatus ? <span className={`badge ${statusClass(text)}`}>{statusClass(text)}</span> : text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SnapshotView({ snapshot }) {
  return (
    <div className="kpi-grid">
      {snapshot.map((s) => (
        <div key={s.metric} className={`kpi ${statusClass(s.status)}`}>
          <div className="label">{s.metric}</div>
          <div className="value">
            {typeof s.currentValue === "number" && s.currentValue <= 2 && s.currentValue >= -2
              ? formatValue(s.currentValue, "percent")
              : formatValue(s.currentValue, typeof s.currentValue === "number" && s.currentValue > 50 ? "currency" : "number")}
          </div>
          <div className="meta">
            Target: {s.target ?? "—"} · <span className={`badge ${statusClass(s.status)}`}>{statusClass(s.status)}</span>
          </div>
          {s.remarks ? <div className="remarks">{s.remarks}</div> : null}
        </div>
      ))}
    </div>
  );
}

function TrendsView({ metrics }) {
  const chartMetrics = metrics.filter((m) =>
    ["eac_vs_budget", "burn_variance", "cost_per_sp", "commitment_reliability", "cycle_time", "defect_leakage", "rework_ratio", "ftpr"].includes(m.id)
  );

  const monthSet = [];
  for (const m of chartMetrics) {
    for (const k of Object.keys(m.values)) {
      if (k.endsWith("_error")) continue;
      if (!monthSet.includes(k)) monthSet.push(k);
    }
  }

  const series = monthSet.map((month) => {
    const point = { month };
    for (const m of chartMetrics) {
      let v = m.values[month];
      if (typeof v === "string" && v === "NIL") v = null;
      if (m.valueType === "percent" && typeof v === "number") v = Number((v * 100).toFixed(2));
      point[m.id] = typeof v === "number" ? v : null;
    }
    return point;
  });

  return (
    <div className="panel-grid">
      <div className="panel">
        <h2>Financial trends</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series}>
            <CartesianGrid stroke="#e2d8c6" strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="eac_vs_budget" name="EAC vs Budget %" stroke="#0f4c5c" strokeWidth={2} connectNulls />
            <Line type="monotone" dataKey="burn_variance" name="Burn Variance %" stroke="#9a6b00" strokeWidth={2} connectNulls />
            <Line type="monotone" dataKey="cost_per_sp" name="Cost/SP ($)" stroke="#1f7a4c" strokeWidth={2} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h2>Delivery & quality trends</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series}>
            <CartesianGrid stroke="#e2d8c6" strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="commitment_reliability" name="Commitment %" stroke="#0f4c5c" strokeWidth={2} connectNulls />
            <Line type="monotone" dataKey="cycle_time" name="Cycle Time (d)" stroke="#5c554c" strokeWidth={2} connectNulls />
            <Line type="monotone" dataKey="defect_leakage" name="Leakage %" stroke="#b42318" strokeWidth={2} connectNulls />
            <Line type="monotone" dataKey="rework_ratio" name="Rework %" stroke="#9a6b00" strokeWidth={2} connectNulls />
            <Line type="monotone" dataKey="ftpr" name="FTPR %" stroke="#1f7a4c" strokeWidth={2} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RagBars({ snapshot }) {
  const counts = { Green: 0, Yellow: 0, Red: 0, Unknown: 0 };
  for (const s of snapshot) counts[statusClass(s.status)] = (counts[statusClass(s.status)] || 0) + 1;
  const data = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([status, count]) => ({ status, count }));
  return (
    <div className="panel">
      <h2>RAG distribution (current snapshot)</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e2d8c6" strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" name="Metrics" fill="#0f4c5c" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CompareView({ periods }) {
  const may = periods["2025-05"]?.structured?.scorecard?.snapshot || [];
  const jun = periods["2025-06"]?.structured?.scorecard?.snapshot || [];
  const keys = Array.from(new Set([...may.map((m) => m.metric), ...jun.map((m) => m.metric)]));
  return (
    <div className="panel">
      <h2>May vs June snapshot</h2>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Metric</th>
              <th>May value</th>
              <th>May status</th>
              <th>June value</th>
              <th>June status</th>
              <th>May remarks</th>
              <th>June remarks</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((metric) => {
              const a = may.find((x) => x.metric === metric) || {};
              const b = jun.find((x) => x.metric === metric) || {};
              return (
                <tr key={metric}>
                  <td className="wrap">{metric}</td>
                  <td>{formatValue(a.currentValue, "number")}</td>
                  <td><span className={`badge ${statusClass(a.status)}`}>{statusClass(a.status)}</span></td>
                  <td>{formatValue(b.currentValue, "number")}</td>
                  <td><span className={`badge ${statusClass(b.status)}`}>{statusClass(b.status)}</span></td>
                  <td className="wrap">{a.remarks || ""}</td>
                  <td className="wrap">{b.remarks || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricsTable({ metrics, months }) {
  const valueMetrics = metrics.filter((m) => m.valueType !== "status");
  return (
    <div className="panel">
      <h2>Scorecard metrics (full series)</h2>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Category</th>
              <th>Metric</th>
              {months.map((m) => (
                <th key={m}>{m}</th>
              ))}
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {valueMetrics.map((m) => (
              <tr key={m.id}>
                <td>{m.category}</td>
                <td className="wrap">{m.name}</td>
                {months.map((month) => (
                  <td key={month}>{formatValue(m.values[month], m.valueType)}</td>
                ))}
                <td className="wrap">{m.threshold ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [periodKey, setPeriodKey] = useState("2025-06");
  const [view, setView] = useState("executive");
  const [sheetName, setSheetName] = useState("Scorecard");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/scorepulse-data.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load data (${r.status})`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const period = data?.periods?.[periodKey];
  const scorecard = period?.structured?.scorecard;
  const sheets = period?.sheetNames || [];

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="loading">Loading ScorePulse…</div>;

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          {import.meta.env.BASE_URL.includes("/Resourceallocation/") ? (
            <a
              href="/Resourceallocation/"
              style={{ color: "inherit", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}
            >
              ← PulseDeck
            </a>
          ) : null}
          <h1>ScorePulse</h1>
          <p>EFL executive scorecard — every worksheet, visualized without dropping cells.</p>
        </div>
        <div className="controls">
          <label>
            Period
            <select value={periodKey} onChange={(e) => setPeriodKey(e.target.value)}>
              {data.catalog.periods.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label} ({p.sourceFile})
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <nav className="nav">
        {[
          ["executive", "Executive"],
          ["trends", "Trends"],
          ["compare", "May vs June"],
          ["sheets", "All worksheets"],
        ].map(([id, label]) => (
          <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="legend">
        <span>Source: {period.sourceFile}</span>
        <span>Sheets: {sheets.length}</span>
        <span>Common model: {data.catalog.commonSheets.length} worksheets across both months</span>
        <span className="badge Green">Green</span>
        <span className="badge Yellow">Yellow</span>
        <span className="badge Red">Red</span>
      </div>

      {view === "executive" && scorecard && (
        <>
          <h2 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.75rem" }}>
            Current month snapshot
          </h2>
          <SnapshotView snapshot={scorecard.snapshot} />
          <div className="panel-grid">
            <RagBars snapshot={scorecard.snapshot} />
            <div className="panel">
              <h2>Metric categories</h2>
              <ul>
                {data.catalog.metricCategories.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="remarks">
                {data.catalog.dataFidelity}
              </p>
            </div>
          </div>
          <MetricsTable metrics={scorecard.metrics} months={scorecard.months} />
        </>
      )}

      {view === "trends" && scorecard && <TrendsView metrics={scorecard.metrics} />}

      {view === "compare" && <CompareView periods={data.periods} />}

      {view === "sheets" && period && (
        <div className="panel">
          <h2>Worksheet explorer (full cell grid)</h2>
          <div className="sheet-list">
            {sheets.map((name) => (
              <button
                key={name}
                className={sheetName === name ? "active" : ""}
                onClick={() => setSheetName(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="remarks">
            Showing every non-empty cell from <strong>{sheetName}</strong> (
            {period.sheets[sheetName]?.grid?.length || 0} rows). Nothing inferred — Excel errors kept as-is.
          </p>
          {period.sheets[sheetName] ? (
            <SheetTable sheet={period.sheets[sheetName]} />
          ) : (
            <p>Sheet not found in this period.</p>
          )}
        </div>
      )}
    </div>
  );
}
