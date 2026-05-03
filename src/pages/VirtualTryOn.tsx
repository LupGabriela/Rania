import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { RotateCcw, CheckCircle2, Edit3 } from "lucide-react";
import { motion } from "motion/react";

interface MannequinProps {
  measurements: {
    bust: string;
    waist: string;
    hips: string;
    height: string;
    shoulderWidth: string;
  };
  view: "front" | "side" | "back";
  material: string;
  dressColor: string;
}

const MATERIAL_COLORS: Record<string, { fill: string; opacity: number; label: string }> = {
  silk: { fill: "#F5E6C8", opacity: 0.85, label: "Silk" },
  chiffon: { fill: "#E8D5E8", opacity: 0.75, label: "Chiffon" },
  satin: { fill: "#C8D8E8", opacity: 0.85, label: "Satin" },
  lace: { fill: "#FAF0E6", opacity: 0.8, label: "Lace" },
  cotton: { fill: "#D4E8D0", opacity: 0.8, label: "Cotton" },
};

function MannequinSVG({ measurements, view, material, dressColor }: MannequinProps) {
  // Calculate proportional scaling based on measurements
  const bust = parseFloat(measurements.bust) || 88;
  const waist = parseFloat(measurements.waist) || 68;
  const hips = parseFloat(measurements.hips) || 94;
  const height = parseFloat(measurements.height) || 165;
  const shoulder = parseFloat(measurements.shoulderWidth) || 38;

  // Normalize measurements to SVG scale (relative to average proportions)
  const avgBust = 88, avgWaist = 68, avgHips = 94, avgHeight = 165, avgShoulder = 38;
  
  const bustScale = bust / avgBust;
  const waistScale = waist / avgWaist;
  const hipsScale = hips / avgHips;
  const heightScale = Math.min(Math.max(height / avgHeight, 0.8), 1.3);
  const shoulderScale = shoulder / avgShoulder;

  // Base dimensions
  const W = 200; // viewBox width
  const cx = W / 2; // center x

  // Proportional body parts
  const headR = 18 * (heightScale * 0.5 + 0.5);
  const neckW = 9;
  const neckH = 18 * heightScale;
  const shoulderW = 50 * shoulderScale;
  const bustW = 38 * bustScale;
  const waistW = 28 * waistScale;
  const hipsW = 42 * hipsScale;
  const bodyH = 120 * heightScale;
  const skirtH = 100 * heightScale;
  const legH = 90 * heightScale;

  const headY = 20;
  const neckY = headY + headR * 2;
  const shoulderY = neckY + neckH;
  const waistY = shoulderY + bodyH * 0.45;
  const hipsY = shoulderY + bodyH * 0.7;
  const bodyEnd = shoulderY + bodyH;
  const skirtEnd = bodyEnd + skirtH;
  const legEnd = skirtEnd + legH;

  const matColor = MATERIAL_COLORS[material] || MATERIAL_COLORS.silk;

  if (view === "side") {
    return (
      <svg viewBox="0 0 200 520" className="w-full h-full" style={{ maxHeight: "460px" }}>
        {/* Side view - simplified silhouette */}
        {/* Head */}
        <ellipse cx={cx} cy={headY + headR} rx={headR * 0.8} ry={headR} fill="#F5D9C8" />
        {/* Neck */}
        <rect x={cx - neckW * 0.4} y={neckY} width={neckW * 0.8} height={neckH} fill="#F5D9C8" rx="3" />
        {/* Body (side) */}
        <path
          d={`M ${cx - 10} ${shoulderY} 
              C ${cx - 22} ${shoulderY + 20} ${cx - 18} ${waistY - 10} ${cx - 12} ${waistY} 
              C ${cx - 20} ${hipsY} ${cx - 24} ${bodyEnd - 10} ${cx - 20} ${bodyEnd}
              L ${cx + 12} ${bodyEnd}
              C ${cx + 16} ${hipsY} ${cx + 14} ${waistY + 10} ${cx + 10} ${waistY}
              C ${cx + 16} ${shoulderY + 20} ${cx + 14} ${shoulderY + 5} ${cx + 10} ${shoulderY}
              Z`}
          fill="#F5D9C8"
        />
        {/* Dress (side) */}
        <path
          d={`M ${cx - 16} ${waistY}
              C ${cx - 28} ${hipsY} ${cx - 35} ${bodyEnd + 20} ${cx - 40} ${skirtEnd}
              L ${cx + 30} ${skirtEnd}
              C ${cx + 28} ${bodyEnd + 20} ${cx + 22} ${hipsY} ${cx + 14} ${waistY}
              Z`}
          fill={matColor.fill}
          opacity={matColor.opacity}
        />
        {/* Legs */}
        <rect x={cx - 10} y={skirtEnd} width={8} height={legH} fill="#F5D9C8" rx="4" />
        <rect x={cx + 2} y={skirtEnd} width={8} height={legH} fill="#F5D9C8" rx="4" />
        {/* Feet */}
        <ellipse cx={cx - 6} cy={legEnd} rx={10} ry={5} fill="#3D2B1F" opacity={0.3} />
        <ellipse cx={cx + 6} cy={legEnd} rx={10} ry={5} fill="#3D2B1F" opacity={0.3} />
      </svg>
    );
  }

  if (view === "back") {
    return (
      <svg viewBox="0 0 200 520" className="w-full h-full" style={{ maxHeight: "460px" }}>
        {/* Back view */}
        {/* Head */}
        <ellipse cx={cx} cy={headY + headR} rx={headR} ry={headR} fill="#E8C4A8" />
        {/* Hair hint */}
        <ellipse cx={cx} cy={headY + headR * 0.8} rx={headR * 0.9} ry={headR * 0.7} fill="#3D2B1F" opacity={0.15} />
        {/* Neck */}
        <rect x={cx - neckW / 2} y={neckY} width={neckW} height={neckH} fill="#E8C4A8" rx="4" />
        {/* Shoulders */}
        <path
          d={`M ${cx - shoulderW} ${shoulderY + 8}
              C ${cx - shoulderW * 0.9} ${shoulderY} ${cx - neckW * 0.8} ${shoulderY} ${cx - neckW * 0.8} ${shoulderY}
              L ${cx + neckW * 0.8} ${shoulderY}
              C ${cx + neckW * 0.8} ${shoulderY} ${cx + shoulderW * 0.9} ${shoulderY} ${cx + shoulderW} ${shoulderY + 8}`}
          fill="none" stroke="#E8C4A8" strokeWidth="12" strokeLinecap="round"
        />
        {/* Back body */}
        <path
          d={`M ${cx - shoulderW} ${shoulderY + 8}
              C ${cx - shoulderW * 1.05} ${shoulderY + 40} ${cx - bustW} ${waistY - 20} ${cx - waistW} ${waistY}
              C ${cx - hipsW * 0.9} ${waistY + 30} ${cx - hipsW} ${hipsY} ${cx - hipsW} ${bodyEnd}
              L ${cx + hipsW} ${bodyEnd}
              C ${cx + hipsW} ${hipsY} ${cx + hipsW * 0.9} ${waistY + 30} ${cx + waistW} ${waistY}
              C ${cx + bustW} ${waistY - 20} ${cx + shoulderW * 1.05} ${shoulderY + 40} ${cx + shoulderW} ${shoulderY + 8}
              Z`}
          fill="#E8C4A8"
        />
        {/* Arms */}
        <path d={`M ${cx - shoulderW} ${shoulderY + 8} C ${cx - shoulderW * 1.3} ${waistY - 10} ${cx - shoulderW * 1.1} ${waistY + 20} ${cx - shoulderW * 0.9} ${waistY + 40}`}
          fill="none" stroke="#E8C4A8" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${cx + shoulderW} ${shoulderY + 8} C ${cx + shoulderW * 1.3} ${waistY - 10} ${cx + shoulderW * 1.1} ${waistY + 20} ${cx + shoulderW * 0.9} ${waistY + 40}`}
          fill="none" stroke="#E8C4A8" strokeWidth="14" strokeLinecap="round" />
        {/* Dress back */}
        <path
          d={`M ${cx - waistW} ${waistY}
              C ${cx - hipsW * 1.1} ${hipsY} ${cx - hipsW * 1.2} ${bodyEnd + 10} ${cx - hipsW * 1.4} ${skirtEnd}
              L ${cx + hipsW * 1.4} ${skirtEnd}
              C ${cx + hipsW * 1.2} ${bodyEnd + 10} ${cx + hipsW * 1.1} ${hipsY} ${cx + waistW} ${waistY}
              Z`}
          fill={matColor.fill}
          opacity={matColor.opacity}
        />
        {/* Dress zipper hint */}
        <line x1={cx} y1={shoulderY + 4} x2={cx} y2={waistY + 10} stroke="rgba(61,43,31,0.2)" strokeWidth="1" strokeDasharray="3,3" />
        {/* Legs */}
        <rect x={cx - 18} y={skirtEnd} width={14} height={legH} fill="#E8C4A8" rx="7" />
        <rect x={cx + 4} y={skirtEnd} width={14} height={legH} fill="#E8C4A8" rx="7" />
        <ellipse cx={cx - 11} cy={legEnd} rx={12} ry={5} fill="#3D2B1F" opacity={0.2} />
        <ellipse cx={cx + 11} cy={legEnd} rx={12} ry={5} fill="#3D2B1F" opacity={0.2} />
      </svg>
    );
  }

  // Front view (default)
  return (
    <svg viewBox="0 0 200 520" className="w-full h-full" style={{ maxHeight: "460px" }}>
      {/* Head */}
      <ellipse cx={cx} cy={headY + headR} rx={headR} ry={headR} fill="#F5D9C8" />
      {/* Face features */}
      <ellipse cx={cx - 6} cy={headY + headR - 2} rx={2.5} ry={3} fill="#3D2B1F" opacity={0.4} />
      <ellipse cx={cx + 6} cy={headY + headR - 2} rx={2.5} ry={3} fill="#3D2B1F" opacity={0.4} />
      <path d={`M ${cx - 5} ${headY + headR + 6} Q ${cx} ${headY + headR + 10} ${cx + 5} ${headY + headR + 6}`} fill="none" stroke="#C4846A" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
      {/* Neck */}
      <rect x={cx - neckW / 2} y={neckY} width={neckW} height={neckH} fill="#F5D9C8" rx="4" />
      {/* Shoulders */}
      <path
        d={`M ${cx - shoulderW} ${shoulderY + 8}
            C ${cx - shoulderW * 0.9} ${shoulderY} ${cx - neckW * 0.8} ${shoulderY} ${cx - neckW * 0.8} ${shoulderY}
            L ${cx + neckW * 0.8} ${shoulderY}
            C ${cx + neckW * 0.8} ${shoulderY} ${cx + shoulderW * 0.9} ${shoulderY} ${cx + shoulderW} ${shoulderY + 8}`}
        fill="none" stroke="#F5D9C8" strokeWidth="14" strokeLinecap="round"
      />
      {/* Body */}
      <path
        d={`M ${cx - shoulderW} ${shoulderY + 8}
            C ${cx - shoulderW * 1.05} ${shoulderY + 40} ${cx - bustW} ${waistY - 20} ${cx - waistW} ${waistY}
            C ${cx - hipsW * 0.9} ${waistY + 30} ${cx - hipsW} ${hipsY} ${cx - hipsW} ${bodyEnd}
            L ${cx + hipsW} ${bodyEnd}
            C ${cx + hipsW} ${hipsY} ${cx + hipsW * 0.9} ${waistY + 30} ${cx + waistW} ${waistY}
            C ${cx + bustW} ${waistY - 20} ${cx + shoulderW * 1.05} ${shoulderY + 40} ${cx + shoulderW} ${shoulderY + 8}
            Z`}
        fill="#F5D9C8"
      />
      {/* Arms */}
      <path d={`M ${cx - shoulderW} ${shoulderY + 8} C ${cx - shoulderW * 1.3} ${waistY - 10} ${cx - shoulderW * 1.1} ${waistY + 20} ${cx - shoulderW * 0.9} ${waistY + 40}`}
        fill="none" stroke="#F5D9C8" strokeWidth="14" strokeLinecap="round" />
      <path d={`M ${cx + shoulderW} ${shoulderY + 8} C ${cx + shoulderW * 1.3} ${waistY - 10} ${cx + shoulderW * 1.1} ${waistY + 20} ${cx + shoulderW * 0.9} ${waistY + 40}`}
        fill="none" stroke="#F5D9C8" strokeWidth="14" strokeLinecap="round" />

      {/* DRESS */}
      {/* Bodice */}
      <path
        d={`M ${cx - shoulderW * 0.9} ${shoulderY + 6}
            C ${cx - bustW * 1.1} ${shoulderY + 30} ${cx - bustW} ${waistY - 20} ${cx - waistW} ${waistY}
            L ${cx + waistW} ${waistY}
            C ${cx + bustW} ${waistY - 20} ${cx + bustW * 1.1} ${shoulderY + 30} ${cx + shoulderW * 0.9} ${shoulderY + 6}
            Z`}
        fill={matColor.fill}
        opacity={matColor.opacity}
      />
      {/* Neckline */}
      <path
        d={`M ${cx - shoulderW * 0.85} ${shoulderY + 4}
            C ${cx - 20} ${shoulderY + 8} ${cx - 12} ${shoulderY + 22} ${cx} ${shoulderY + 28}
            C ${cx + 12} ${shoulderY + 22} ${cx + 20} ${shoulderY + 8} ${cx + shoulderW * 0.85} ${shoulderY + 4}`}
        fill="none"
        stroke={matColor.fill}
        strokeWidth="1.5"
        opacity={0.9}
      />
      {/* Skirt */}
      <path
        d={`M ${cx - waistW} ${waistY}
            C ${cx - hipsW * 1.1} ${hipsY} ${cx - hipsW * 1.2} ${bodyEnd + 10} ${cx - hipsW * 1.4} ${skirtEnd}
            L ${cx + hipsW * 1.4} ${skirtEnd}
            C ${cx + hipsW * 1.2} ${bodyEnd + 10} ${cx + hipsW * 1.1} ${hipsY} ${cx + waistW} ${waistY}
            Z`}
        fill={matColor.fill}
        opacity={matColor.opacity}
      />
      {/* Dress detail - waist seam */}
      <line x1={cx - waistW} y1={waistY} x2={cx + waistW} y2={waistY} stroke={`rgba(61,43,31,0.15)`} strokeWidth="1" />

      {/* Legs */}
      <rect x={cx - 18} y={skirtEnd} width={14} height={legH} fill="#F5D9C8" rx="7" />
      <rect x={cx + 4} y={skirtEnd} width={14} height={legH} fill="#F5D9C8" rx="7" />
      {/* Feet (heels) */}
      <ellipse cx={cx - 11} cy={legEnd} rx={12} ry={5} fill="#3D2B1F" opacity={0.2} />
      <ellipse cx={cx + 11} cy={legEnd} rx={12} ry={5} fill="#3D2B1F" opacity={0.2} />
      {/* Heel shape */}
      <rect x={cx - 8} y={legEnd - 2} width={3} height={8} fill="#3D2B1F" opacity={0.2} rx="1" />
      <rect x={cx + 14} y={legEnd - 2} width={3} height={8} fill="#3D2B1F" opacity={0.2} rx="1" />
    </svg>
  );
}

export function VirtualTryOn() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state as {
    measurements?: { bust: string; waist: string; hips: string; height: string; shoulderWidth: string };
    selectedMaterial?: string;
    uploadedImage?: string;
  } | null;

  const [view, setView] = useState<"front" | "side" | "back">("front");
  const [dressColor] = useState("#C4846A");

  const measurements = stateData?.measurements || {
    bust: "88",
    waist: "68",
    hips: "94",
    height: "165",
    shoulderWidth: "38",
  };
  const selectedMaterial = stateData?.selectedMaterial || "silk";
  const uploadedImage = stateData?.uploadedImage || null;

  const matInfo = MATERIAL_COLORS[selectedMaterial] || MATERIAL_COLORS.silk;
  const matLabel = matInfo.label;

  const views: { key: "front" | "side" | "back"; label: string }[] = [
    { key: "front", label: "Front" },
    { key: "side", label: "Side" },
    { key: "back", label: "Back" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
    <Navbar />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-10"
    >
      </motion.div>
      

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#3D2B1F", marginBottom: "6px" }}>
            Virtual Try-On
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#C4846A" }}>
            See your dream dress on a mannequin built to your exact measurements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Mannequin */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div
              className="w-full flex flex-col items-center py-8 px-4"
              style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 4px 24px rgba(61,43,31,0.07)" }}
            >
              {/* View toggle */}
              <div className="flex gap-2 mb-6">
                {views.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setView(v.key)}
                    className="px-5 py-2 transition-all"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "12px",
                      letterSpacing: "1px",
                      fontWeight: 500,
                      borderRadius: "20px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: view === v.key ? "#C4846A" : "#F0E6D3",
                      color: view === v.key ? "#FAF6F0" : "#3D2B1F",
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Mannequin */}
              <div className="w-full max-w-[260px]">
                <MannequinSVG
                  measurements={measurements}
                  view={view}
                  material={selectedMaterial}
                  dressColor={dressColor}
                />
              </div>

              {/* "Your mannequin" note */}
              <p
                className="mt-4 text-center"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "#C4846A",
                }}
              >
                Your mannequin matches your exact dimensions
              </p>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Order summary card */}
            <div
              className="p-6"
              style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", boxShadow: "0 2px 16px rgba(61,43,31,0.06)" }}
            >
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#3D2B1F", marginBottom: "16px" }}
              >
                Order Summary
              </h2>

              {/* Reference image */}
              {uploadedImage && (
                <div className="mb-4">
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", color: "rgba(61,43,31,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
                    Reference
                  </p>
                  <img
                    src={uploadedImage}
                    alt="Reference"
                    className="w-full h-32 object-cover"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              )}

              {/* Material */}
              <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #F0E6D3" }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", color: "rgba(61,43,31,0.5)", textTransform: "uppercase", marginBottom: "4px" }}>
                  Material
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: matInfo.fill }}
                  />
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 500, color: "#3D2B1F" }}>
                    {matLabel}
                  </p>
                </div>
              </div>

              {/* Measurements */}
              <div className="mb-4">
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", color: "rgba(61,43,31,0.5)", textTransform: "uppercase", marginBottom: "10px" }}>
                  Your Measurements
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Bust", value: measurements.bust },
                    { label: "Waist", value: measurements.waist },
                    { label: "Hips", value: measurements.hips },
                    { label: "Height", value: measurements.height },
                    { label: "Shoulder", value: measurements.shoulderWidth },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1">
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "rgba(61,43,31,0.6)", fontWeight: 300 }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F", fontWeight: 500 }}>
                        {value} cm
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Looks great notice */}
              <div
                className="flex items-start gap-2 p-3 mt-2"
                style={{ backgroundColor: "rgba(196,132,106,0.08)", borderRadius: "8px" }}
              >
                <CheckCircle2 size={14} style={{ color: "#C4846A", marginTop: "2px", flexShrink: 0 }} />
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#C4846A", lineHeight: 1.5 }}>
                  Looks great! Your mannequin matches your exact dimensions.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => navigate("/catalogue")}
              className="w-full py-4 transition-all hover:opacity-90"
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
              Submit Order
            </button>

            <button
              onClick={() => navigate("/custom-order")}
              className="w-full flex items-center justify-center gap-2 py-3 transition-colors"
              style={{
                color: "#C9A96E",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.5px",
                textDecoration: "underline",
              }}
            >
              <Edit3 size={13} />
              Edit Order
            </button>
          </div>
        </div>

        {/* Demo note */}
        {!stateData && (
          <div
            className="mt-6 p-4 text-center"
            style={{ backgroundColor: "#F0E6D3", borderRadius: "8px" }}
          >
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#3D2B1F", opacity: 0.7 }}>
              This is a preview with sample measurements. To see your exact fit, 
              <button onClick={() => navigate("/custom-order")} style={{ color: "#C4846A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Jost', sans-serif", fontSize: "12px", marginLeft: "4px" }}>
                submit your custom order
              </button>.
            </p>
          </div>
        )}
      </div>
    </div>
    
  );
}
