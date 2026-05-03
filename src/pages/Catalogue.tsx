import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { ShoppingBag, Heart, SlidersHorizontal } from "lucide-react";
import * as api from "../data/apiClient";
import type { DressRecord } from "../data/apiClient";

const PAGE_SIZE = 6;

export function Catalogue() {
  const navigate = useNavigate();

  const [dresses, setDresses] = useState<DressRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [prefetched, setPrefetched] = useState<DressRecord[] | null>(null);

  const [filterSize, setFilterSize] = useState("All");
  const [filterMaterial, setFilterMaterial] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const allSizes = ["All", "XS", "S", "M", "L", "XL"];
  const allMaterials = ["All", "Silk", "Chiffon", "Satin", "Lace", "Cotton"];
  const priceRanges = ["All", "Under 1000 RON", "1000–2500 RON", "Over 2500 RON"];

  const priceOk = (price: number) => {
    if (filterPrice === "Under 1000 RON") return price < 1000;
    if (filterPrice === "1000–2500 RON") return price >= 1000 && price <= 2500;
    if (filterPrice === "Over 2500 RON") return price > 2500;
    return true;
  };

  const matchesFilters = (d: DressRecord) =>
    (filterSize === "All" || d.sizes.includes(filterSize)) &&
    (filterMaterial === "All" || d.material === filterMaterial) &&
    priceOk(d.price);

  // Load a page from the API
  const loadPage = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      let data: DressRecord[];
      if (pageNum > 1 && prefetched) {
        data = prefetched;
        setPrefetched(null);
      } else {
        const res = await api.fetchDresses(pageNum, PAGE_SIZE);
        data = res.data;
        setHasMore(pageNum < res.totalPages);
      }
      setDresses((prev) => reset ? data : [...prev, ...data]);
      setPage(pageNum);

      // Prefetch next page
      if (pageNum + 1 <= Math.ceil(100 / PAGE_SIZE)) {
        api.fetchDresses(pageNum + 1, PAGE_SIZE)
          .then((res) => { setPrefetched(res.data); setHasMore(pageNum < res.totalPages); })
          .catch(() => {});
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [prefetched]);

  // Initial load
  useEffect(() => {
    setDresses([]);
    setPage(1);
    setHasMore(true);
    setPrefetched(null);
    loadPage(1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll — Intersection Observer on sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadPage(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, page, loadPage]);

  const filtered = dresses.filter(matchesFilters);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCartCount((c) => c + 1);
  };

  const selectStyle = {
    fontFamily: "'Jost', sans-serif",
    fontSize: "12px",
    color: "#3D2B1F",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(61,43,31,0.15)",
    borderRadius: "4px",
    padding: "8px 32px 8px 12px",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar cartCount={cartCount} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", color: "#3D2B1F", marginBottom: "6px" }}>
            Our Collection
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#C4846A" }}>
            {filtered.length} pieces of carefully curated elegance
          </p>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4" style={{ backgroundColor: "#FFFFFF", borderRadius: "4px", boxShadow: "0 2px 8px rgba(61,43,31,0.05)" }}>
          <div className="flex items-center gap-2 mr-2">
            <SlidersHorizontal size={14} style={{ color: "#C4846A" }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1.5px", color: "#3D2B1F", textTransform: "uppercase" }}>Filter</span>
          </div>

          <div className="relative">
            <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)} style={selectStyle}>
              <option value="All">All Sizes</option>
              {allSizes.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#C4846A", fontSize: "8px" }}>▼</span>
          </div>

          <div className="relative">
            <select value={filterMaterial} onChange={(e) => setFilterMaterial(e.target.value)} style={selectStyle}>
              {allMaterials.map((m) => <option key={m} value={m}>{m === "All" ? "All Materials" : m}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#C4846A", fontSize: "8px" }}>▼</span>
          </div>

          <div className="relative">
            <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} style={selectStyle}>
              {priceRanges.map((p) => <option key={p} value={p}>{p === "All" ? "All Prices" : p}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#C4846A", fontSize: "8px" }}>▼</span>
          </div>

          {(filterSize !== "All" || filterMaterial !== "All" || filterPrice !== "All") && (
            <button onClick={() => { setFilterSize("All"); setFilterMaterial("All"); setFilterPrice("All"); }} style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#C4846A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.map((dress) => {
            const inStock = dress.stockQuantity > 0;
            return (
              <div
                key={dress.id}
                className="group cursor-pointer"
                style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 12px rgba(61,43,31,0.06)", overflow: "hidden" }}
                onClick={() => navigate(`/dress-manager/${dress.id}`)}
              >
                <div className="relative overflow-hidden h-72">
                  <img src={dress.imageUrl} alt={dress.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <button
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer" }}
                    onClick={(e) => toggleWishlist(dress.id, e)}
                  >
                    <Heart size={14} style={{ color: wishlist.includes(dress.id) ? "#C4846A" : "#3D2B1F", fill: wishlist.includes(dress.id) ? "#C4846A" : "none" }} />
                  </button>

                  {!inStock && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(61,43,31,0.5)" }}>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#FAF6F0", textTransform: "uppercase", backgroundColor: "#3D2B1F", padding: "6px 16px" }}>Out of Stock</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {dress.sizes.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5" style={{ backgroundColor: "rgba(255,255,255,0.85)", fontFamily: "'Jost', sans-serif", fontSize: "9px", color: "#3D2B1F", borderRadius: "2px" }}>{s}</span>
                    ))}
                    {dress.sizes.length > 3 && <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.8)" }}>+{dress.sizes.length - 3}</span>}
                  </div>
                </div>

                <div className="p-4">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#3D2B1F", marginBottom: "4px" }}>{dress.name}</h3>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "rgba(61,43,31,0.5)", marginBottom: "2px" }}>{dress.material}</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 500, color: "#C9A96E", marginBottom: "12px" }}>{dress.price.toLocaleString("ro-RO")} RON</p>
                  <button
                    className="w-full py-2.5 flex items-center justify-center gap-2"
                    style={{ backgroundColor: inStock ? "#C4846A" : "#D1C3B8", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "20px", border: "none", cursor: inStock ? "pointer" : "not-allowed" }}
                    onClick={addToCart}
                    disabled={!inStock}
                  >
                    <ShoppingBag size={12} />
                    {inStock ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading && <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "rgba(61,43,31,0.4)", letterSpacing: "1px" }}>Loading more…</span>}
          {!loading && !hasMore && dresses.length > 0 && <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "14px", color: "rgba(61,43,31,0.35)" }}>End of collection</span>}
        </div>
      </div>
    </div>
  );
}
