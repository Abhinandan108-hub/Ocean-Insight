import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import oceanHero from "@/assets/ocean-hero-login.jpg";
import aquawaveLogo from "@/assets/aquawave-logo.png";

const passwordStrength = (pw) => {
  if (!pw.length) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "hsl(0,80%,60%)", "hsl(40,90%,55%)", "hsl(180,70%,45%)", "hsl(140,70%,45%)"];

export default function Signup() {
  const navigate = useNavigate();
  const { register, isAuthenticated, error: authError } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const strength = passwordStrength(form.password);

  useEffect(() => { if (isAuthenticated) navigate("/dashboard"); }, [isAuthenticated, navigate]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password) || !/[!@#$%^&*]/.test(form.password)) {
      setError("Password must be 8+ chars with uppercase, number, and special character."); return;
    }
    try { setLoading(true); await register(form.name, form.email, form.password, form.confirm); navigate("/dashboard"); }
    catch { setError(authError || "Registration failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={oceanHero} alt="Deep ocean" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="absolute bottom-12 left-10 right-10">
          <div className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/15">
            <p className="text-white text-xl font-bold mb-1">Join AquaWave</p>
            <p className="text-white/60 text-sm">Start your ocean research journey with AI</p>
          </div>
        </motion.div>
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-teal/30 blur-sm" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        <div className="absolute inset-0 ocean-grid opacity-30 pointer-events-none dark:opacity-10" />
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md relative z-10 py-8">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <img src={aquawaveLogo} alt="AquaWave" className="w-10 h-10 rounded-xl object-contain" />
            <span className="font-bold text-xl text-foreground tracking-tight">Aqua<span className="text-gradient">Wave</span></span>
          </Link>

          <h1 className="text-3xl font-extrabold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">Join the global ocean research community</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { key: "name", icon: User, placeholder: "Full Name", type: "text", ac: "name" },
              { key: "email", icon: Mail, placeholder: "Email Address", type: "email", ac: "email" },
            ].map(({ key, icon: Icon, placeholder, type, ac }) => (
              <div key={key} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 focus-within:border-primary transition-colors">
                <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} autoComplete={ac}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" />
              </div>
            ))}

            <div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 focus-within:border-primary transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Password (min 8 chars)" autoComplete="new-password"
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4].map((i) => (
                      <motion.div key={i} className="h-1 flex-1 rounded-full"
                        animate={{ backgroundColor: i <= strength ? strengthColor[strength] : "hsl(0 0% 30%)" }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 focus-within:border-primary transition-colors">
              <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Confirm Password" autoComplete="new-password"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" />
              {form.confirm && form.password === form.confirm && <Check className="w-4 h-4 text-primary" />}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</motion.p>
              )}
            </AnimatePresence>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-teal text-primary-foreground font-bold text-sm cursor-pointer disabled:opacity-70 shadow-glow-teal mt-2">
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold cursor-pointer">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
