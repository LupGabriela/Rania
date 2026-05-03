import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sparkles, History } from "lucide-react";

const DEEP_MOCHA = "#3D2B1F";
const CHAMPAGNE = "#F0E6D3";
const LINEN = "#FAF6F0";
const GOLD = "#C9A96E";
const ROSE = "#C4846A";

// Colour palette swatches for the user
const palette = [
  { hex: "#C4846A", label: "Mocha Rose" },
  { hex: "#C9A96E", label: "Antique Gold" },
  { hex: "#E8D0BC", label: "Warm Blush" },
  { hex: "#D4B8C8", label: "Dusty Mauve" },
  { hex: "#A8957A", label: "Caramel" },
];

// Fabric affinity data
const fabrics = [
  { name: "Silk", pct: 70 },
  { name: "Chiffon", pct: 50 },
  { name: "Satin", pct: 30 },
];

// Animated pulsing aura
function Aura() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: "260px", height: "260px" }}>
      {/* Outermost glow ring */}
      <div
        className="absolute"
        style={{
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(201,169,110,0.18) 0%, rgba(196,132,106,0.10) 50%, transparent 75%)",
          animation: "aura-pulse 4s ease-in-out infinite",
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute"
        style={{
          width: "210px",
          height: "210px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 45% 35%, rgba(201,169,110,0.25) 0%, rgba(196,132,106,0.18) 45%, transparent 70%)",
          animation: "aura-pulse 4s ease-in-out infinite 0.5s",
        }}
      />
      {/* Inner core */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 38%, #F0E6D3 0%, #E8C4A8 40%, #C4846A 100%)",
          boxShadow:
            "0 0 60px rgba(201,169,110,0.35), 0 0 30px rgba(196,132,106,0.25), inset 0 0 20px rgba(255,255,255,0.3)",
          animation: "aura-pulse 4s ease-in-out infinite 1s",
        }}
      >
        {/* Decorative inner pattern */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.6) 0%, rgba(240,230,211,0.2) 60%, transparent 100%)",
          }}
        />
      </div>

      <style>{`
        @keyframes aura-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

// Progress bar for fabric affinity
function AffinityBar({ name, pct }: { name: string; pct: number }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="w-16 text-right flex-shrink-0"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "13px",
          color: DEEP_MOCHA,
          fontWeight: 500,
          opacity: 0.85,
        }}
      >
        {name}
      </span>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: "8px", backgroundColor: "rgba(201,169,110,0.15)" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "9999px",
            background: `linear-gradient(90deg, #C9A96E 0%, #C4846A ${pct}%)`,
            boxShadow: "0 0 6px rgba(201,169,110,0.4)",
            transition: "width 1s ease",
          }}
        />
      </div>
      <span
        className="w-9 text-right flex-shrink-0"
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "12px",
          color: GOLD,
          fontWeight: 500,
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

export function StyleSoul() {
  const [generated, setGenerated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: LINEN }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center gap-10">
        {/* ── Page title ── */}
        <div className="text-center">
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              letterSpacing: "3px",
              color: GOLD,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Bazinga Feature
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 5vw, 34px)",
              color: DEEP_MOCHA,
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            Style Soul
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px",
              fontStyle: "italic",
              color: ROSE,
            }}
          >
            Your Living Style Identity
          </p>
        </div>

        {/* ── Aura ── */}
        <div className="flex flex-col items-center gap-5">
          <Aura />

          {/* User name */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              color: DEEP_MOCHA,
              marginTop: "-4px",
              textAlign: "center",
            }}
          >
            Isabelle Laurent
          </h2>

          {/* Style archetype badge */}
          <div
            className="flex items-center gap-2 px-5 py-2"
            style={{
              border: `1.5px solid rgba(196,132,106,0.4)`,
              borderRadius: "30px",
              backgroundColor: "rgba(196,132,106,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "14px",
                fontStyle: "italic",
                color: "rgba(61,43,31,0.5)",
              }}
            >
              You are
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: ROSE,
              }}
            >
              The Romantic
            </span>
          </div>
        </div>

        {/* ── Fabric Affinity ── */}
        <section
          className="w-full p-6 flex flex-col gap-5"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 2px 20px rgba(61,43,31,0.07)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: "4px",
            }}
          >
            Your Fabric Affinity
          </h3>
          {fabrics.map((f) => (
            <AffinityBar key={f.name} name={f.name} pct={f.pct} />
          ))}
        </section>

        {/* ── Colour Palette ── */}
        <section
          className="w-full p-6"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 2px 20px rgba(61,43,31,0.07)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: "20px",
            }}
          >
            Your Colour Palette
          </h3>
          <div className="flex items-end justify-between gap-3">
            {palette.map((swatch) => (
              <div key={swatch.hex} className="flex flex-col items-center gap-2">
                {/* Swatch circle */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: swatch.hex,
                    boxShadow: `0 4px 14px ${swatch.hex}55`,
                    border: "3px solid rgba(255,255,255,0.8)",
                  }}
                />
                {/* Hex label */}
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "9px",
                    color: "rgba(61,43,31,0.5)",
                    letterSpacing: "0.3px",
                    textAlign: "center",
                  }}
                >
                  {swatch.hex}
                </span>
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "9px",
                    color: "rgba(61,43,31,0.35)",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {swatch.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Style Quote ── */}
        <div
          className="w-full px-6 py-5 text-center"
          style={{
            borderTop: `1px solid rgba(201,169,110,0.2)`,
            borderBottom: `1px solid rgba(201,169,110,0.2)`,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "17px",
              fontStyle: "italic",
              color: ROSE,
              lineHeight: 1.7,
            }}
          >
            "You gravitate toward flowing silhouettes in warm tones."
          </p>
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: "rgba(201,169,110,0.7)",
              display: "block",
              marginTop: "8px",
              textTransform: "uppercase",
            }}
          >
            — Your Style Soul analysis
          </span>
        </div>

        {/* ── Micro-insights ── */}
        <div className="w-full grid grid-cols-3 gap-4">
          {[
            { label: "Dresses Viewed", value: "42" },
            { label: "Avg. Price Range", value: "$380" },
            { label: "Orders Placed", value: "3" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center py-4 px-2 text-center"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 1px 10px rgba(61,43,31,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "26px",
                  color: DEEP_MOCHA,
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "1px",
                  color: "rgba(61,43,31,0.5)",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className="w-full flex flex-col items-center gap-4 pb-8">
          <button
            onClick={() => setGenerated(!generated)}
            className="w-full py-4 flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-98"
            style={{
              background: generated
                ? `linear-gradient(135deg, #C9A96E, #C4846A)`
                : `linear-gradient(135deg, #C4846A, #A06848)`,
              color: LINEN,
              fontFamily: "'Jost', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              borderRadius: "40px",
              border: "none",
              cursor: "pointer",
              boxShadow: generated
                ? "0 6px 24px rgba(201,169,110,0.4)"
                : "0 6px 24px rgba(196,132,106,0.4)",
            }}
          >
            <Sparkles size={16} />
            {generated ? "✨ Your Custom Look is Ready!" : "✨ Generate My Custom Look"}
          </button>

          {generated && (
            <div
              className="w-full p-4 text-center"
              style={{
                backgroundColor: "rgba(201,169,110,0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "15px",
                  fontStyle: "italic",
                  color: DEEP_MOCHA,
                  lineHeight: 1.6,
                }}
              >
                We've curated a selection of flowing silk and chiffon dresses in warm champagne and rose tones — crafted just for your Romantic soul.
              </p>
            </div>
          )}

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "12px",
              letterSpacing: "1px",
              color: GOLD,
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationColor: "rgba(201,169,110,0.4)",
              textUnderlineOffset: "3px",
            }}
          >
            <History size={12} />
            View My Style History
          </button>

          {showHistory && (
            <div
              className="w-full p-5"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  color: GOLD,
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Style History
              </p>
              {[
                { date: "Mar 2026", archetype: "The Romantic", shift: "" },
                { date: "Jan 2026", archetype: "The Classic", shift: "→ Shifted toward warmth" },
                { date: "Nov 2025", archetype: "The Minimalist", shift: "→ Embraced softness" },
              ].map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center gap-4 py-2"
                  style={{ borderBottom: "1px solid rgba(61,43,31,0.06)" }}
                >
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "11px",
                      color: "rgba(61,43,31,0.4)",
                      width: "60px",
                      flexShrink: 0,
                    }}
                  >
                    {entry.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "13px",
                      color: DEEP_MOCHA,
                    }}
                  >
                    {entry.archetype}
                  </span>
                  {entry.shift && (
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "11px",
                        fontStyle: "italic",
                        color: ROSE,
                        opacity: 0.7,
                      }}
                    >
                      {entry.shift}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
