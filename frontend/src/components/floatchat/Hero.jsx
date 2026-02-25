import { ArrowRight, ChevronDown, Waves } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OceanGlobe from "./OceanGlobe";
import { Link } from "react-router-dom";

const TYPING_STRINGS = [
  "ARGO Ocean Data Through Conversation",
  "Deep-Sea Profiles With Natural Language",
  "Ocean Anomalies With AI Precision",
  "Climate Trends Across Global Float Networks",
];

function TypingText() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_STRINGS[idx];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 40);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % TYPING_STRINGS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="text-gradient">
      {displayed}
      <span className="animate-pulse text-teal ml-0.5">|</span>
    </span>
  );
}

// Floating particles
const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -120]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden"
    >
      {/* Ocean grid */}
      <div className="absolute inset-0 ocean-grid opacity-100 pointer-events-none" />

      {/* Radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-teal/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-navy-deep/50 blur-3xl pointer-events-none" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-teal/25 pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="container mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 w-fit">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/30 bg-teal/10 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                <span className="text-teal text-xs font-semibold uppercase tracking-widest">
                  AI-Powered Ocean Intelligence
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-hero text-white font-extrabold leading-[1.08]">
              Discover &amp; Visualize{" "}
              <TypingText />
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-lg text-white/60 leading-relaxed max-w-[520px] font-light">
              FloatChat transforms complex ARGO float datasets into natural language
              conversations. Query, explore, and visualize ocean measurements with
              research-grade precision — no SQL required.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-1">
              <Link to="/signup">
                <motion.span
                  whileHover={{ scale: 1.05, boxShadow: "0 16px 48px -8px hsl(180 87% 35% / 0.6)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-teal text-primary-foreground font-semibold text-sm cursor-pointer relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl" />
                </motion.span>
              </Link>
              <a href="#how-it-works">
                <motion.span
                  whileHover={{ scale: 1.03, backgroundColor: "hsl(0 0% 100% / 0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm cursor-pointer"
                >
                  How It Works
                </motion.span>
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={itemVariants} className="flex gap-8 pt-2 border-t border-white/10">
              {[
                { value: "10K+", label: "Floats Analyzed" },
                { value: "1M+", label: "Data Points" },
                { value: "50+", label: "Researchers" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                >
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/40 font-medium mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D Ocean Globe */}
          <div className="hidden lg:flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[520px] aspect-square"
            >
              <OceanGlobe className="w-full h-full" />
              {/* Floating info cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-0 glass rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-xl pointer-events-none"
              >
                <div className="flex items-center gap-2.5">
                  <motion.div className="w-2 h-2 rounded-full bg-teal" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <div>
                    <p className="text-white text-xs font-semibold">3,241 floats active</p>
                    <p className="text-white/40 text-[10px]">Global ARGO Network · Live</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-8 right-0 glass rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-xl pointer-events-none"
              >
                <div>
                  <p className="text-teal text-xs font-bold">+0.84°C</p>
                  <p className="text-white/50 text-[10px]">Pacific anomaly 2023</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#features"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors cursor-pointer z-10"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.a>
    </section>
  );
}
