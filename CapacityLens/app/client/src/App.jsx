import { useEffect, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

async function api(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`API ${path} failed (${res.status})`);
  return res.json();
}

function utilTone(util) {
  if (util > 100) return "over";
  if (util > 90) return "high";
  if (util < 75) return "under";
  return "healthy";
}

function heatClass(util) {
  return `heat-cell heat-${utilTone(util)}`;
}

function Kpi({ label, value, hint, tone = "neutral" }) {
  return (
    <div className={`kpi ${tone}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

function ExecutiveView({ data, scenario, onSelectTeam }) {
  const active = data.scenarios.find((s) => s.id === scenario) || data.scenarios[0];
  return (
    <>
      <div className="kpi-grid">
        <Kpi
          label="Utilization"
          value={`${active.utilization}%`}
          hint="Target 75–90%"
          tone={utilTone(active.utilization)}
        />
        <Kpi label="Bench" value={`${active.bench}%`} hint="Strategic 5–15%" tone="neutral" />
        <Kpi
          label="Forecast gap"
          value={`+${active.gapFte} FTE`}
          hint={active.note}
          tone={active.gapFte > 5 ? "red" : "amber"}
        />
        <Kpi
          label="Coverage"
          value={`${data.kpis.coverage}%`}
          hint="Avg project staffing"
          tone={data.kpis.coverage >= 95 ? "healthy" : data.kpis.coverage >= 80 ? "amber" : "red"}
        />
        <Kpi
          label="Over-utilized"
          value={`${data.kpis.overUtilPct}%`}
          hint="People above 90%"
          tone={data.kpis.overUtilPct > 20 ? "red" : "amber"}
        />
        <Kpi label="Headcount" value={data.kpis.headcount} hint="Active QA FTEs" tone="neutral" />
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>Capacity vs demand (rolling)</h2>
          <div className="stack-legend">
            <span>
              <i className="dot" style={{ background: "#0b6e6a" }} /> Capacity
            </span>
            <span>
              <i className="dot" style={{ background: "#3a5a8c" }} /> Actual demand
            </span>
            <span>
              <i className="dot" style={{ background: "#b86e00" }} /> Forecast demand
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data.trend}>
              <CartesianGrid stroke="#d7e2ea" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="demand"
                name="Actual demand"
                fill="#c5d4e8"
                stroke="#3a5a8c"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="#b86e00"
                strokeDasharray="5 4"
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="capacity"
                name="Capacity"
                stroke="#0b6e6a"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h2>Team utilization</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Util %</th>
                <th>Bench %</th>
                <th>Overbooked</th>
              </tr>
            </thead>
            <tbody>
              {data.teams.map((t) => (
                <tr key={t.id} onClick={() => onSelectTeam(t.id)}>
                  <td>{t.name}</td>
                  <td>
                    <span className={`status-pill ${utilTone(t.utilization)}`}>
                      {t.utilization}%
                    </span>
                  </td>
                  <td>{t.bench}%</td>
                  <td>{t.overbooked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>Skill bottlenecks</h2>
          {data.skillGaps.map((s) => (
            <div className="bar-row" key={s.skill}>
              <span>{s.skill}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill ${s.gap < 0 ? "gap" : "surplus"}`}
                  style={{ width: `${Math.min(100, (s.capacity / Math.max(s.demand, 1)) * 100)}%` }}
                />
              </div>
              <span>{s.gap > 0 ? `+${s.gap}h` : `${s.gap}h`}</span>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Exceptions</h2>
          <ul className="exception-list">
            {data.exceptions.map((e) => (
              <li key={e.id}>
                <span className={`badge ${e.severity}`}>{e.severity}</span>
                <span>{e.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function PortfolioView({ data }) {
  return (
    <>
      <div className="panel">
        <h2>Project staffing coverage</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Portfolio</th>
              <th>Demand</th>
              <th>Allocated</th>
              <th>Coverage</th>
              <th>Unstaffed</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.portfolio}</td>
                <td>{p.demandHours}h</td>
                <td>{p.allocated}h</td>
                <td>
                  <span
                    className={`badge ${
                      p.coverage >= 95 ? "green" : p.coverage >= 80 ? "amber" : "red"
                    }`}
                  >
                    {p.coverage}%
                  </span>
                </td>
                <td>{p.unstaffed}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel-grid" style={{ marginTop: "0.9rem" }}>
        <div className="panel">
          <h2>Demand stack (committed / likely / pipeline)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.demandStack}>
              <CartesianGrid stroke="#d7e2ea" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="committed" stackId="d" fill="#0b6e6a" name="Committed" />
              <Bar dataKey="likely" stackId="d" fill="#3a5a8c" name="Likely" />
              <Bar dataKey="pipeline" stackId="d" fill="#b86e00" name="Pipeline" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h2>Allocation matrix (hours)</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Team</th>
                {data.projects.map((p) => (
                  <th key={p.id}>{p.name.split(" ")[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.allocationMatrix.map((row) => (
                <tr key={row.teamId}>
                  <td>{row.teamName}</td>
                  {data.projects.map((p) => (
                    <td key={p.id}>{row[p.id] || 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TeamView({ data, onSelectPerson }) {
  const team = data.team;
  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Utilization" value={`${team.utilization}%`} tone={utilTone(team.utilization)} hint="Team planned" />
        <Kpi label="Available" value={`${team.available}h`} tone="neutral" hint="Remaining capacity" />
        <Kpi label="Overbooked" value={team.overbooked} tone={team.overbooked ? "red" : "healthy"} hint="People >100%" />
        <Kpi label="TLBI" value={team.tlbi} tone={team.tlbi >= 0.75 ? "healthy" : "amber"} hint="Load balance index" />
        <Kpi label="Bench" value={`${team.bench}%`} tone="neutral" hint="Unallocated share" />
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>Resource loading heatmap</h2>
          <table className="heatmap">
            <thead>
              <tr>
                <th className="name">Person</th>
                {data.weeks.map((w) => (
                  <th key={w}>{w}</th>
                ))}
                <th>Month</th>
              </tr>
            </thead>
            <tbody>
              {team.members.map((m) => (
                <tr key={m.id}>
                  <td className="name">{m.name}</td>
                  {m.weekly.map((u, i) => (
                    <td key={i}>
                      <div className={heatClass(u)} onClick={() => onSelectPerson(m.id)}>
                        {u}
                      </div>
                    </td>
                  ))}
                  <td>
                    <div className={heatClass(m.utilization)} onClick={() => onSelectPerson(m.id)}>
                      {m.utilization}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2>Exceptions</h2>
          <ul className="exception-list">
            {data.exceptions.map((e) => (
              <li key={e.id}>
                <span className={`badge ${e.severity}`}>{e.severity}</span>
                <span>{e.message}</span>
              </li>
            ))}
          </ul>
          <h2 style={{ marginTop: "1.1rem" }}>Skill supply vs demand</h2>
          {data.skillGaps.map((s) => (
            <div className="bar-row" key={s.skill}>
              <span>{s.skill}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill ${s.gap < 0 ? "gap" : "surplus"}`}
                  style={{ width: `${Math.min(100, (s.capacity / Math.max(s.demand, 1)) * 100)}%` }}
                />
              </div>
              <span>{s.gap}h</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: "0.9rem" }}>
        <h2>Allocation matrix</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Role</th>
              <th>Net hrs</th>
              <th>Allocated</th>
              <th>Util %</th>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            {team.members.map((m) => (
              <tr key={m.id} onClick={() => onSelectPerson(m.id)}>
                <td>{m.name}</td>
                <td>{m.role}</td>
                <td>{m.capacity.net}</td>
                <td>{m.allocated}</td>
                <td>
                  <span className={`badge ${utilTone(m.utilization) === "healthy" ? "green" : utilTone(m.utilization) === "under" ? "amber" : utilTone(m.utilization) === "high" ? "amber" : "red"}`}>
                    {m.utilization}%
                  </span>
                </td>
                <td>{m.allocations.map((a) => a.projectName).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IndividualView({ data, onBack }) {
  const p = data.person;
  return (
    <>
      <button className="back-link" onClick={onBack}>
        ← Back to team
      </button>
      <div className="person-hero">
        <div>
          <h1>{p.name}</h1>
          <p>
            {p.role} · {p.teamName} · Skills: {p.skills.join(", ")}
          </p>
        </div>
      </div>
      <div className="kpi-grid">
        <Kpi label="Utilization" value={`${p.utilization}%`} tone={utilTone(p.utilization)} />
        <Kpi label="Available" value={`${p.available}h`} tone="neutral" />
        <Kpi label="Net capacity" value={`${p.capacity.net}h`} tone="neutral" hint={`Gross ${p.capacity.gross}h`} />
        <Kpi label="Leave + overhead" value={`${p.capacity.leave + p.capacity.overhead}h`} tone="amber" />
      </div>
      <div className="panel-grid">
        <div className="panel">
          <h2>Weekly load</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={p.weekly.map((u, i) => ({ week: `W${i + 1}`, util: u }))}
            >
              <CartesianGrid stroke="#d7e2ea" strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 130]} />
              <Tooltip />
              <Bar dataKey="util" name="Utilization %" fill="#0b6e6a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h2>Allocations</h2>
          <div className="alloc-bars">
            {p.allocations.map((a) => (
              <div className="alloc-item" key={a.projectId}>
                <strong>{a.projectName}</strong>
                <span>
                  {a.hours}h · {a.pct}%
                </span>
                <div className="track">
                  <div className="fill" style={{ width: `${Math.min(100, a.pct)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [view, setView] = useState("executive");
  const [scenario, setScenario] = useState("baseline");
  const [teamId, setTeamId] = useState("payments");
  const [personId, setPersonId] = useState(null);
  const [exec, setExec] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [team, setTeam] = useState(null);
  const [person, setPerson] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiOk, setApiOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const health = await api("/api/health");
        if (cancelled) return;
        setApiOk(!!health.ok);
        const [e, p, t] = await Promise.all([
          api("/api/executive"),
          api("/api/portfolio"),
          api(`/api/teams/${teamId}`),
        ]);
        if (cancelled) return;
        setExec(e);
        setPortfolio(p);
        setTeam(t);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load CapacityLens API");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  useEffect(() => {
    if (!personId) {
      setPerson(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await api(`/api/people/${personId}`);
        if (!cancelled) {
          setPerson(data);
          setView("individual");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [personId]);

  const scenarios = useMemo(() => exec?.scenarios || [], [exec]);

  if (loading && !exec) {
    return <div className="loading">Connecting to CapacityLens API…</div>;
  }

  if (error && !exec) {
    return (
      <div className="error">
        <p>Could not reach the API.</p>
        <p>{error}</p>
        <p>Start the server on port 4000, then refresh.</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CapacityLens</div>
          <div className="brand-tag">See demand. Measure capacity. Plan with confidence.</div>
        </div>
        <div className="meta-row">
          <span className="chip">
            API <strong>{apiOk ? "online" : "offline"}</strong>
          </span>
          <span className="chip">
            Org <strong>{exec?.meta.org}</strong>
          </span>
          <span className="chip">
            Period <strong>{exec?.meta.periodLabel}</strong>
          </span>
          <span className="chip">
            DQ <strong>{exec?.meta.dqScore}%</strong>
          </span>
        </div>
      </header>

      <nav className="nav">
        {[
          ["executive", "Executive"],
          ["portfolio", "Portfolio"],
          ["team", "Team Manager"],
          ["individual", "Individual"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => {
              setView(id);
              if (id !== "individual") setPersonId(null);
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="filters">
        <label>
          Scenario
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        {(view === "team" || view === "individual") && (
          <label>
            Team
            <select
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value);
                setPersonId(null);
                setView("team");
              }}
            >
              {(exec?.teams || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {view === "executive" && exec && (
        <>
          <div className="panel" style={{ marginBottom: "0.9rem" }}>
            <h2>Scenario compare</h2>
            <div className="scenario-grid">
              {scenarios.map((s) => (
                <div
                  key={s.id}
                  className={`scenario ${scenario === s.id ? "active" : ""}`}
                  onClick={() => setScenario(s.id)}
                >
                  <h3>{s.name}</h3>
                  <p>{s.note}</p>
                  <div className="metrics">
                    <span>Util {s.utilization}%</span>
                    <span>Gap +{s.gapFte} FTE</span>
                    <span>Bench {s.bench}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ExecutiveView
            data={exec}
            scenario={scenario}
            onSelectTeam={(id) => {
              setTeamId(id);
              setView("team");
            }}
          />
        </>
      )}

      {view === "portfolio" && portfolio && <PortfolioView data={portfolio} />}

      {view === "team" && team && (
        <TeamView
          data={team}
          onSelectPerson={(id) => setPersonId(id)}
        />
      )}

      {view === "individual" && person && (
        <IndividualView
          data={person}
          onBack={() => {
            setPersonId(null);
            setView("team");
          }}
        />
      )}

      {view === "individual" && !person && (
        <div className="panel">
          <h2>Select a person</h2>
          <p style={{ color: "var(--ink-muted)" }}>
            Open Team Manager and click a heatmap cell or row to drill into an individual resource.
          </p>
          <button
            className="back-link"
            onClick={() => setView("team")}
            style={{ marginTop: "0.75rem" }}
          >
            Go to Team Manager →
          </button>
        </div>
      )}
    </div>
  );
}
