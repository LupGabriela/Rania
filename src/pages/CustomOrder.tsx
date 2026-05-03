import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { materials } from "../data/dresses";
import { Upload, ImagePlus, CheckCircle2, ChevronRight } from "lucide-react";

interface Measurements {
  bust: string; waist: string; hips: string; height: string; shoulderWidth: string;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] } },
});

export function CustomOrder() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [measurements, setMeasurements] = useState<Measurements>({ bust: "", waist: "", hips: "", height: "", shoulderWidth: "" });
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setUploadedImage(reader.result as string); reader.readAsDataURL(file); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) { const reader = new FileReader(); reader.onloadend = () => setUploadedImage(reader.result as string); reader.readAsDataURL(file); }
  };

  const handleMeasChange = (field: keyof Measurements, value: string) => setMeasurements((prev) => ({ ...prev, [field]: value }));

  const allFilled = uploadedImage && selectedMaterial && measurements.bust && measurements.waist && measurements.hips && measurements.height && measurements.shoulderWidth;

  const handlePreview = () => { if (allFilled) navigate("/try-on", { state: { measurements, selectedMaterial, uploadedImage } }); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const sectionLabelStyle = { fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "3px", color: "#C4846A", textTransform: "uppercase" as const, marginBottom: "16px", display: "block" };
  const inputStyle = { backgroundColor: "#F0E6D3", border: "none", borderRadius: "8px", fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#3D2B1F", padding: "12px 16px", width: "100%", outline: "none" };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
        <Navbar />
        <motion.div {...fadeUp(0.1)} className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(196,132,106,0.15)" }}>
            <CheckCircle2 size={32} style={{ color: "#C4846A" }} />
          </motion.div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#3D2B1F", marginBottom: "12px" }}>Order Received!</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", color: "#C4846A", marginBottom: "20px" }}>Your dream dress is on its way to being created.</p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 300, color: "#3D2B1F", opacity: 0.7, maxWidth: "400px", lineHeight: 1.8, marginBottom: "32px" }}>
            We've received your custom dress request and our team will contact you within 24 hours with a detailed quote and timeline.
          </p>
          <motion.button onClick={() => navigate("/")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5" style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", borderRadius: "30px", border: "none", cursor: "pointer" }}>
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,40px)", color: "#3D2B1F", marginBottom: "8px" }}>Create Your Dream Dress</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", color: "#C4846A" }}>Three simple steps to your perfect dress</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1 */}
          <motion.div {...fadeUp(0.1)} className="p-6 sm:p-8" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 20px rgba(61,43,31,0.06)" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Playfair Display', serif", fontSize: "16px" }}>1</span>
              <span style={sectionLabelStyle}>Your Reference</span>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F", opacity: 0.6, marginBottom: "16px" }}>Upload a photo of the dress you love. This will be our style inspiration.</p>
            <div className="relative flex flex-col items-center justify-center p-8 sm:p-10 cursor-pointer transition-all hover:opacity-80"
              style={{ border: "2px dashed #C4846A", borderRadius: "12px", backgroundColor: "#F0E6D3", minHeight: "160px" }}
              onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {uploadedImage ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={uploadedImage} alt="Reference" className="max-h-40 object-contain rounded" />
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#C4846A" }}>✓ Image uploaded — click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImagePlus size={32} style={{ color: "#C4846A", opacity: 0.6 }} />
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#C4846A", opacity: 0.8, textAlign: "center" }}>
                    Drag & drop your image here<br /><span style={{ fontSize: "12px", opacity: 0.6 }}>or click to upload</span>
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: "#C4846A", borderRadius: "20px" }}>
                    <Upload size={12} style={{ color: "#FAF6F0" }} />
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#FAF6F0" }}>Upload Image</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div {...fadeUp(0.2)} className="p-6 sm:p-8" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 20px rgba(61,43,31,0.06)" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Playfair Display', serif", fontSize: "16px" }}>2</span>
              <span style={sectionLabelStyle}>Your Material</span>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F", opacity: 0.6, marginBottom: "16px" }}>Select the fabric you'd like your dress to be made from.</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {materials.map((mat) => {
                const selected = selectedMaterial === mat.id;
                return (
                  <motion.button key={mat.id} type="button" onClick={() => setSelectedMaterial(mat.id)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center p-3"
                    style={{ backgroundColor: selected ? "transparent" : "#FFFFFF", border: selected ? "2px solid #C4846A" : "1px solid #F0E6D3", borderRadius: "10px", cursor: "pointer" }}>
                    <div className={`w-10 h-10 rounded-full mb-2 ${mat.thumbnail}`} style={{ boxShadow: selected ? "0 0 0 2px #C4846A" : "none" }} />
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#3D2B1F", fontWeight: selected ? 500 : 400 }}>{mat.name}</p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", color: "rgba(61,43,31,0.5)", textAlign: "center", marginTop: "2px" }}>{mat.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div {...fadeUp(0.3)} className="p-6 sm:p-8" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 20px rgba(61,43,31,0.06)" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Playfair Display', serif", fontSize: "16px" }}>3</span>
              <span style={sectionLabelStyle}>Your Measurements</span>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F", opacity: 0.6, marginBottom: "20px" }}>All measurements in centimeters (cm).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[{ key: "bust", label: "Bust" }, { key: "waist", label: "Waist" }, { key: "hips", label: "Hips" }, { key: "height", label: "Height" }, { key: "shoulderWidth", label: "Shoulder Width" }].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", color: "#3D2B1F", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{label}</label>
                  <div className="relative">
                    <input type="number" value={measurements[key as keyof Measurements]} onChange={(e) => handleMeasChange(key as keyof Measurements, e.target.value)} placeholder="0" min="1" className="outline-none" style={inputStyle} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#C4846A" }}>cm</span>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2">
                <label style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", color: "#3D2B1F", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Additional Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific details, colour preferences, or special requests..." rows={3} className="outline-none resize-none" style={{ ...inputStyle, lineHeight: 1.7 }} />
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4">
            <motion.button type="button" onClick={handlePreview} disabled={!allFilled} whileHover={allFilled ? { scale: 1.02 } : {}} whileTap={allFilled ? { scale: 0.97 } : {}}
              className="flex-1 py-4 flex items-center justify-center gap-2"
              style={{ backgroundColor: allFilled ? "#C9A96E" : "#D1C3B8", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", borderRadius: "30px", border: "none", cursor: allFilled ? "pointer" : "not-allowed" }}>
              Preview on Mannequin <ChevronRight size={14} />
            </motion.button>
            <motion.button type="submit" disabled={!allFilled} whileHover={allFilled ? { scale: 1.02 } : {}} whileTap={allFilled ? { scale: 0.97 } : {}}
              className="flex-1 py-4"
              style={{ backgroundColor: allFilled ? "#C4846A" : "#D1C3B8", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", borderRadius: "30px", border: "none", cursor: allFilled ? "pointer" : "not-allowed" }}>
              Submit Order
            </motion.button>
          </motion.div>

          {!allFilled && (
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#C4846A", textAlign: "center", marginTop: "-8px" }}>
              Please complete all sections to continue
            </p>
          )}
        </form>
      </div>
    </div>
  );
}