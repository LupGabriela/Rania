import { useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { ImagePlus, CheckCircle2 } from "lucide-react";

export function AdminForm() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    sizes: [] as string[],
    color: "",
    quantity: "",
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const allSizes = ["XS", "S", "M", "L", "XL"];

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    backgroundColor: "#F0E6D3",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Jost', sans-serif",
    fontSize: "14px",
    color: "#3D2B1F",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    fontFamily: "'Jost', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#3D2B1F",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#C4846A",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Admin Panel
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              color: "#3D2B1F",
            }}
          >
            Add New Dress
          </h1>
        </div>

        {saved && (
          <div
            className="flex items-center gap-3 p-4 mb-6"
            style={{ backgroundColor: "rgba(123,174,127,0.1)", borderRadius: "8px", border: "1px solid rgba(123,174,127,0.3)" }}
          >
            <CheckCircle2 size={16} style={{ color: "#7BAE7F" }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#7BAE7F" }}>
              Dress saved successfully to the collection!
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Dress Name */}
          <div>
            <label style={labelStyle}>Dress Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Seraphine Gown"
              required
              className="outline-none"
              style={inputStyle}
            />
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>Price (USD)</label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#C4846A" }}
              >
                $
              </span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                min="0"
                required
                className="outline-none pl-8"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the dress, its fabric, style, and occasion..."
              rows={4}
              required
              className="outline-none resize-none"
              style={{ ...inputStyle, lineHeight: 1.7 }}
            />
          </div>

          {/* Available Sizes */}
          <div>
            <label style={labelStyle}>Available Sizes</label>
            <div className="flex gap-3 flex-wrap">
              {allSizes.map((size) => {
                const checked = form.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className="w-12 h-10 transition-all"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "12px",
                      backgroundColor: checked ? "#C4846A" : "transparent",
                      color: checked ? "#FAF6F0" : "#C4846A",
                      border: `1.5px solid #C4846A`,
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colour */}
          <div>
            <label style={labelStyle}>Colour</label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="e.g. Ivory, Blush, Midnight Blue"
              className="outline-none"
              style={inputStyle}
            />
          </div>

          {/* Upload Image */}
          <div>
            <label style={labelStyle}>Dress Image</label>
            <label
              className="flex items-center gap-4 p-5 cursor-pointer transition-all hover:opacity-80"
              style={{
                backgroundColor: "#F0E6D3",
                borderRadius: "8px",
                border: "none",
              }}
            >
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {uploadedImage ? (
                <>
                  <img src={uploadedImage} alt="preview" className="w-16 h-20 object-cover" style={{ borderRadius: "4px" }} />
                  <div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F" }}>Image uploaded</p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "rgba(61,43,31,0.5)" }}>Click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(196,132,106,0.15)" }}>
                    <ImagePlus size={20} style={{ color: "#C4846A" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F" }}>Upload dress photo</p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "rgba(61,43,31,0.5)" }}>PNG, JPG up to 10MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Stock Quantity */}
          <div>
            <label style={labelStyle}>Stock Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="0"
              min="0"
              required
              className="outline-none"
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 transition-all hover:opacity-90"
              style={{
                backgroundColor: "#C4846A",
                color: "#FAF6F0",
                fontFamily: "'Jost', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                borderRadius: "30px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save Dress
            </button>
            <button
              type="button"
              onClick={() => navigate("/catalogue")}
              className="flex-1 py-4 transition-all hover:bg-[#C4846A] hover:text-[#FAF6F0]"
              style={{
                backgroundColor: "transparent",
                color: "#C4846A",
                fontFamily: "'Jost', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                borderRadius: "30px",
                border: "1.5px solid #C4846A",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
