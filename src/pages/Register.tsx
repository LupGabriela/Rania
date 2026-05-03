import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const inputStyle = { backgroundColor: "#F0E6D3", border: "none", borderRadius: "8px", fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#3D2B1F" };
  const labelStyle = { fontFamily: "'Jost', sans-serif", fontSize: "12px", fontWeight: 500 as const, letterSpacing: "1px", color: "#3D2B1F", textTransform: "uppercase" as const };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#FAF6F0" }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md py-12 px-8 sm:px-10"
        style={{ backgroundColor: "#FFFFFF", borderRadius: "4px", boxShadow: "0 4px 40px rgba(61,43,31,0.08)" }}
      >
        <div className="text-center mb-10">
          <Link to="/"><h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700, color: "#3D2B1F" }}>RANIA</h1></Link>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", fontStyle: "italic", color: "#C4846A", marginTop: "4px" }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Your full name" required className="w-full px-4 py-3 outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="w-full px-4 py-3 outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required className="w-full px-4 py-3 pr-12 outline-none" style={inputStyle} />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required className="w-full px-4 py-3 pr-12 outline-none" style={inputStyle} />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button type="submit" whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }} className="w-full py-3.5 mt-2"
            style={{ backgroundColor: "#C4846A", color: "#FAF6F0", fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", borderRadius: "30px", border: "none", cursor: "pointer" }}>
            Create Account
          </motion.button>
        </form>

        <p className="text-center mt-6" style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#3D2B1F", opacity: 0.6 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#C9A96E", opacity: 1, textDecoration: "underline" }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
}