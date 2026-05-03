import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { Sparkles, ChevronDown } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 30 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] } },
});

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar />

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, #C4846A 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C9A96E 0%, transparent 50%)` }} />

        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full opacity-20"
            style={{ width: `${8 + i * 4}px`, height: `${8 + i * 4}px`, backgroundColor: i % 2 === 0 ? "#C4846A" : "#C9A96E", top: `${10 + i * 10}%`, left: `${5 + i * 12}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ border: "1px solid #C9A96E", backgroundColor: "rgba(201,169,110,0.08)" }}>
            <Sparkles size={12} style={{ color: "#C9A96E" }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#C9A96E", letterSpacing: "2px", textTransform: "uppercase" }}>
              Couture & Ready-to-Wear
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} className="mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 700, color: "#3D2B1F", lineHeight: 1, letterSpacing: "-2px" }}>
            RANIA
          </motion.h1>

          <motion.p {...fadeUp(0.35)} className="mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 3vw, 26px)", fontStyle: "italic", color: "#C4846A", letterSpacing: "1px" }}>
            Dressed to be you.
          </motion.p>

          <motion.p {...fadeUp(0.45)} className="mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "'Jost', sans-serif", fontSize: "15px", fontWeight: 300, color: "#3D2B1F", lineHeight: 1.8, opacity: 0.75 }}>
            RANIA is a Romanian couture boutique offering handcrafted ready-to-wear dresses and fully personalised custom gowns made to your exact measurements. Every piece is designed with intention — celebrating femininity, quality craftsmanship, and the woman who wears it.
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button onClick={() => navigate("/catalogue")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-4"
              style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", border: "none", cursor: "pointer" }}>
              Shop Collection
            </motion.button>
            <motion.button onClick={() => navigate("/custom-order")} whileHover={{ backgroundColor: "#C4846A", color: "#FAF6F0" }} whileTap={{ scale: 0.97 }}
              className="px-10 py-4"
              style={{ backgroundColor: "transparent", color: "#C4846A", fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", border: "1.5px solid #C4846A", cursor: "pointer" }}>
              Order Custom
            </motion.button>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#3D2B1F", letterSpacing: "2px" }}>SCROLL</span>
          <ChevronDown size={14} style={{ color: "#3D2B1F" }} />
        </motion.div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#3D2B1F", marginBottom: "8px" }}>Curated for Her</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", color: "#C4846A" }}>Every dress tells a story</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Ready-Made", subtitle: "Shop the Collection", desc: "Carefully crafted dresses ready to wear. Each piece designed with love and attention to detail.", action: () => navigate("/catalogue"), img: "https://images.unsplash.com/photo-1759893362613-8bb8bb057af1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
            { title: "Custom Order", subtitle: "Your Vision, Our Craft", desc: "Upload your inspiration, choose your fabric, share your measurements — we'll create it perfectly.", action: () => navigate("/custom-order"), img: "https://images.unsplash.com/photo-1756483509162-b92ea967a884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
            { title: "Virtual Try-On", subtitle: "See Before You Buy", desc: "Preview your custom dress on a mannequin built to your exact dimensions before we begin sewing.", action: () => navigate("/try-on"), img: "https://images.unsplash.com/photo-1760287363707-851f4780b98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
          ].map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.12 }} viewport={{ once: true }}
              className="group cursor-pointer overflow-hidden" style={{ borderRadius: "4px" }} onClick={cat.action}>
              <div className="relative overflow-hidden h-72">
                <motion.img src={cat.img} alt={cat.title} className="w-full h-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(61,43,31,0.8) 0%, transparent 50%)" }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#C9A96E", textTransform: "uppercase", marginBottom: "4px" }}>{cat.subtitle}</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#FAF6F0" }}>{cat.title}</h3>
                </div>
              </div>
              <div className="p-4" style={{ backgroundColor: "#FFFFFF" }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 300, color: "#3D2B1F", lineHeight: 1.7, opacity: 0.8 }}>{cat.desc}</p>
                <button className="mt-3" style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1.5px", color: "#C4846A", textTransform: "uppercase", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Explore →</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#3D2B1F" }}>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 32px)", fontStyle: "italic", color: "#F0E6D3", lineHeight: 1.6 }}>
          "Every woman deserves a dress that makes her feel like the most beautiful version of herself."
        </motion.p>
        <p className="mt-6" style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", color: "#C9A96E", textTransform: "uppercase" }}>— Rania, Founder</p>
      </section>

      <footer className="py-10 px-6 text-center" style={{ backgroundColor: "#3D2B1F", borderTop: "1px solid rgba(240,230,211,0.1)" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#F0E6D3", marginBottom: "8px" }}>RANIA</p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "rgba(240,230,211,0.4)", letterSpacing: "1px" }}>© 2026 Rania Boutique. All rights reserved.</p>
      </footer>
    </div>
  );
}