/**
 * Navbar — RANIA global navigation bar.
 * Uses CSS variables defined in theme.css for all colours and fonts.
 */

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  ChevronDown,
  BarChart2,
  Sparkles,
  LayoutGrid,
  TableProperties,
} from "lucide-react";

// ── Style definitions (visual layer) ─────────────────────────────────────────

const S = {
  nav: {
    width: "100%",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "62px",
    backgroundColor: "var(--color-deep-mocha)",
  },
  logo: {
    fontFamily: "var(--font-serif)",
    fontSize: "26px",
    fontWeight: 700,
    color: "var(--color-champagne)",
    textDecoration: "none",
    flexShrink: 0,
    letterSpacing: "1px",
    transition: "color 0.15s",
  },
  linkActive: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    letterSpacing: "0.5px",
    color: "var(--color-antique-gold)",
    textDecoration: "none",
  },
  linkInactive: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    letterSpacing: "0.5px",
    color: "rgba(240,230,211,0.7)",
    textDecoration: "none",
    transition: "color 0.15s",
  },
  dropdown: {
    position: "absolute" as const,
    top: "calc(100% + 10px)",
    left: "50%",
    transform: "translateX(-50%)",
    minWidth: "168px",
    backgroundColor: "#2E1F14",
    borderRadius: "10px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.28)",
    border: "1px solid rgba(240,230,211,0.08)",
    padding: "6px 0",
    zIndex: 100,
  },
  dropdownLink: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "10px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: "rgba(240,230,211,0.8)",
    textDecoration: "none",
    transition: "background 0.12s",
    cursor: "pointer",
  },
  dropdownLinkActive: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "10px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: "var(--color-antique-gold)",
    textDecoration: "none",
    cursor: "pointer",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(240,230,211,0.7)",
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
    padding: "4px",
  },
  signInBtn: {
    padding: "7px 18px",
    borderRadius: "30px",
    backgroundColor: "var(--color-mocha-rose)",
    color: "var(--color-linen-white)",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.3px",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  mobileMenu: {
    position: "absolute" as const,
    top: "62px",
    left: 0,
    right: 0,
    backgroundColor: "var(--color-deep-mocha)",
    borderTop: "1px solid rgba(240,230,211,0.08)",
    padding: "8px 24px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    zIndex: 49,
  },
  mobileLink: {
    padding: "12px 0",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "rgba(240,230,211,0.85)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(240,230,211,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  mobileLinkActive: {
    padding: "12px 0",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-antique-gold)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(240,230,211,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
} as const;

interface NavbarProps {
  cartCount?: number;
}

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const mainLinks = [
    { label: "Shop",         href: "/catalogue" },
    { label: "Custom Order", href: "/custom-order" },
    { label: "Try-On",       href: "/try-on" },
    { label: "My Orders",    href: "/my-orders" },
    { label: "Dress Manager",href: "/dress-manager", icon: TableProperties },
  ];

  const moreLinks = [
    { label: "Analytics",   href: "/analytics",        icon: BarChart2 },
    { label: "Design Lab",  href: "/catalogue-design",  icon: LayoutGrid },
    { label: "Style Soul",  href: "/style-soul",        icon: Sparkles },
  ];

  const isActive = (href: string) =>
    location.pathname === href ||
    (href !== "/" && location.pathname.startsWith(href));

  return (
    <nav style={S.nav}>
      {/* Logo */}
      <Link to="/" style={S.logo}>
        RANIA
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              style={isActive(link.href) ? S.linkActive : S.linkInactive}
            >
              {link.label}
            </Link>
          );
        })}

        {/* More dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              letterSpacing: "0.5px",
              color: moreLinks.some((l) => isActive(l.href))
                ? "var(--color-antique-gold)"
                : "rgba(240,230,211,0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: 0,
            }}
            onClick={() => setMoreOpen((o) => !o)}
          >
            More
            <ChevronDown
              size={11}
              style={{
                transition: "transform 0.2s",
                transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {moreOpen && (
            <div style={S.dropdown}>
              {moreLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    style={
                      isActive(link.href)
                        ? S.dropdownLinkActive
                        : S.dropdownLink
                    }
                    onClick={() => setMoreOpen(false)}
                    onMouseEnter={(e) => {
                      if (!isActive(link.href))
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "rgba(240,230,211,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <Icon size={13} style={{ opacity: 0.65 }} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right icons (desktop) */}
      <div className="hidden md:flex items-center gap-4">
        <button
          style={S.iconBtn}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "var(--color-antique-gold)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(240,230,211,0.7)")
          }
          onClick={() => navigate("/catalogue")}
          title="Wishlist"
        >
          <Heart size={17} />
        </button>

        <button
          style={{ ...S.iconBtn, position: "relative" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "var(--color-antique-gold)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(240,230,211,0.7)")
          }
          onClick={() => navigate("/catalogue")}
          title="Cart"
        >
          <ShoppingBag size={17} />
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: "var(--color-mocha-rose)",
                color: "var(--color-linen-white)",
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        <button
          style={S.signInBtn}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "1")
          }
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden"
        style={{ ...S.iconBtn, color: "var(--color-champagne)" }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={S.mobileMenu}>
          {[...mainLinks, ...moreLinks].map((link) => {
            const Icon = "icon" in link ? link.icon : undefined;
            return (
              <Link
                key={link.href}
                to={link.href}
                style={
                  isActive(link.href) ? S.mobileLinkActive : S.mobileLink
                }
                onClick={() => setMenuOpen(false)}
              >
                {Icon && <Icon size={14} style={{ opacity: 0.6 }} />}
                {link.label}
              </Link>
            );
          })}
          <button
            style={{
              ...S.signInBtn,
              marginTop: "10px",
              width: "100%",
              padding: "12px",
            }}
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
