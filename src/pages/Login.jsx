import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import oceanHero from "@/assets/ocean-hero-login.jpg";
import aquawaveLogo from "@/assets/aquawave-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError(authError || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={oceanHero} alt="Deep ocean exploration" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-12 left-10 right-10"
        >
          <div className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/15">
            <p className="text-white text-xl font-bold mb-1">Explore the Deep</p>
            <p className="text-white/60 text-sm">AI-powered ocean intelligence for researchers worldwide</p>
          </div>
        </motion.div>
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-teal/30 blur-sm" />
        <div className="absolute bottom-24 right-8 w-20 h-20 rounded-full bg-orange-400/20 blur-sm" />
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 ocean-grid opacity-30 pointer-events-none dark:opacity-10" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <Link to="/" className="flex items-center gap-3 mb-10 group">
            <img src={aquawaveLogo} alt="AquaWave" className="w-10 h-10 rounded-xl object-contain" />
            <span className="font-bold text-xl text-foreground tracking-tight">
              Aqua<span className="text-gradient">Wave</span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold text-foreground mb-2">Login</h1>
          <p className="text-muted-foreground text-sm mb-8">How do I get started with AquaWave?</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 focus-within:border-primary transition-colors">
              <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Username" className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" autoComplete="email" />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 focus-within:border-primary transition-colors">
              <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</motion.p>
              )}
            </AnimatePresence>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-teal text-primary-foreground font-bold text-sm cursor-pointer disabled:opacity-70 shadow-glow-teal">
              {loading ? "Signing in..." : "LOGIN NOW"}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs">Login with Others</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Login with <strong>Google</strong>
            </button>
            <button className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Login with <strong>Facebook</strong>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-semibold cursor-pointer">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
