import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Trash2, Package, Tag, Layers, Star } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { DeleteModal } from "../components/DeleteModal";
import * as api from "../data/apiClient";
import type { DressRecord, Review } from "../data/apiClient";

const S = {
  page: { minHeight: "100vh", backgroundColor: "var(--color-linen-white)", fontFamily: "var(--font-body)" },
  container: { maxWidth: "960px", margin: "0 auto", padding: "40px 24px 60px" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap" as const, gap: "12px" },
  btnBack: { display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "30px", border: "1.5px solid rgba(61,43,31,0.18)", cursor: "pointer", backgroundColor: "transparent", color: "var(--color-deep-mocha)", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, transition: "all 0.15s" },
  actionGroup: { display: "flex", gap: "10px" },
  btnEdit: { display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "30px", border: "none", cursor: "pointer", backgroundColor: "rgba(201,169,110,0.15)", color: "var(--color-antique-gold)", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, transition: "background 0.15s" },
  btnDelete: { display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "30px", border: "none", cursor: "pointer", backgroundColor: "rgba(196,132,106,0.15)", color: "var(--color-mocha-rose)", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, transition: "background 0.15s" },
  card: { backgroundColor: "#FFFFFF", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 30px rgba(61,43,31,0.09)", display: "grid", gap: 0 } as const,
  imageBlock: { position: "relative" as const, height: "500px", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" as const },
  imageFallback: { width: "100%", height: "100%", backgroundColor: "var(--color-champagne)", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "12px" },
  idOverlay: { position: "absolute" as const, top: "16px", left: "16px", padding: "4px 10px", borderRadius: "6px", backgroundColor: "rgba(61,43,31,0.6)", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-champagne)", letterSpacing: "0.5px" },
  infoBlock: { padding: "36px 40px", display: "flex", flexDirection: "column" as const },
  dressName: { fontFamily: "var(--font-serif)", fontSize: "36px", color: "var(--color-deep-mocha)", lineHeight: 1.15, marginBottom: "12px" },
  price: { fontFamily: "var(--font-body)", fontSize: "24px", fontWeight: 600, color: "var(--color-antique-gold)", marginBottom: "24px" },
  divider: { height: "1px", backgroundColor: "rgba(61,43,31,0.07)", margin: "20px 0" },
  metaRow: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" },
  metaIcon: { marginTop: "1px", flexShrink: 0, color: "var(--color-antique-gold)" },
  metaLabel: { fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const, color: "rgba(61,43,31,0.45)", marginBottom: "4px", display: "block" },
  metaValue: { fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-deep-mocha)" },
  materialPill: { display: "inline-block", padding: "4px 14px", borderRadius: "20px", backgroundColor: "rgba(201,169,110,0.12)", color: "var(--color-antique-gold)", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500 },
  sizesWrap: { display: "flex", gap: "6px", flexWrap: "wrap" as const },
  sizePill: { padding: "5px 14px", borderRadius: "20px", border: "1.5px solid var(--color-mocha-rose)", color: "var(--color-mocha-rose)", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500 },
  descLabel: { fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const, color: "rgba(61,43,31,0.45)", marginBottom: "10px", display: "block" },
  descText: { fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--color-deep-mocha)", lineHeight: 1.8, opacity: 0.85 },
  notFound: { textAlign: "center" as const, padding: "80px 24px" },
} as const;

// ── Reviews section ───────────────────────────────────────────────────────────

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <Star size={18} style={{ fill: i <= value ? "#C9A96E" : "transparent", color: i <= value ? "#C9A96E" : "#D1C3B8" }} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, onDelete, onEdit }: { review: Review; onDelete: () => void; onEdit: () => void }) {
  return (
    <div style={{ backgroundColor: "#FAF6F0", borderRadius: "10px", padding: "16px 20px", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-deep-mocha)" }}>{review.author}</span>
          <div style={{ display: "flex", gap: "2px", marginTop: "3px" }}>
            {[1,2,3,4,5].map((i) => <Star key={i} size={12} style={{ fill: i <= review.rating ? "#C9A96E" : "transparent", color: i <= review.rating ? "#C9A96E" : "#D1C3B8" }} />)}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-antique-gold)", fontSize: "12px", fontFamily: "var(--font-body)" }}>Edit</button>
          <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-mocha-rose)", fontSize: "12px", fontFamily: "var(--font-body)" }}>Delete</button>
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-deep-mocha)", lineHeight: 1.7, margin: 0, opacity: 0.85 }}>{review.comment}</p>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(61,43,31,0.4)", marginTop: "6px", display: "block" }}>{new Date(review.createdAt).toLocaleDateString("ro-RO")}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DressManagerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dress, setDress] = useState<DressRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ author: "", rating: 5, comment: "" });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.fetchDress(id).then(setDress).catch(() => setDress(null)).finally(() => setLoading(false));
    api.fetchReviews(id).then(setReviews).catch(() => {});
  }, [id]);

  async function handleConfirmDelete() {
    if (!dress) return;
    await api.deleteDress(dress.id).catch(() => {});
    navigate("/dress-manager");
  }

  async function handleReviewSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReviewError("");
    if (!reviewForm.author.trim() || reviewForm.author.trim().length < 2) { setReviewError("Author must be at least 2 characters."); return; }
    if (!reviewForm.comment.trim() || reviewForm.comment.trim().length < 5) { setReviewError("Comment must be at least 5 characters."); return; }

    try {
      if (editingReview) {
        const updated = await api.updateReview(editingReview.id, reviewForm);
        setReviews((prev) => prev.map((r) => r.id === editingReview.id ? updated : r));
        setEditingReview(null);
      } else {
        const created = await api.createReview(id!, reviewForm);
        setReviews((prev) => [...prev, created]);
      }
      setReviewForm({ author: "", rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed to save review.");
    }
  }

  async function handleDeleteReview(reviewId: string) {
    await api.deleteReview(reviewId).catch(() => {});
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }

  function startEdit(review: Review) {
    setEditingReview(review);
    setReviewForm({ author: review.author, rating: review.rating, comment: review.comment });
  }

  if (loading) return <div style={S.page}><Navbar /><div style={{ textAlign: "center", padding: "80px", fontFamily: "var(--font-body)", color: "rgba(61,43,31,0.5)" }}>Loading…</div></div>;

  if (!dress) {
    return (
      <div style={S.page}><Navbar />
        <div style={S.container}>
          <div style={S.notFound}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "var(--color-deep-mocha)", marginBottom: "12px" }}>Dress Not Found</h2>
            <button style={{ ...S.btnBack, marginTop: "20px", display: "inline-flex" }} onClick={() => navigate("/dress-manager")}><ArrowLeft size={14} /> Back to Manager</button>
          </div>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.container}>
        {/* Top bar */}
        <div style={S.topBar}>
          <button style={S.btnBack} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(61,43,31,0.04)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")} onClick={() => navigate("/dress-manager")}>
            <ArrowLeft size={14} /> Back to Manager
          </button>
          <div style={S.actionGroup}>
            <button style={S.btnEdit} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,169,110,0.25)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,169,110,0.15)")} onClick={() => navigate(`/dress-manager/${dress.id}/edit`)}>
              <Pencil size={13} /> Edit
            </button>
            <button style={S.btnDelete} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,132,106,0.25)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(196,132,106,0.15)")} onClick={() => setShowDelete(true)}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {/* Detail card */}
        <div style={{ ...S.card, gridTemplateColumns: "clamp(240px,35%,360px) 1fr" }}>
          <div style={S.imageBlock}>
            {dress.imageUrl ? (
              <img src={dress.imageUrl} alt={dress.name} style={S.image} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div style={S.imageFallback}><Package size={36} color="rgba(61,43,31,0.25)" /></div>
            )}
            <div style={S.idOverlay}>#{dress.id}</div>
          </div>
          <div style={S.infoBlock}>
            <h1 style={S.dressName}>{dress.name}</h1>
            <p style={S.price}>{dress.price.toLocaleString("ro-RO")} RON</p>
            <div style={S.divider} />
            <div style={S.metaRow}>
              <Layers size={15} style={S.metaIcon} />
              <div><span style={S.metaLabel}>Material</span><span style={S.materialPill}>{dress.material}</span></div>
            </div>
            <div style={S.metaRow}>
              <Tag size={15} style={S.metaIcon} />
              <div><span style={S.metaLabel}>Sizes Available</span>
                <div style={S.sizesWrap}>{dress.sizes.map((s) => <span key={s} style={S.sizePill}>{s}</span>)}</div>
              </div>
            </div>
            <div style={S.metaRow}>
              <Package size={15} style={S.metaIcon} />
              <div><span style={S.metaLabel}>Stock Quantity</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: dress.stockQuantity === 0 ? "#B07070" : "var(--color-deep-mocha)", fontWeight: dress.stockQuantity === 0 ? 500 : 400 }}>
                  {dress.stockQuantity === 0 ? "Out of stock" : `${dress.stockQuantity} units`}
                </span>
              </div>
            </div>
            <div style={S.divider} />
            <span style={S.descLabel}>Description</span>
            <p style={S.descText}>{dress.description}</p>
            {avgRating && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#C9A96E", marginTop: "12px" }}>★ {avgRating} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>}
          </div>
        </div>

        {/* Reviews section */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", color: "var(--color-deep-mocha)", marginBottom: "24px" }}>
            Customer Reviews {reviews.length > 0 && <span style={{ fontSize: "16px", color: "rgba(61,43,31,0.5)", fontFamily: "var(--font-body)" }}>({reviews.length})</span>}
          </h2>

          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onDelete={() => handleDeleteReview(r.id)} onEdit={() => startEdit(r)} />
          ))}
          {reviews.length === 0 && <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "rgba(61,43,31,0.4)", fontSize: "15px", marginBottom: "24px" }}>No reviews yet. Be the first!</p>}

          {/* Review form */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", padding: "28px 32px", boxShadow: "0 2px 20px rgba(61,43,31,0.07)", marginTop: "16px" }}>
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const, color: "var(--color-antique-gold)", marginBottom: "20px" }}>
              {editingReview ? "Edit Review" : "Add a Review"}
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" as const, color: "var(--color-deep-mocha)", marginBottom: "6px" }}>Author</label>
                <input value={reviewForm.author} onChange={(e) => setReviewForm((p) => ({ ...p, author: e.target.value }))} placeholder="Your name" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(61,43,31,0.14)", fontFamily: "var(--font-body)", fontSize: "14px", boxSizing: "border-box" as const, backgroundColor: "var(--color-champagne)" }} />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" as const, color: "var(--color-deep-mocha)", marginBottom: "6px" }}>Rating</label>
                <StarPicker value={reviewForm.rating} onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))} />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" as const, color: "var(--color-deep-mocha)", marginBottom: "6px" }}>Comment</label>
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} placeholder="Share your experience…" rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(61,43,31,0.14)", fontFamily: "var(--font-body)", fontSize: "14px", resize: "vertical" as const, boxSizing: "border-box" as const, backgroundColor: "var(--color-champagne)" }} />
              </div>
              {reviewError && <p style={{ color: "var(--color-mocha-rose)", fontFamily: "var(--font-body)", fontSize: "12px", marginBottom: "12px" }}>{reviewError}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ padding: "10px 24px", borderRadius: "30px", border: "none", cursor: "pointer", backgroundColor: "var(--color-mocha-rose)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500 }}>
                  {editingReview ? "Update" : "Submit Review"}
                </button>
                {editingReview && (
                  <button type="button" onClick={() => { setEditingReview(null); setReviewForm({ author: "", rating: 5, comment: "" }); }} style={{ padding: "10px 24px", borderRadius: "30px", border: "1.5px solid rgba(61,43,31,0.2)", cursor: "pointer", backgroundColor: "transparent", color: "var(--color-deep-mocha)", fontFamily: "var(--font-body)", fontSize: "13px" }}>Cancel</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {showDelete && <DeleteModal dressName={dress.name} onConfirm={handleConfirmDelete} onCancel={() => setShowDelete(false)} />}
    </div>
  );
}
