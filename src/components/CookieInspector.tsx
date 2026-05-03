/**
 * CookieInspector — floating panel that shows all RANIA cookies live.
 * Fixed in the bottom-right corner. Click the cookie button to toggle.
 * Updates every second so values are always fresh.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2 } from "lucide-react";
import { getAllActivityCookies, clearActivityCookies } from "../data/cookieService";

const C = {
  mocha:     "#3D2B1F",
  champagne: "#F0E6D3",
  gold:      "#C9A96E",
  rose:      "#C4846A",
  linen:     "#FAF6F0",
  white:     "#FFFFFF",
};

interface CookieRow {
  key: string;
  label: string;
  value: string;
}

function formatValue(key: string, raw: string): string {
  if (!raw) return "—";
  if (key === "visitedPages") {
    try {
      const arr = JSON.parse(raw);
      return `${arr.length} page${arr.length !== 1 ? "s" : ""} visited`;
    } catch { return raw; }
  }
  if (key === "sessionStart") {
    try {
      const d = new Date(raw);
      return d.toLocaleTimeString();
    } catch { return raw; }
  }
  return decodeURIComponent(raw);
}

export function CookieInspector() {
  const [open, setOpen] = useState(false);
  const [cookies, setCookies] = useState(getAllActivityCookies());

  // Refresh every second so values stay live
  useEffect(() => {
    const interval = setInterval(() => {
      setCookies(getAllActivityCookies());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const rows: CookieRow[] = [
    { key: "lastVisitedPage",    label: "Last Page",       value: formatValue("lastVisitedPage",    cookies.lastVisitedPage    ?? "") },
    { key: "pageViewCount",      label: "Page Views",      value: formatValue("pageViewCount",      cookies.pageViewCount      ?? "") },
    { key: "sessionStart",       label: "Session Start",   value: formatValue("sessionStart",       cookies.sessionStart       ?? "") },
    { key: "visitedPages",       label: "History",         value: formatValue("visitedPages",       cookies.visitedPages       ?? "") },
    { key: "lastVisitedDressId", label: "Last Dress ID",   value: formatValue("lastVisitedDressId", cookies.lastVisitedDressId ?? "") },
    { key: "preferredMaterial",  label: "Pref. Material",  value: formatValue("preferredMaterial",  cookies.preferredMaterial  ?? "") },
    { key: "lastActionType",     label: "Last Action",     value: formatValue("lastActionType",     cookies.lastActionType     ?? "") },
  ];

  const hasAnyCookie = rows.some((r) => r.value !== "—");

  return (
    <>
      {/* ── Floating button ── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          backgroundColor: C.mocha,
          color: C.champagne,
          fontSize: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(61,43,31,0.35)",
        }}
        title="Cookie Inspector"
      >
        🍪
      </motion.button>

      {/* ── Slide-up panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              bottom: "88px",
              right: "24px",
              zIndex: 9998,
              width: "clamp(280px, 90vw, 340px)",
              backgroundColor: C.white,
              borderRadius: "16px",
              boxShadow: "0 8px 40px rgba(61,43,31,0.18)",
              border: "1px solid rgba(61,43,31,0.08)",
              overflow: "hidden",
              fontFamily: "'Jost', sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: C.mocha }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🍪</span>
                <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "1px", color: C.champagne, textTransform: "uppercase" }}>
                  Cookie Monitor
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(240,230,211,0.6)", display: "flex", padding: "2px" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Cookie rows */}
            <div style={{ padding: "8px 0" }}>
              {rows.map((row, i) => (
                <div key={row.key} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 16px",
                  backgroundColor: i % 2 === 0 ? C.white : "rgba(240,230,211,0.3)",
                  gap: "12px",
                }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.5px", color: "rgba(61,43,31,0.5)", flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontSize: "12px", fontWeight: 500,
                    color: row.value === "—" ? "rgba(61,43,31,0.25)" : C.mocha,
                    textAlign: "right", wordBreak: "break-all",
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(61,43,31,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "rgba(61,43,31,0.35)", letterSpacing: "0.5px" }}>
                Updates every second · 7-day expiry
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { clearActivityCookies(); setCookies(getAllActivityCookies()); }}
                disabled={!hasAnyCookie}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "5px 10px", borderRadius: "20px", border: "none",
                  cursor: hasAnyCookie ? "pointer" : "not-allowed",
                  backgroundColor: hasAnyCookie ? "rgba(196,132,106,0.12)" : "rgba(61,43,31,0.05)",
                  color: hasAnyCookie ? C.rose : "rgba(61,43,31,0.25)",
                  fontSize: "11px", fontFamily: "'Jost', sans-serif", fontWeight: 500,
                }}
              >
                <Trash2 size={11} /> Clear
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}