import React, { useState } from "react";

const USERS = {
  admin: { pass: "hojholt2026", role: "Ejer" },
  revisor: { pass: "revisor2026", role: "Revisor" },
};

const M = ["Okt", "Nov", "Dec", "Jan", "Feb"];
const D = {
  rev24: [354427, 294625, 390567, 290715, 366663],
  beh24: [234565, 191328, 218299, 224242, 258276],
  prod24: [124076, 83151, 105948, 90770, 123268],
  db24: [213814, 253935, 331630, 213804, 269991],
  lon24: [151555, 181047, 139574, 165553, 199558],
  ref24: [45008, 30149, 83077, 42328, 27384],
  result24: [13724, 5704, 131428, -3177, 8805],
  rev25: [465218, 480513, 476898, 369970, 366965],
  beh25: [340966, 257489, 278036, 283230, 250888],
  prod25: [127877, 175622, 134073, 123795, 128185],
  db25: [292651, 319826, 380155, 318636, 276156],
  lon25: [230834, 238850, 257653, 277010, 245149],
  ref25: [0, 1436, 30589, 695, 0],
  sygeLon: [15725, 22373, 26017, 25772, 45620],
  result25: [-14073, 27370, 50959, -4752, -634],
};

const sum = (a) => a.reduce((s, v) => s + v, 0);
const fmtK = (v) => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toFixed(0));
const fmtN = (v) => Math.round(v).toLocaleString("da-DK");
const pct = (a, b) => (b !== 0 ? Math.round(((a - b) / Math.abs(b)) * 100) : 0);

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    const u = USERS[user.toLowerCase()];
    if (u && u.pass === pass) {
      onLogin({ username: user, role: u.role });
    } else {
      setErr("Forkert brugernavn eller adgangskode");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e17" }}>
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ background: "#111827", border: "1px solid #1e293b" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#38bdf8" }}>
            Højholt Hudpleje
          </h1>
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            Økonomi Dashboard
          </p>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-xs mb-1 uppercase tracking-wider" style={{ color: "#94a3b8" }}>
              Brugernavn
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => { setUser(e.target.value); setErr(""); }}
              onKeyDown={handleKey}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "#0a0e17", border: "1px solid #1e293b", color: "#e2e8f0" }}
              placeholder="Brugernavn"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs mb-1 uppercase tracking-wider" style={{ color: "#94a3b8" }}>
              Adgangskode
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setErr(""); }}
              onKeyDown={handleKey}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "#0a0e17", border: "1px solid #1e293b", color: "#e2e8f0" }}
            />
          </div>
          {err && <p className="text-sm mb-4" style={{ color: "#ef4444" }}>{err}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "#38bdf8", color: "#0a0e17" }}
          >
            Log ind
          </button>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, sub, color = "#e2e8f0" }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid #1e293b" }}>
      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "#94a3b8" }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, labels, height = 200, colors, stacked = false, suffix = "" }) {
  const max = stacked
    ? Math.max(...labels.map((_, i) => data.reduce((s, d) => s + Math.max(0, d.values[i]), 0)))
    : Math.max(...data.flatMap((d) => d.values.map(Math.abs)));
  const barW = stacked ? 32 : (32 / data.length);
  const gap = stacked ? 12 : 4;

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${labels.length * (stacked ? 50 : 50) + 40} ${height}`} preserveAspectRatio="none">
        {labels.map((l, i) => {
          const x = 40 + i * ((stacked ? 50 : 50));
          if (stacked) {
            let y = height - 24;
            return (
              <g key={i}>
                {data.map((d, di) => {
                  const h = max > 0 ? (Math.abs(d.values[i]) / max) * (height - 40) : 0;
                  y -= h;
                  return <rect key={di} x={x - barW / 2} y={y} width={barW} height={h} rx={3} fill={d.color} opacity={0.85} />;
                })}
                <text x={x} y={height - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{l}</text>
              </g>
            );
          } else {
            return (
              <g key={i}>
                {data.map((d, di) => {
                  const v = d.values[i];
                  const h = max > 0 ? (Math.abs(v) / max) * (height - 40) : 0;
                  const baseY = height - 24;
                  const bx = x - (data.length * (barW + gap)) / 2 + di * (barW + gap);
                  return (
                    <rect
                      key={di}
                      x={bx}
                      y={v >= 0 ? baseY - h : baseY}
                      width={barW}
                      height={h}
                      rx={3}
                      fill={typeof d.color === "function" ? d.color(v) : d.color}
                      opacity={0.85}
                    />
                  );
                })}
                <text x={x} y={height - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{l}</text>
              </g>
            );
          }
        })}
      </svg>
      {data.length > 1 && (
        <div className="flex gap-4 justify-center mt-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1 text-xs" style={{ color: "#94a3b8" }}>
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: typeof d.color === "function" ? "#94a3b8" : d.color }} />
              {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DataTable() {
  const rows = [
    { label: "Omsætning", d24: D.rev24, d25: D.rev25, bold: true },
    { label: "  Behandlinger", d24: D.beh24, d25: D.beh25 },
    { label: "  Produkter", d24: D.prod24, d25: D.prod25 },
    { label: "Dækningsbidrag", d24: D.db24, d25: D.db25, bold: true, accent: true },
    { label: "Lønninger", d24: D.lon24, d25: D.lon25, bold: true },
    { label: "Lønrefusion", d24: D.ref24, d25: D.ref25 },
    { label: "  Heraf sygeløn", d24: [0, 0, 0, 0, 0], d25: D.sygeLon },
    { label: "Resultat", d24: D.result24, d25: D.result25, bold: true, sep: true },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th className="text-left py-2 px-2" style={{ color: "#94a3b8" }}></th>
            {M.map((m) => (
              <th key={m} colSpan={2} className="text-right py-2 px-1" style={{ color: "#94a3b8" }}>{m}</th>
            ))}
            <th colSpan={2} className="text-right py-2 px-1" style={{ color: "#94a3b8" }}>Total</th>
            <th className="text-right py-2 px-1" style={{ color: "#94a3b8" }}>YOY</th>
          </tr>
          <tr>
            <th></th>
            {M.map((m) => (
              <React.Fragment key={m}>
                <th className="text-right px-1 pb-1" style={{ color: "#64748b", fontSize: "0.6rem" }}>24/25</th>
                <th className="text-right px-1 pb-1" style={{ color: "#38bdf8", fontSize: "0.6rem" }}>25/26</th>
              </React.Fragment>
            ))}
            <th className="text-right px-1 pb-1" style={{ color: "#64748b", fontSize: "0.6rem" }}>24/25</th>
            <th className="text-right px-1 pb-1" style={{ color: "#38bdf8", fontSize: "0.6rem" }}>25/26</th>
            <th className="text-right px-1 pb-1" style={{ color: "#94a3b8", fontSize: "0.6rem" }}>Δ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => {
            const t24 = sum(r.d24), t25 = sum(r.d25);
            const yoy = pct(t25, t24);
            return (
              <tr
                key={ri}
                style={{
                  borderTop: r.sep ? "2px solid #1e293b" : "none",
                  borderBottom: "1px solid rgba(30,41,59,0.3)",
                }}
              >
                <td
                  className="py-1.5 px-2"
                  style={{
                    fontWeight: r.bold ? 600 : 400,
                    color: r.accent ? "#38bdf8" : "#e2e8f0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.label}
                </td>
                {M.map((_, i) => (
                  <React.Fragment key={i}>
                    <td className="text-right py-1.5 px-1" style={{ color: "#94a3b8" }}>{fmtN(r.d24[i])}</td>
                    <td className="text-right py-1.5 px-1" style={{ color: "#e2e8f0", fontWeight: r.bold ? 600 : 400 }}>{fmtN(r.d25[i])}</td>
                  </React.Fragment>
                ))}
                <td className="text-right py-1.5 px-1" style={{ color: "#94a3b8", fontWeight: 600 }}>{fmtN(t24)}</td>
                <td className="text-right py-1.5 px-1" style={{ color: "#e2e8f0", fontWeight: 600 }}>{fmtN(t25)}</td>
                <td
                  className="text-right py-1.5 px-1 font-semibold"
                  style={{ color: yoy >= 0 ? "#22c55e" : "#ef4444" }}
                >
                  {yoy >= 0 ? "+" : ""}{yoy}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const tRev24 = sum(D.rev24), tRev25 = sum(D.rev25);
  const tRes24 = sum(D.result24), tRes25 = sum(D.result25);
  const tRef24 = sum(D.ref24), tRef25 = sum(D.ref25);
  const revGrowth = pct(tRev25, tRev24);
  const growth = D.rev25.map((v, i) => Math.round(((v - D.rev24[i]) / D.rev24[i]) * 100));

  return (
    <div className="min-h-screen" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(10,14,23,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e293b" }}
      >
        <h1 className="text-lg font-bold" style={{ color: "#38bdf8" }}>Højholt Hudpleje</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs px-2 py-1 rounded" style={{ background: "#1e293b", color: "#94a3b8" }}>
            {user.role}: {user.username}
          </span>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1 rounded hover:opacity-80 transition-opacity"
            style={{ background: "#1e293b", color: "#94a3b8" }}
          >
            Log ud
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#e2e8f0" }}>Økonomi — YOY Sammenligning</h2>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Okt–Feb · 2024/25 vs. 2025/26</p>
          </div>
          <div className="text-xs" style={{ color: "#64748b" }}>Fra e-conomic</div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <KPI label="Omsætning 25/26" value={(tRev25 / 1e6).toFixed(2) + "M"} sub={`vs. ${(tRev24 / 1e6).toFixed(2)}M`} color="#22c55e" />
          <KPI label="Vækst YOY" value={`+${revGrowth}%`} sub={`+${fmtK(tRev25 - tRev24)}`} color="#22c55e" />
          <KPI label="Resultat 25/26" value={`+${Math.round(tRes25 / 1000)}k`} sub={`vs. +${Math.round(tRes24 / 1000)}k`} color={tRes25 >= tRes24 ? "#22c55e" : "#eab308"} />
          <KPI label="Lønrefusion" value={`${Math.round(tRef25 / 1000)}k`} sub={`vs. ${Math.round(tRef24 / 1000)}k (-86%)`} color="#ef4444" />
          <KPI label="Sygeløn 25/26" value={`${Math.round(sum(D.sygeLon) / 1000)}k`} sub="Ikke budgetteret" color="#ef4444" />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid #1e293b" }}>
            <div className="text-sm font-semibold mb-3" style={{ color: "#94a3b8" }}>Omsætning YOY</div>
            <BarChart
              labels={M}
              data={[
                { label: "24/25", values: D.rev24, color: "#94a3b866" },
                { label: "25/26", values: D.rev25, color: "#38bdf8cc" },
              ]}
            />
          </div>
          <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid #1e293b" }}>
            <div className="text-sm font-semibold mb-3" style={{ color: "#94a3b8" }}>Resultat YOY</div>
            <BarChart
              labels={M}
              data={[
                { label: "24/25", values: D.result24, color: (v) => (v >= 0 ? "#94a3b866" : "#ef444466") },
                { label: "25/26", values: D.result25, color: (v) => (v >= 0 ? "#22c55ecc" : "#ef4444cc") },
              ]}
            />
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid #1e293b" }}>
            <div className="text-sm font-semibold mb-3" style={{ color: "#94a3b8" }}>YOY Omsætningsvækst %</div>
            <BarChart
              labels={M}
              data={[
                { label: "Vækst", values: growth, color: (v) => (v >= 0 ? "#22c55ecc" : "#ef4444cc") },
              ]}
              height={160}
            />
          </div>
          <div className="p-4 rounded-xl" style={{ background: "#111827", border: "1px solid #1e293b" }}>
            <div className="text-sm font-semibold mb-3" style={{ color: "#94a3b8" }}>Lønrefusion</div>
            <BarChart
              labels={M}
              data={[
                { label: "24/25", values: D.ref24, color: "#94a3b866" },
                { label: "25/26", values: D.ref25, color: "#22c55ecc" },
              ]}
              height={160}
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-4 rounded-xl mb-3" style={{ background: "#111827", border: "1px solid #1e293b" }}>
          <div className="text-sm font-semibold mb-3" style={{ color: "#94a3b8" }}>
            Detaljeret sammenligning — positive tal = overskud/indtægt
          </div>
          <DataTable />
        </div>

        {/* Insights */}
        <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)" }}>
          <div className="text-sm font-semibold mb-2" style={{ color: "#38bdf8" }}>Nøgle-indsigter</div>
          <ul className="text-sm space-y-1.5" style={{ color: "#94a3b8" }}>
            <li>• <strong style={{ color: "#38bdf8" }}>Omsætningen vokset {revGrowth}%</strong> — fra {(tRev24 / 1e6).toFixed(2)}M til {(tRev25 / 1e6).toFixed(2)}M</li>
            <li>• <strong style={{ color: "#38bdf8" }}>November: +{growth[1]}% YOY</strong> — største enkeltstående vækst (Black Friday/juleeffekt)</li>
            <li>• <strong style={{ color: "#ef4444" }}>Lønrefusion faldet 86%</strong> — fra {Math.round(tRef24 / 1000)}k til {Math.round(tRef25 / 1000)}k. Hovedårsag til lavere resultat</li>
            <li>• <strong style={{ color: "#ef4444" }}>Sygeløn: {Math.round(sum(D.sygeLon) / 1000)}k</strong> — stigende tendens, ikke budgetteret</li>
            <li>• <strong style={{ color: "#eab308" }}>Resultat ned {pct(tRes25, tRes24)}%</strong> — men {fmtN(Math.abs(tRes24 - tRes25))} kr skyldes primært dec 24's ekstraordinære refusion på 83k</li>
          </ul>
        </div>

        <div className="text-center text-xs py-4" style={{ color: "#64748b" }}>
          Højholt Hudpleje ApS · CVR 40494855 · Data fra e-conomic
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <LoginScreen onLogin={setUser} />
  );
}
