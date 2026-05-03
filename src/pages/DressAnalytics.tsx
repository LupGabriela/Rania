import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import * as api from "../data/apiClient";
import type { DressStats, DressRecord } from "../data/apiClient";

const DEEP_MOCHA = "#3D2B1F";
const CHAMPAGNE = "#F0E6D3";
const LINEN = "#FAF6F0";
const GOLD = "#C9A96E";
const ROSE = "#C4846A";

const MATERIAL_COLORS: Record<string, string> = {
  Silk: GOLD, Chiffon: "#E8C4A8", Satin: ROSE, Lace: "#D4A8B0", Cotton: "#8B7355",
};


export function DressAnalytics() {
  const [view, setView] = useState<"table" | "visual">("visual");
  const [stats, setStats] = useState<DressStats | null>(null);
  const [allDresses, setAllDresses] = useState<DressRecord[]>([]);

  useEffect(() => {
    api.fetchStats().then(setStats).catch(() => {});
    api.fetchDresses(1, 100).then((r) => setAllDresses(r.data)).catch(() => {});
  }, []);

  const salesByMaterial = stats
    ? Object.entries(stats.byMaterial).map(([name, value]) => ({ name, value, color: MATERIAL_COLORS[name] ?? "#aaa" }))
    : [];

  const stockBySize = stats
    ? Object.entries(stats.bySize).map(([size, stock]) => ({ size, stock }))
    : [];

  const kpis = [
    { label: "Total Dresses", value: stats?.totalDresses ?? "…" },
    { label: "Total Stock",   value: stats?.totalStock ?? "…" },
    { label: "Out of Stock",  value: stats?.outOfStock ?? "…" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: LINEN }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              color: DEEP_MOCHA,
              marginBottom: "6px",
            }}
          >
            Dress Analytics
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px",
              fontStyle: "italic",
              color: ROSE,
            }}
          >
            Insights that shape the collection
          </p>
        </div>

        {/* Toggle */}
        <div
          className="inline-flex p-1 mb-8"
          style={{ backgroundColor: "#EDE0D4", borderRadius: "30px" }}
        >
          {(["visual", "table"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-7 py-2 transition-all"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.8px",
                borderRadius: "24px",
                border: "none",
                cursor: "pointer",
                backgroundColor: view === v ? DEEP_MOCHA : "transparent",
                color: view === v ? CHAMPAGNE : DEEP_MOCHA,
              }}
            >
              {v === "visual" ? "Visual View" : "Table View"}
            </button>
          ))}
        </div>

        {/* ── TABLE VIEW ── */}
        {view === "table" && (
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(61,43,31,0.10)",
              border: "1px solid rgba(61,43,31,0.08)",
            }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: DEEP_MOCHA }}>
                  {["Dress Name", "Price", "Material", "Sizes Available", "Stock Qty"].map((col) => (
                    <th
                      key={col}
                      className="text-left px-5 py-4"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: CHAMPAGNE,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allDresses.map((dress, i) => (
                  <tr key={dress.id} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : CHAMPAGNE }}>
                    <td className="px-5 py-3.5">
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: DEEP_MOCHA }}>{dress.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: DEEP_MOCHA, fontWeight: 500 }}>{dress.price.toLocaleString("ro-RO")} RON</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: DEEP_MOCHA }}>{dress.material}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1 flex-wrap">
                        {dress.sizes.map((s) => (
                          <span key={`${dress.id}-${s}`} className="px-2 py-0.5" style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: ROSE, border: `1px solid ${ROSE}`, borderRadius: "3px" }}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: dress.stockQuantity === 0 ? "#B07070" : DEEP_MOCHA, fontWeight: dress.stockQuantity === 0 ? 500 : 400 }}>
                        {dress.stockQuantity === 0 ? "Out of Stock" : dress.stockQuantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── VISUAL VIEW ── */}
        {view === "visual" && (
          <div className="flex flex-col gap-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="flex flex-col items-center justify-center py-8 px-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
                    border: "1px solid rgba(201,169,110,0.2)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: GOLD,
                      marginBottom: "10px",
                    }}
                  >
                    {kpi.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "48px",
                      color: DEEP_MOCHA,
                      lineHeight: 1,
                    }}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut Chart — fixed size, no ResponsiveContainer */}
              <div
                className="p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    color: DEEP_MOCHA,
                    marginBottom: "20px",
                  }}
                >
                  Sales by Material
                </p>
                <div className="flex items-center gap-6">
                  {/* Fixed dimensions — no ResponsiveContainer needed */}
                  <div style={{ width: 180, height: 180, flexShrink: 0 }}>
                    <PieChart width={180} height={180}>
                      <Pie
                        data={salesByMaterial}
                        cx={90}
                        cy={90}
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {salesByMaterial.map((entry) => (
                          <Cell
                            key={`donut-cell-${entry.name}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                    </PieChart>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    {salesByMaterial.map((m) => (
                      <div key={`legend-${m.name}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: m.color }}
                          />
                          <span
                            style={{
                              fontFamily: "'Jost', sans-serif",
                              fontSize: "12px",
                              color: DEEP_MOCHA,
                            }}
                          >
                            {m.name}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontSize: "12px",
                            fontWeight: 500,
                            color: GOLD,
                          }}
                        >
                          {m.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div
                className="p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    color: DEEP_MOCHA,
                    marginBottom: "20px",
                  }}
                >
                  Stock by Size
                </p>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart
                    data={stockBySize}
                    barCategoryGap="35%"
                    margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="rgba(61,43,31,0.06)" />
                    <XAxis
                      dataKey="size"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fill: DEEP_MOCHA, opacity: 0.7 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fill: DEEP_MOCHA, opacity: 0.5 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(196,132,106,0.06)" }}
                      contentStyle={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "12px",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="stock" fill={ROSE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Dresses */}
            <div
              className="p-6"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "18px",
                  color: DEEP_MOCHA,
                  marginBottom: "20px",
                }}
              >
                Top Dresses
              </p>
              <div className="flex flex-col">
                {allDresses.slice(0, 5).map((dress, i) => (
                  <div key={dress.id} className="flex items-center gap-5 py-3.5" style={{ borderBottom: i < 4 ? "1px solid rgba(61,43,31,0.06)" : "none" }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: i === 0 ? GOLD : i === 1 ? "#D4C4A8" : "#EDE0D4", fontFamily: "'Playfair Display', serif", fontSize: "13px", color: i === 0 ? DEEP_MOCHA : "rgba(61,43,31,0.6)" }}>
                      {i + 1}
                    </span>
                    <span className="flex-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: DEEP_MOCHA }}>{dress.name}</span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "rgba(61,43,31,0.5)" }}>{dress.material}</span>
                    <span className="w-24 text-right" style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: ROSE, fontWeight: 500 }}>
                      {dress.stockQuantity === 0 ? "Out of stock" : `${dress.stockQuantity} in stock`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
