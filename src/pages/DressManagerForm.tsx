/**
 * DressManagerForm — Add & Edit Form
 * Live validation on every input change.
 * Save button disabled until all fields are valid.
 * Visual styles separated into the `S` style object.
 * Data lives exclusively in the in-memory store.
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Navbar } from "../components/Navbar";
import * as api from "../data/apiClient";
import type { DressRecord } from "../data/apiClient";

type Material = "Silk" | "Chiffon" | "Satin" | "Lace" | "Cotton";
type DressSize = "XS" | "S" | "M" | "L" | "XL";
// ── Constants ─────────────────────────────────────────────────────────────────

const MATERIALS: Material[] = ["Silk", "Chiffon", "Satin", "Lace", "Cotton"];
const ALL_SIZES: DressSize[] = ["XS", "S", "M", "L", "XL"];

// ── Style definitions (visual layer) ─────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--color-linen-white)",
    fontFamily: "var(--font-body)",
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "40px 24px 80px",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },
  btnBack: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 18px",
    borderRadius: "30px",
    border: "1.5px solid rgba(61,43,31,0.18)",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "var(--color-deep-mocha)",
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 500,
    transition: "all 0.15s",
    flexShrink: 0,
  },
  titleBlock: {} as const,
  formTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: "30px",
    color: "var(--color-deep-mocha)",
    lineHeight: 1.1,
    marginBottom: "3px",
  },
  formSubtitle: {
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontStyle: "italic" as const,
    color: "var(--color-mocha-rose)",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "36px 40px",
    boxShadow: "0 4px 30px rgba(61,43,31,0.08)",
  },
  sectionTitle: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--color-antique-gold)",
    marginBottom: "20px",
    display: "block",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(201,169,110,0.2)",
  },
  fieldGroup: {
    marginBottom: "22px",
  },
  label: {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    color: "var(--color-deep-mocha)",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid rgba(61,43,31,0.14)",
    backgroundColor: "var(--color-champagne)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  },
  inputError: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid var(--color-mocha-rose)",
    backgroundColor: "rgba(196,132,106,0.06)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid rgba(61,43,31,0.14)",
    backgroundColor: "var(--color-champagne)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    outline: "none",
    cursor: "pointer",
    appearance: "auto" as const,
    boxSizing: "border-box" as const,
  },
  selectError: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid var(--color-mocha-rose)",
    backgroundColor: "rgba(196,132,106,0.06)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid rgba(61,43,31,0.14)",
    backgroundColor: "var(--color-champagne)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    outline: "none",
    resize: "vertical" as const,
    minHeight: "110px",
    lineHeight: 1.7,
    boxSizing: "border-box" as const,
  },
  textareaError: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid var(--color-mocha-rose)",
    backgroundColor: "rgba(196,132,106,0.06)",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--color-deep-mocha)",
    outline: "none",
    resize: "vertical" as const,
    minHeight: "110px",
    lineHeight: 1.7,
    boxSizing: "border-box" as const,
  },
  errorMsg: {
    display: "block",
    marginTop: "5px",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--color-mocha-rose)",
  },
  sizesGrid: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "var(--color-deep-mocha)",
    userSelect: "none" as const,
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "var(--color-mocha-rose)",
    cursor: "pointer",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgba(61,43,31,0.06)",
    margin: "28px 0",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
  },
  btnCancel: {
    padding: "12px 28px",
    borderRadius: "30px",
    border: "1.5px solid rgba(61,43,31,0.2)",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "var(--color-deep-mocha)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.3px",
    transition: "all 0.15s",
  },
  btnSave: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "12px 28px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "var(--color-mocha-rose)",
    color: "var(--color-linen-white)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.3px",
    transition: "opacity 0.15s",
  },
  btnSaveDisabled: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "12px 28px",
    borderRadius: "30px",
    border: "none",
    cursor: "not-allowed",
    backgroundColor: "rgba(61,43,31,0.15)",
    color: "rgba(61,43,31,0.35)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.3px",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
} as const;

// ── Validation logic (logic layer) ────────────────────────────────────────────

interface FormValues {
  name: string;
  price: string;
  material: string;
  sizes: DressSize[];
  stockQuantity: string;
  description: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  material?: string;
  sizes?: string;
  stockQuantity?: string;
  description?: string;
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  const priceNum = Number(values.price);
  if (!values.price.trim()) {
    errors.price = "Price is required";
  } else if (isNaN(priceNum) || priceNum <= 0) {
    errors.price = "Price must be a positive number";
  }

  if (!values.material) {
    errors.material = "Please select a material";
  }

  if (values.sizes.length === 0) {
    errors.sizes = "Select at least one size";
  }

  const stockNum = Number(values.stockQuantity);
  if (values.stockQuantity.trim() === "") {
    errors.stockQuantity = "Stock is required";
  } else if (isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
    errors.stockQuantity = "Stock must be 0 or more (whole number)";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  return errors;
}

function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DressManagerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [existingDress, setExistingDress] = useState<DressRecord | undefined>(undefined);
  const [values, setValues] = useState<FormValues>({
    name: "", price: "", material: "", sizes: [], stockQuantity: "", description: "", imageUrl: "",
  });

  useEffect(() => {
    if (id) {
      api.fetchDress(id).then((d) => {
        setExistingDress(d);
        setValues({
          name: d.name,
          price: d.price.toString(),
          material: d.material,
          sizes: d.sizes as DressSize[],
          stockQuantity: d.stockQuantity.toString(),
          description: d.description,
          imageUrl: d.imageUrl,
        });
      }).catch(() => navigate("/dress-manager"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [storeError, setStoreError] = useState<string>("");

  const errors = validateForm(values);
  const formValid = isFormValid(errors);

  function handleBlur(field: keyof FormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleChange(
    field: keyof FormValues,
    value: string
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    setStoreError(""); // Clear store errors when user types
  }

  function toggleSize(size: DressSize) {
    setValues((prev) => {
      const has = prev.sizes.includes(size);
      const next = has
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: next };
    });
    setTouched((prev) => ({ ...prev, sizes: true }));
  }

  function fieldError(field: keyof FormErrors): string | undefined {
    return touched[field] ? errors[field] : undefined;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStoreError(""); // Clear previous errors

    const allTouched = Object.fromEntries(
      Object.keys(values).map((k) => [k, true])
    ) as Partial<Record<keyof FormValues, boolean>>;
    setTouched(allTouched);

    if (!formValid) return;

    const dressData = {
      name: values.name.trim(),
      price: Number(values.price),
      material: values.material as Material,
      sizes: values.sizes,
      stockQuantity: Number(values.stockQuantity),
      description: values.description.trim(),
      imageUrl: values.imageUrl.trim(),
    };

    try {
      if (isEdit && id) {
        await api.updateDress(id, dressData);
      } else {
        await api.createDress(dressData);
      }
      navigate("/dress-manager");
    } catch (error: unknown) {
      setStoreError(error instanceof Error ? error.message : "Failed to save dress.");
    }
  }

  return (
    <div style={S.page}>
      <Navbar />

      <div style={S.container}>
        <div style={S.topBar}>
          <button
            style={S.btnBack}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(61,43,31,0.04)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent")
            }
            onClick={() => navigate("/dress-manager")}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div style={S.titleBlock}>
            <h1 style={S.formTitle}>
              {isEdit ? "Edit Dress" : "Add New Dress"}
            </h1>
            <p style={S.formSubtitle}>
              {isEdit
                ? `Editing "${existingDress?.name ?? ""}"`
                : "Fill in the details to add a new dress to the collection"}
            </p>
          </div>
        </div>

        {/* NEW: Display store-level errors at the top of the form */}
        {storeError && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "rgba(196,132,106,0.08)",
              border: "1px solid var(--color-mocha-rose)",
              marginBottom: "16px",
              color: "var(--color-mocha-rose)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>Error saving data:</strong>
            <br />
            {storeError}
          </div>
        )}

        <form style={S.card} onSubmit={handleSubmit} noValidate>
          <span style={S.sectionTitle}>Basic Information</span>

          {/* Dress Name */}
          <div style={S.fieldGroup}>
            <label style={S.label}>
              Dress Name <span style={{ color: "var(--color-mocha-rose)" }}>*</span>
            </label>
            <input
              type="text"
              value={values.name}
              placeholder="e.g. Florentine Bloom"
              style={fieldError("name") ? S.inputError : S.input}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
            />
            {fieldError("name") && (
              <span style={S.errorMsg}>⚠ {fieldError("name")}</span>
            )}
          </div>

          <div style={S.row2}>
            {/* Price */}
            <div style={S.fieldGroup}>
              <label style={S.label}>
                Price (RON) <span style={{ color: "var(--color-mocha-rose)" }}>*</span>
              </label>
              <input
                type="number"
                value={values.price}
                placeholder="e.g. 1350"
                min="1"
                step="1"
                style={fieldError("price") ? S.inputError : S.input}
                onChange={(e) => handleChange("price", e.target.value)}
                onBlur={() => handleBlur("price")}
              />
              {fieldError("price") && (
                <span style={S.errorMsg}>⚠ {fieldError("price")}</span>
              )}
            </div>

            {/* Stock */}
            <div style={S.fieldGroup}>
              <label style={S.label}>
                Stock Quantity <span style={{ color: "var(--color-mocha-rose)" }}>*</span>
              </label>
              <input
                type="number"
                value={values.stockQuantity}
                placeholder="e.g. 10"
                min="0"
                step="1"
                style={fieldError("stockQuantity") ? S.inputError : S.input}
                onChange={(e) => handleChange("stockQuantity", e.target.value)}
                onBlur={() => handleBlur("stockQuantity")}
              />
              {fieldError("stockQuantity") && (
                <span style={S.errorMsg}>⚠ {fieldError("stockQuantity")}</span>
              )}
            </div>
          </div>

          {/* Material */}
          <div style={S.fieldGroup}>
            <label style={S.label}>
              Material <span style={{ color: "var(--color-mocha-rose)" }}>*</span>
            </label>
            <select
              value={values.material}
              style={fieldError("material") ? S.selectError : S.select}
              onChange={(e) => handleChange("material", e.target.value)}
              onBlur={() => handleBlur("material")}
            >
              <option value="">— Select a material —</option>
              {MATERIALS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {fieldError("material") && (
              <span style={S.errorMsg}>⚠ {fieldError("material")}</span>
            )}
          </div>

          <div style={S.divider} />
          <span style={S.sectionTitle}>Sizes & Availability</span>

          {/* Sizes */}
          <div style={S.fieldGroup}>
            <label style={S.label}>
              Sizes Available <span style={{ color: "var(--color-mocha-rose)" }}>*</span>
            </label>
            <div style={S.sizesGrid}>
              {ALL_SIZES.map((size) => (
                <label key={size} style={S.checkLabel}>
                  <input
                    type="checkbox"
                    checked={values.sizes.includes(size)}
                    style={S.checkbox}
                    onChange={() => toggleSize(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
            {fieldError("sizes") && (
              <span style={S.errorMsg}>⚠ {fieldError("sizes")}</span>
            )}
          </div>

          <div style={S.divider} />
          <span style={S.sectionTitle}>Description & Media</span>

          {/* Description */}
          <div style={S.fieldGroup}>
            <label style={S.label}>
              Description <span style={{ color: "var(--color-mocha-rose)" }}>*</span>
            </label>
            <textarea
              value={values.description}
              placeholder="Describe the dress — fabric feel, silhouette, occasions…"
              style={fieldError("description") ? S.textareaError : S.textarea}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {fieldError("description") ? (
                <span style={S.errorMsg}>⚠ {fieldError("description")}</span>
              ) : (
                <span />
              )}
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  color:
                    values.description.trim().length < 10 && touched.description
                      ? "var(--color-mocha-rose)"
                      : "rgba(61,43,31,0.35)",
                  marginTop: "4px",
                }}
              >
                {values.description.trim().length} / 10 min chars
              </span>
            </div>
          </div>

          {/* Image URL (optional) */}
          <div style={S.fieldGroup}>
            <label style={S.label}>Image URL (optional)</label>
            <input
              type="url"
              value={values.imageUrl}
              placeholder="https://images.unsplash.com/…"
              style={S.input}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
            />
            <span
              style={{
                display: "block",
                marginTop: "5px",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "rgba(61,43,31,0.4)",
              }}
            >
              Leave blank to use a placeholder
            </span>
          </div>

          {/* Validation summary banner */}
          {!formValid &&
            Object.values(touched).some(Boolean) &&
            Object.values(errors).length > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(196,132,106,0.08)",
                  border: "1px solid rgba(196,132,106,0.3)",
                  marginBottom: "8px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--color-mocha-rose)",
                    fontWeight: 500,
                  }}
                >
                  Please fix {Object.keys(errors).length} validation{" "}
                  {Object.keys(errors).length === 1 ? "error" : "errors"} before saving.
                </p>
              </div>
            )}

          {/* Actions */}
          <div style={S.formActions}>
            <button
              type="button"
              style={S.btnCancel}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(61,43,31,0.04)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent")
              }
              onClick={() => navigate("/dress-manager")}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!formValid}
              style={formValid ? S.btnSave : S.btnSaveDisabled}
              onMouseEnter={(e) => {
                if (formValid)
                  (e.currentTarget as HTMLElement).style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                if (formValid)
                  (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              <Save size={14} />
              {isEdit ? "Save Changes" : "Add Dress"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}