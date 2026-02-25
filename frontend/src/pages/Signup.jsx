import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Eye, EyeOff, ArrowRight, Mail, Lock, User, Check } from "lucide-react";
import ParticleBackground from "@/components/floatchat/ParticleBackground";

const passwordStrength = (pw) => {
  if (pw.length === 0) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "hsl(0,80%,60%)", "hsl(40,90%,55%)", "hsl(180,70%,45%)", "hsl(140,70%,45%)"];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const strength = passwordStrength(form.password);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (strength < 2) { setError("Please choose a stronger password."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    navigate("/dashboard");
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", icon: User, placeholder: "Dr. Jane Smith", autocomplete: "name" },
    { key: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "you@research.org", autocomplete: "email" },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-navy-deep py-8">
      {/* 3D Wave particle background */}
      <div className="absolute inset-0">
        <ParticleBackground variant="wave" className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/95 via-navy-ocean/75 to-navy-deep/95 pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-teal/6 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center shadow-teal">
            <Waves className="w-4 h-4 text-white" strokeWidth={2.5} />
          </motion.div>
          <span className="font-bold text-lg text-white tracking-tight">Float<span className="text-gradient">Chat</span></span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex w-14 h-14 rounded-2xl bg-gradient-teal items-center justify-center mb-5 shadow-teal">
              <Waves className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-white mb-1.5">Create your account</h1>
            <p className="text-white/50 text-sm">Join the global ocean research community</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ key, label, type, icon: Icon, placeholder, autocomplete }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5 block">{label}</label>
                <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${focused === key ? "border-teal bg-white/8" : "border-white/10 bg-white/5"}`}>
                  <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={set(key)}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused("")}
                    placeholder={placeholder}
                    autoComplete={autocomplete}
                    className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm outline-none"
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5 block">Password</label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${focused === "pass" ? "border-teal bg-white/8" : "border-white/10 bg-white/5"}`}>
                <Lock className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused("")}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        animate={{ backgroundColor: i <= strength ? strengthColor[strength] : "hsl(0 0% 30%)" }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${focused === "confirm" ? "border-teal bg-white/8" : "border-white/10 bg-white/5"}`}>
                <Lock className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused("")}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm outline-none"
                />
                {form.confirm && form.password === form.confirm && (
                  <Check className="w-4 h-4 text-teal" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0 16px 48px -8px hsl(180 87% 35% / 0.6)" }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-teal text-white font-bold text-sm cursor-pointer relative overflow-hidden disabled:opacity-70 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-white/40 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-teal hover:text-teal-light transition-colors font-semibold cursor-pointer">Sign in</Link>
          </p>
          <p className="text-center text-[10px] text-white/25 mt-3">
            By creating an account you agree to our{" "}
            <a href="#" className="underline hover:text-white/50 transition-colors cursor-pointer">Terms</a> &amp;{" "}
            <a href="#" className="underline hover:text-white/50 transition-colors cursor-pointer">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
