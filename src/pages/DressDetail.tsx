import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { dresses } from "../data/dresses";
import { Heart, ArrowLeft, ShoppingBag, CheckCircle2, Truck } from "lucide-react";

export function DressDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dress = dresses.find((d) => d.id === id) || dresses[0];
  const [selectedSize, setSelectedSize] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setAddedToCart(true);
    setCartCount((c) => c + 1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar cartCount={cartCount} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/catalogue")}
          className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-70"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "12px",
            letterSpacing: "1px",
            color: "#3D2B1F",
            background: "none",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Left: Image */}
          <div className="relative">
            <div
              className="overflow-hidden"
              style={{ borderRadius: "4px", aspectRatio: "3/4" }}
            >
              <img
                src={dress.image}
                alt={dress.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-20 overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: "2px",
                    border: i === 0 ? "2px solid #C4846A" : "2px solid transparent",
                    opacity: i === 0 ? 1 : 0.5,
                  }}
                >
                  <img src={dress.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col py-2">
            {/* Category badge */}
            <span
              className="mb-3 self-start px-3 py-1"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "1.5px",
                color: "#C4846A",
                textTransform: "uppercase",
                backgroundColor: "rgba(196,132,106,0.1)",
                borderRadius: "2px",
              }}
            >
              {dress.category}
            </span>

            {/* Name */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "36px",
                color: "#3D2B1F",
                lineHeight: 1.2,
                marginBottom: "12px",
              }}
            >
              {dress.name}
            </h1>

            {/* Price */}
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "22px",
                fontWeight: 500,
                color: "#C9A96E",
                marginBottom: "20px",
              }}
            >
              ${dress.price}
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                color: "#3D2B1F",
                lineHeight: 1.85,
                opacity: 0.8,
                marginBottom: "24px",
              }}
            >
              {dress.description}
            </p>

            {/* Material */}
            <div className="mb-6">
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  color: "#3D2B1F",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  opacity: 0.6,
                }}
              >
                Material
              </p>
              <div className="flex gap-2 flex-wrap">
                {dress.materials.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "12px",
                      color: "#3D2B1F",
                      backgroundColor: "#F0E6D3",
                      borderRadius: "4px",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    color: "#3D2B1F",
                    textTransform: "uppercase",
                    opacity: 0.6,
                  }}
                >
                  Size
                </p>
                <button
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "11px",
                    color: "#C9A96E",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["XS", "S", "M", "L", "XL"].map((size) => {
                  const available = dress.sizes.includes(size);
                  const selected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => available && dress.inStock && setSelectedSize(size)}
                      className="w-12 h-10 transition-all"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "12px",
                        backgroundColor: selected ? "#C4846A" : "transparent",
                        color: selected ? "#FAF6F0" : available ? "#C4846A" : "#D1C3B8",
                        border: `1px solid ${selected ? "#C4846A" : available ? "#C4846A" : "#D1C3B8"}`,
                        borderRadius: "4px",
                        cursor: available && dress.inStock ? "pointer" : "not-allowed",
                        opacity: available ? 1 : 0.4,
                        textDecoration: !available ? "line-through" : "none",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && dress.inStock && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#C4846A", marginTop: "6px" }}>
                  Please select a size
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              {dress.inStock ? (
                <>
                  <CheckCircle2 size={14} style={{ color: "#7BAE7F" }} />
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#7BAE7F" }}>
                    In Stock
                  </span>
                  <span className="ml-3 flex items-center gap-1.5" style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "rgba(61,43,31,0.5)" }}>
                    <Truck size={12} />
                    Free shipping on orders over $300
                  </span>
                </>
              ) : (
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#C4846A" }}>
                  Currently Out of Stock
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!dress.inStock || !selectedSize}
                className="w-full py-4 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{
                  backgroundColor: addedToCart ? "#7BAE7F" : (!dress.inStock || !selectedSize) ? "#D1C3B8" : "#C4846A",
                  color: "#FAF6F0",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  borderRadius: "30px",
                  border: "none",
                  cursor: dress.inStock && selectedSize ? "pointer" : "not-allowed",
                }}
              >
                <ShoppingBag size={14} />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={() => setInWishlist(!inWishlist)}
                className="flex items-center justify-center gap-2 transition-colors"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "12px",
                  color: inWishlist ? "#C4846A" : "#C9A96E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  padding: "8px 0",
                }}
              >
                <Heart
                  size={13}
                  style={{ fill: inWishlist ? "#C4846A" : "none", color: inWishlist ? "#C4846A" : "#C9A96E" }}
                />
                {inWishlist ? "Saved to Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            {/* Delivery info */}
            <div
              className="mt-8 p-4"
              style={{ backgroundColor: "#F0E6D3", borderRadius: "8px" }}
            >
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "0.5px", color: "#3D2B1F", opacity: 0.8, lineHeight: 1.7 }}>
                🚚 Estimated delivery: 5–7 business days &nbsp;|&nbsp; 🔄 Free returns within 14 days &nbsp;|&nbsp; 📏 Not quite right? Try our <button onClick={() => navigate("/custom-order")} style={{ color: "#C4846A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Jost', sans-serif", fontSize: "11px" }}>Custom Order</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
