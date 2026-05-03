import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

const mockOrders = [
  { id: "ORD-2024-001", type: "ready-made", item: "Florentine Bloom", date: "2026-02-18", status: "delivered", price: 285, image: "https://images.unsplash.com/photo-1761574039846-a320885dd8f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  { id: "ORD-2024-002", type: "custom", item: "Custom Silk Gown", date: "2026-03-01", status: "in-progress", price: 680, image: "https://images.unsplash.com/photo-1756483509162-b92ea967a884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  { id: "ORD-2024-003", type: "ready-made", item: "Azura Satin", date: "2026-03-08", status: "processing", price: 390, image: "https://images.unsplash.com/photo-1704775983177-8ae543524081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
];

const statusConfig = {
  delivered:    { label: "Delivered",   color: "#7BAE7F", icon: CheckCircle2 },
  "in-progress":{ label: "In Progress", color: "#C9A96E", icon: Clock },
  processing:   { label: "Processing",  color: "#C4846A", icon: Truck },
};

export function MyOrders() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,36px)", color: "#3D2B1F", marginBottom: "6px" }}>My Orders</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#C4846A" }}>Your RANIA journey</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {mockOrders.map((order, i) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            return (
              <motion.div key={order.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 p-4 sm:p-5"
                style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 12px rgba(61,43,31,0.06)" }}>
                <img src={order.image} alt={order.item} className="w-16 h-20 sm:w-20 sm:h-24 object-cover flex-shrink-0" style={{ borderRadius: "6px" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#3D2B1F", marginBottom: "2px" }}>{order.item}</p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "rgba(61,43,31,0.45)", letterSpacing: "0.5px" }}>
                        {order.id} · {order.type === "custom" ? "Custom Made" : "Ready-Made"} · {order.date}
                      </p>
                    </div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "16px", fontWeight: 500, color: "#C9A96E", flexShrink: 0 }}>${order.price}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <StatusIcon size={13} style={{ color: status.color }} />
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: status.color, fontWeight: 500 }}>{status.label}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {mockOrders.length === 0 && (
          <div className="text-center py-20">
            <Package size={40} style={{ color: "#C4846A", opacity: 0.3, margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#3D2B1F", marginBottom: "8px" }}>No orders yet</p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "rgba(61,43,31,0.5)", marginBottom: "24px" }}>Start shopping to see your orders here</p>
            <button onClick={() => navigate("/catalogue")} style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", borderRadius: "30px", border: "none", padding: "12px 32px", cursor: "pointer" }}>
              Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}