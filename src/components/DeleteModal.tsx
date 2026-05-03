/**
 * DeleteModal — Confirmation overlay for dress deletion.
 * Visual layer (styles) is fully separated from logic props.
 */

import { AlertTriangle } from "lucide-react";

// ── Style definitions (visual layer) ─────────────────────────────────────────

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(61,43,31,0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  card: {
    backgroundColor: "var(--color-linen-white)",
    borderRadius: "14px",
    padding: "36px 32px",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(61,43,31,0.3)",
    textAlign: "center" as const,
  },
  iconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "rgba(196,132,106,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "22px",
    color: "var(--color-deep-mocha)",
    marginBottom: "10px",
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 300,
    color: "var(--color-deep-mocha)",
    opacity: 0.75,
    lineHeight: 1.7,
    marginBottom: "28px",
  },
  dressName: {
    fontWeight: 500,
    fontStyle: "italic" as const,
    color: "var(--color-deep-mocha)",
    opacity: 1,
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btnDelete: {
    flex: 1,
    padding: "12px 0",
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
  },
  btnCancel: {
    flex: 1,
    padding: "12px 0",
    borderRadius: "30px",
    border: "1.5px solid var(--color-deep-mocha)",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "var(--color-deep-mocha)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.5px",
    transition: "all 0.2s",
    opacity: 0.7,
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

interface DeleteModalProps {
  dressName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ dressName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div style={S.overlay} onClick={onCancel}>
      <div style={S.card} onClick={(e) => e.stopPropagation()}>
        <div style={S.iconWrap}>
          <AlertTriangle size={22} color="var(--color-mocha-rose)" />
        </div>

        <h2 style={S.title}>Delete Dress</h2>

        <p style={S.body}>
          Are you sure you want to delete{" "}
          <span style={S.dressName}>"{dressName}"</span>?{" "}
          This action cannot be undone.
        </p>

        <div style={S.actions}>
          <button
            style={S.btnCancel}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={S.btnDelete}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
