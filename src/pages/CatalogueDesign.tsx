import { Navbar } from "../components/Navbar";

const DEEP_MOCHA = "#3D2B1F";
const CHAMPAGNE = "#F0E6D3";
const LINEN = "#FAF6F0";
const GOLD = "#C9A96E";
const ROSE = "#C4846A";

// 6 mini dress cards data
const miniDresses = [
  {
    name: "Florentine Bloom",
    price: "$285",
    color: "#E8D5C8",
    img: "https://images.unsplash.com/photo-1761574039846-a320885dd8f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  },
  {
    name: "Seraphine Gown",
    price: "$520",
    color: "#D5C8E0",
    img: "https://images.unsplash.com/photo-1756483509162-b92ea967a884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  },
  {
    name: "Celestine Lace",
    price: "$680",
    color: "#E8E0D0",
    img: "https://images.unsplash.com/photo-1765871903122-d6e7cdb1c020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  },
  {
    name: "Aria Pastel Maxi",
    price: "$320",
    color: "#D5E0D8",
    img: "https://images.unsplash.com/photo-1702116135477-4a1477368ca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  },
  {
    name: "Rouge Soir",
    price: "$445",
    color: "#E0D5D5",
    img: "https://images.unsplash.com/photo-1765229279946-f265fa703385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  },
  {
    name: "Azura Satin",
    price: "$390",
    color: "#D5DCE8",
    img: "https://images.unsplash.com/photo-1704775983177-8ae543524081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
  },
];

// Reusable tiny dress card
function TinyCard({
  dress,
  dark = false,
  featured = false,
}: {
  dress: (typeof miniDresses)[0];
  dark?: boolean;
  featured?: boolean;
}) {
  return (
    <div
      className="overflow-hidden flex flex-col"
      style={{
        backgroundColor: dark ? DEEP_MOCHA : "#FFFFFF",
        borderRadius: "6px",
        boxShadow: dark
          ? "0 4px 20px rgba(61,43,31,0.25)"
          : "0 1px 8px rgba(61,43,31,0.08)",
        height: "100%",
      }}
    >
      <div
        className="overflow-hidden"
        style={{ height: featured ? "130px" : "76px", flexShrink: 0 }}
      >
        <img
          src={dress.img}
          alt={dress.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-2 py-1.5 flex flex-col flex-1 justify-center">
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: featured ? "9px" : "7px",
            color: dark ? CHAMPAGNE : DEEP_MOCHA,
            lineHeight: 1.3,
          }}
        >
          {dress.name}
        </p>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "7px",
            color: dark ? GOLD : ROSE,
            marginTop: "1px",
          }}
        >
          {dress.price}
        </p>
      </div>
    </div>
  );
}

// ─── VERSION A: Unity — uniform 2×3 grid ─────────────────────
function VersionA() {
  return (
    <div
      className="p-3 grid gap-2"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
    >
      {miniDresses.map((d) => (
        <TinyCard key={d.name} dress={d} />
      ))}
    </div>
  );
}

// ─── VERSION B: Dichotomy — 1 big hero + 4 small ─────────────
function VersionB() {
  return (
    <div
      className="p-3"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
    >
      {/* Featured — spans 2 cols */}
      <div style={{ gridColumn: "1 / -1" }}>
        <div
          className="overflow-hidden relative"
          style={{
            backgroundColor: DEEP_MOCHA,
            borderRadius: "6px",
            height: "130px",
            boxShadow: "0 4px 20px rgba(61,43,31,0.3)",
          }}
        >
          <img
            src={miniDresses[0].img}
            alt={miniDresses[0].name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-3">
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "7px",
                letterSpacing: "2px",
                color: GOLD,
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              Featured Dress
            </span>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "11px",
                color: CHAMPAGNE,
              }}
            >
              {miniDresses[0].name}
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "8px",
                color: GOLD,
              }}
            >
              {miniDresses[0].price}
            </p>
          </div>
        </div>
      </div>
      {/* Small cards */}
      {miniDresses.slice(2, 6).map((d) => (
        <TinyCard key={d.name} dress={d} />
      ))}
    </div>
  );
}

// ─── VERSION C: Symmetry — diagonal balance ─────────────────
function VersionC() {
  return (
    <div className="p-3 flex flex-col gap-2">
      {/* FEATURED banner */}
      <div
        className="flex items-center justify-center py-1.5"
        style={{
          backgroundColor: GOLD,
          borderRadius: "3px",
        }}
      >
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "7px",
            letterSpacing: "3px",
            color: DEEP_MOCHA,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          ✦ Featured Collection ✦
        </span>
      </div>

      {/* Top row — Featured left + 2 small right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: "6px",
        }}
      >
        {/* Top-left featured */}
        <div
          className="overflow-hidden relative"
          style={{
            backgroundColor: DEEP_MOCHA,
            borderRadius: "6px",
            gridRow: "1 / 3",
            minHeight: "110px",
            boxShadow: "0 4px 18px rgba(61,43,31,0.28)",
          }}
        >
          <img
            src={miniDresses[0].img}
            alt={miniDresses[0].name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-2">
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "6px",
                letterSpacing: "2px",
                color: GOLD,
                textTransform: "uppercase",
              }}
            >
              Featured
            </span>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "9px",
                color: CHAMPAGNE,
              }}
            >
              {miniDresses[0].name}
            </p>
          </div>
        </div>
        <TinyCard dress={miniDresses[1]} />
        <TinyCard dress={miniDresses[2]} />
        <TinyCard dress={miniDresses[3]} />
        <TinyCard dress={miniDresses[4]} />
      </div>

      {/* Bottom row — 2 small left + Featured right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.4fr",
          gap: "6px",
          marginTop: "0px",
        }}
      >
        {/* placeholder to push featured to right */}
        <div style={{ display: "contents" }}>
          {/* We already rendered the top section, now bottom featured */}
        </div>
        {/* Bottom-right featured — diagonal of top-left */}
        <div
          className="overflow-hidden relative"
          style={{
            backgroundColor: DEEP_MOCHA,
            borderRadius: "6px",
            minHeight: "74px",
            gridColumn: "3 / 4",
            boxShadow: "0 4px 18px rgba(61,43,31,0.28)",
          }}
        >
          <img
            src={miniDresses[5].img}
            alt={miniDresses[5].name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-2">
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "6px",
                letterSpacing: "2px",
                color: GOLD,
                textTransform: "uppercase",
              }}
            >
              Featured
            </span>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "9px",
                color: CHAMPAGNE,
              }}
            >
              {miniDresses[5].name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────── Frame (simulated phone/screen shell) ──────────────
function ScreenFrame({
  title,
  subtitle,
  principle,
  children,
}: {
  title: string;
  subtitle: string;
  principle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label above */}
      <div className="text-center">
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            color: DEEP_MOCHA,
          }}
        >
          {title}
        </span>
      </div>

      {/* Screen shell */}
      <div
        className="w-full overflow-hidden"
        style={{
          backgroundColor: LINEN,
          borderRadius: "12px",
          boxShadow: "0 8px 40px rgba(61,43,31,0.14)",
          border: "1px solid rgba(61,43,31,0.08)",
          minHeight: "420px",
        }}
      >
        {/* Mini navbar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: DEEP_MOCHA }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "13px",
              color: CHAMPAGNE,
              letterSpacing: "1px",
            }}
          >
            RANIA
          </span>
          <div className="flex gap-2">
            {["Shop", "Custom"].map((l) => (
              <span
                key={l}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "7px",
                  letterSpacing: "1px",
                  color: "rgba(240,230,211,0.6)",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Mini page heading */}
        <div className="px-3 pt-3 pb-1">
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "11px",
              color: DEEP_MOCHA,
              marginBottom: "2px",
            }}
          >
            Our Collection
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "8px",
              fontStyle: "italic",
              color: ROSE,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Content */}
        {children}
      </div>

      {/* Principle tag */}
      <div className="text-center px-2">
        <span
          className="inline-block px-4 py-1.5"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            color: ROSE,
            backgroundColor: "rgba(196,132,106,0.1)",
            borderRadius: "20px",
            border: `1px solid rgba(196,132,106,0.25)`,
          }}
        >
          {principle}
        </span>
      </div>
    </div>
  );
}

// ────────── main component ──────────
export function CatalogueDesign() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: LINEN }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "11px",
              letterSpacing: "3px",
              color: GOLD,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Design Principle Evolution
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              color: DEEP_MOCHA,
              marginBottom: "8px",
            }}
          >
            Catalogue Redesign
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "18px",
              fontStyle: "italic",
              color: ROSE,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            How unity, dichotomy, and symmetry shape visual hierarchy
          </p>
        </div>

        {/* Principle legend bar */}
        <div
          className="flex items-center justify-center gap-8 mb-10 flex-wrap"
        >
          {[
            { label: "Unity", dot: GOLD, desc: "harmony through consistency" },
            { label: "Dichotomy", dot: ROSE, desc: "tension through contrast" },
            { label: "Symmetry", dot: DEEP_MOCHA, desc: "balance restores order" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.dot }}
              />
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: DEEP_MOCHA,
                }}
              >
                {p.label}
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "rgba(61,43,31,0.5)",
                }}
              >
                — {p.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Three versions side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Version A */}
          <ScreenFrame
            title="Version A"
            subtitle="Curated elegance for every occasion"
            principle="Unity — harmony through consistency"
          >
            <VersionA />
          </ScreenFrame>

          {/* Version B */}
          <ScreenFrame
            title="Version B"
            subtitle="Our featured piece & collection"
            principle="Dichotomy — breaks balance"
          >
            <VersionB />
          </ScreenFrame>

          {/* Version C */}
          <ScreenFrame
            title="Version C"
            subtitle="Featured & curated with intention"
            principle="Symmetry restores Balance"
          >
            <VersionC />
          </ScreenFrame>
        </div>

        {/* Explanation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              version: "A",
              title: "Unity",
              color: GOLD,
              body: "Every card is the same size, colour, and weight. The grid feels orderly and consistent. Unity creates harmony but can feel static — no single element draws the eye.",
            },
            {
              version: "B",
              title: "Dichotomy",
              color: ROSE,
              body: "The first dress breaks the grid by spanning two columns with a deep mocha background. Strong contrast is created, but the heavy element sits only on the top-left — visual imbalance results.",
            },
            {
              version: "C",
              title: "Symmetry",
              color: DEEP_MOCHA,
              body: "A second featured card anchors the bottom-right, creating diagonal symmetry. The Antique Gold banner connects both featured items. The composition is balanced yet dynamic.",
            },
          ].map((card) => (
            <div
              key={card.version}
              className="p-6"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 2px 16px rgba(61,43,31,0.07)",
                borderTop: `3px solid ${card.color}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: card.color,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "14px",
                    color: card.version === "C" ? CHAMPAGNE : DEEP_MOCHA,
                  }}
                >
                  {card.version}
                </span>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    color: DEEP_MOCHA,
                  }}
                >
                  {card.title}
                </h3>
              </div>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  color: DEEP_MOCHA,
                  lineHeight: 1.75,
                  opacity: 0.8,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
