import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import ParticleBackground from "@/components/floatchat/ParticleBackground";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-navy-deep">
      {/* 3D Neural particle background */}
      <div className="absolute inset-0">
        <ParticleBackground variant="neural" className="w-full h-full" />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/95 via-navy-ocean/80 to-navy-deep/95 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-teal/6 blur-3xl pointer-events-none" />

      {/* Logo top left */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center shadow-teal"
          >
            <Waves className="w-4 h-4 text-white" strokeWidth={2.5} />
          </motion.div>
          <span className="font-bold text-lg text-white tracking-tight">
            Float<span className="text-gradient">Chat</span>
          </span>
        </Link>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex w-14 h-14 rounded-2xl bg-gradient-teal items-center justify-center mb-5 shadow-teal"
            >
              <Waves className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-white mb-1.5">Welcome back</h1>
            <p className="text-white/50 text-sm">Sign in to your FloatChat account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5 block">Email</label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${focused === "email" ? "border-teal bg-white/8" : "border-white/10 bg-white/5"}`}>
                <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="you@research.org"
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm outline-none"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1.5 block">Password</label>
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${focused === "pass" ? "border-teal bg-white/8" : "border-white/10 bg-white/5"}`}>
                <Lock className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused("")}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm outline-none"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <a href="#" className="text-xs text-teal hover:text-teal-light transition-colors cursor-pointer">Forgot password?</a>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
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
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
              <span className="absolute inset-0 bg-white/10 scale-0 hover:scale-150 opacity-0 hover:opacity-100 transition-all duration-500 rounded-xl" />
            </motion.button>
          </form>

          <div className="relative flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-teal/40 text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            Continue as Demo User
          </motion.button>

          <p className="text-center text-xs text-white/40 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal hover:text-teal-light transition-colors font-semibold cursor-pointer">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
