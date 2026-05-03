/**
 * DressManager — Master View
 * Paginated table of all dresses with CRUD actions.
 * Visual styles are separated into the `S` style object.
 * Data lives exclusively in the in-memory store.
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight, Eye, Zap, ZapOff } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { DeleteModal } from "../components/DeleteModal";
import type { DressRecord } from "../data/apiClient";
import { useDresses } from "../hooks/useDresses";
import { useWebSocket } from "../hooks/useWebSocket";
import { startGenerator, stopGenerator } from "../data/apiClient";

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

// ── Style definitions (visual layer) ─────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--color-linen-white)",
    fontFamily: "var(--font-body)",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "32px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  titleBlock: {} as const,
  pageTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "34px",
    color: "var(--color-deep-mocha)",
    lineHeight: 1.1,
    marginBottom: "5px",
  },
  pageSubtitle: {
    fontFamily: "var(--font-display)",
    fontSize: "15px",
    fontStyle: "italic" as const,
    color: "var(--color-mocha-rose)",
  },
  btnAdd: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 22px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "var(--color-mocha-rose)",
    color: "var(--color-linen-white)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.5px",
    transition: "opacity 0.2s",
    whiteSpace: "nowrap" as const,
  },
  tableWrap: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 30px rgba(61,43,31,0.09)",
    border: "1px solid rgba(61,43,31,0.07)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  thead: {
    backgroundColor: "var(--color-deep-mocha)",
  },
  th: {
    padding: "14px 16px",
    textAlign: "left" as const,
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--color-champagne)",
    whiteSpace: "nowrap" as const,
  },
  thCenter: {
    padding: "14px 16px",
    textAlign: "center" as const,
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--color-champagne)",
  },
  tdBase: {
    padding: "13px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "var(--color-deep-mocha)",
    borderBottom: "1px solid rgba(61,43,31,0.05)",
    verticalAlign: "middle" as const,
  },
  tdCenter: {
    padding: "13px 16px",
    textAlign: "center" as const,
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "var(--color-deep-mocha)",
    borderBottom: "1px solid rgba(61,43,31,0.05)",
    verticalAlign: "middle" as const,
  },
  dressNameLink: {
    fontFamily: "var(--font-serif)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    cursor: "pointer",
    textDecoration: "underline",
    textDecorationColor: "rgba(61,43,31,0.2)",
    textUnderlineOffset: "3px",
    background: "none",
    border: "none",
    padding: 0,
    textAlign: "left" as const,
  },
  idBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    backgroundColor: "rgba(61,43,31,0.06)",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    color: "rgba(61,43,31,0.6)",
    letterSpacing: "0.5px",
  },
  materialTag: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    backgroundColor: "rgba(201,169,110,0.12)",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    color: "var(--color-antique-gold)",
    fontWeight: 500,
  },
  sizesWrap: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap" as const,
  },
  sizeTag: {
    padding: "2px 7px",
    borderRadius: "4px",
    border: "1px solid rgba(196,132,106,0.4)",
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    color: "var(--color-mocha-rose)",
  },
  stockZero: {
    color: "#B07070",
    fontWeight: 500,
  },
  actionWrap: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  btnView: {
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(61,43,31,0.06)",
    color: "var(--color-deep-mocha)",
    display: "flex",
    alignItems: "center",
    transition: "background 0.15s",
  },
  btnEdit: {
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(201,169,110,0.12)",
    color: "var(--color-antique-gold)",
    display: "flex",
    alignItems: "center",
    transition: "background 0.15s",
  },
  btnDelete: {
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(196,132,106,0.12)",
    color: "var(--color-mocha-rose)",
    display: "flex",
    alignItems: "center",
    transition: "background 0.15s",
  },
  emptyRow: {
    padding: "48px 16px",
    textAlign: "center" as const,
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontStyle: "italic" as const,
    color: "rgba(61,43,31,0.4)",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "20px",
    flexWrap: "wrap" as const,
    gap: "12px",
  },
  pageInfo: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: "rgba(61,43,31,0.5)",
    letterSpacing: "0.3px",
  },
  pageControls: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnPage: {
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(61,43,31,0.15)",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "var(--color-deep-mocha)",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.15s",
  },
  btnPageDisabled: {
    padding: "7px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(61,43,31,0.08)",
    cursor: "not-allowed",
    backgroundColor: "transparent",
    color: "rgba(61,43,31,0.3)",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  pageNum: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
} as const;

// ── Helper: row background ────────────────────────────────────────────────────

function rowBg(idx: number): string {
  return idx % 2 === 0 ? "#FFFFFF" : "rgba(240,230,211,0.35)";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DressManager() {
  const { dresses, isOnline, isLoading, pendingCount, remove, addFromServer } = useDresses();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<DressRecord | null>(null);
  const [generatorRunning, setGeneratorRunning] = useState(false);

  useWebSocket({ onDressAdded: addFromServer });

  const totalPages = Math.max(1, Math.ceil(dresses.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageDresses = dresses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleDelete(dress: DressRecord) { setDeleteTarget(dress); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    const newTotal = Math.max(1, Math.ceil((dresses.length - 1) / PAGE_SIZE));
    if (safePage > newTotal) setPage(newTotal);
    setDeleteTarget(null);
  }

  async function toggleGenerator() {
    if (generatorRunning) {
      await stopGenerator().catch(() => {});
      setGeneratorRunning(false);
    } else {
      await startGenerator(3000).catch(() => {});
      setGeneratorRunning(true);
    }
  }

  function pageNumbers(): number[] {
    const nums: number[] = [];
    for (let i = 1; i <= totalPages; i++) nums.push(i);
    return nums;
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <Navbar />

      {/* Offline banner */}
      {!isOnline && (
        <div style={{ background: "#C4846A", color: "#fff", textAlign: "center", padding: "8px", fontSize: "13px", fontFamily: "var(--font-body)" }}>
          You are offline — changes are saved locally and will sync when reconnected.
          {pendingCount > 0 && ` (${pendingCount} pending)`}
        </div>
      )}

      <div style={S.container}>
        {/* Header */}
        <div style={S.pageHeader}>
          <div style={S.titleBlock}>
            <h1 style={S.pageTitle}>Dress Manager</h1>
            <p style={S.pageSubtitle}>
              {isLoading ? "Loading…" : `${dresses.length} ${dresses.length === 1 ? "dress" : "dresses"} in collection`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
            <button
              style={{ ...S.btnAdd, backgroundColor: generatorRunning ? "#8B5E3C" : "var(--color-antique-gold)" }}
              onClick={toggleGenerator}
              title={generatorRunning ? "Stop live generator" : "Start live generator"}
            >
              {generatorRunning ? <ZapOff size={15} /> : <Zap size={15} />}
              {generatorRunning ? "Stop Generator" : "Live Generator"}
            </button>
            <button
              style={S.btnAdd}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onClick={() => navigate("/dress-manager/new")}
            >
              <PlusCircle size={15} />
              Add New Dress
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={S.th}>ID</th>
                <th style={S.th}>Dress Name</th>
                <th style={S.th}>Price (RON)</th>
                <th style={S.th}>Material</th>
                <th style={S.th}>Sizes</th>
                <th style={S.thCenter}>Stock</th>
                <th style={S.thCenter}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageDresses.length === 0 ? (
                <tr>
                  <td colSpan={7} style={S.emptyRow}>
                    No dresses found. Add your first dress above.
                  </td>
                </tr>
              ) : (
                pageDresses.map((dress: DressRecord, idx: number) => (
                  <tr key={dress.id} style={{ backgroundColor: rowBg(idx) }}>
                    {/* ID */}
                    <td style={S.tdBase}>
                      <span style={S.idBadge}>#{dress.id}</span>
                    </td>

                    {/* Name — clickable link to detail */}
                    <td style={S.tdBase}>
                      <button
                        style={S.dressNameLink}
                        onClick={() => navigate(`/dress-manager/${dress.id}`)}
                      >
                        {dress.name}
                      </button>
                    </td>

                    {/* Price */}
                    <td style={S.tdBase}>
                      <span style={{ fontWeight: 500 }}>
                        {dress.price.toLocaleString("ro-RO")} RON
                      </span>
                    </td>

                    {/* Material */}
                    <td style={S.tdBase}>
                      <span style={S.materialTag}>{dress.material}</span>
                    </td>

                    {/* Sizes */}
                    <td style={S.tdBase}>
                      <div style={S.sizesWrap}>
                        {dress.sizes.map((s: string) => (
                          <span key={`${dress.id}-${s}`} style={S.sizeTag}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Stock */}
                    <td style={S.tdCenter}>
                      <span
                        style={
                          dress.stockQuantity === 0 ? S.stockZero : undefined
                        }
                      >
                        {dress.stockQuantity === 0
                          ? "Out of stock"
                          : dress.stockQuantity}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={S.tdCenter}>
                      <div style={S.actionWrap}>
                        <button
                          title="View details"
                          style={S.btnView}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(61,43,31,0.12)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(61,43,31,0.06)")
                          }
                          onClick={() => navigate(`/dress-manager/${dress.id}`)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          title="Edit dress"
                          style={S.btnEdit}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(201,169,110,0.22)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(201,169,110,0.12)")
                          }
                          onClick={() => navigate(`/dress-manager/${dress.id}/edit`)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          title="Delete dress"
                          style={S.btnDelete}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(196,132,106,0.22)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(196,132,106,0.12)")
                          }
                          onClick={() => handleDelete(dress)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={S.pagination}>
            <span style={S.pageInfo}>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, dresses.length)} of {dresses.length} dresses
            </span>

            <div style={S.pageControls}>
              {/* Previous */}
              <button
                style={safePage === 1 ? S.btnPageDisabled : S.btnPage}
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={13} /> Previous
              </button>

              {/* Page numbers */}
              {pageNumbers().map((n) => (
                <button
                  key={n}
                  style={{
                    ...S.pageNum,
                    backgroundColor:
                      n === safePage
                        ? "var(--color-deep-mocha)"
                        : "transparent",
                    color:
                      n === safePage
                        ? "var(--color-champagne)"
                        : "var(--color-deep-mocha)",
                    border:
                      n === safePage
                        ? "none"
                        : "1px solid rgba(61,43,31,0.15)",
                    cursor: n === safePage ? "default" : "pointer",
                  }}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}

              {/* Next */}
              <button
                style={safePage === totalPages ? S.btnPageDisabled : S.btnPage}
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Single page info */}
        {totalPages === 1 && dresses.length > 0 && (
          <div style={{ ...S.pagination, justifyContent: "flex-end" }}>
            <span style={S.pageInfo}>
              {dresses.length} {dresses.length === 1 ? "dress" : "dresses"} total · Page 1 of 1
            </span>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          dressName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
