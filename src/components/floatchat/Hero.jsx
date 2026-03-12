import { ArrowRight, ChevronDown } from "lucide-react";
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
    if (!deleting && displayed.length < current.length) timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 40);
    else if (!deleting && displayed.length === current.length) timeout = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && displayed.length > 0) timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
    else if (deleting && displayed.length === 0) { setDeleting(false); setIdx((i) => (i + 1) % TYPING_STRINGS.length); }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return <span className="text-gradient">{displayed}<span className="animate-pulse text-primary ml-0.5">|</span></span>;
}

function LiveFloatCounter() {
  const [count, setCount] = useState(3241);
  useEffect(() => { const i = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 5) - 2), 3000); return () => clearInterval(i); }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
      </span>
      <span className="text-white/80 text-xs font-mono">Receiving data from <span className="text-primary font-bold">{count.toLocaleString()}</span> floats...</span>
    </motion.div>
  );
}

const particles = Array.from({ length: 24 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 4 + 2, duration: Math.random() * 6 + 4, delay: Math.random() * 4 }));

const globeTooltips = [
  { x: "8%", y: "40%", wmo: "5904671", temp: "18.5°C", region: "North Atlantic", delay: 0.6 },
  { x: "75%", y: "20%", wmo: "2903458", temp: "24.2°C", region: "West Pacific", delay: 0.9 },
  { x: "60%", y: "75%", wmo: "6902845", temp: "12.1°C", region: "Southern Ocean", delay: 1.2 },
];

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -120]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const itemVariants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 ocean-grid opacity-100 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, hsl(180 87% 35% / 0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 80% at 20% 80%, hsl(211 73% 13% / 0.6) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {particles.map((p) => (
        <motion.span key={p.id} className="absolute rounded-full bg-primary/25 pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}

      <motion.div style={{ y: parallaxY, opacity: opacityFade }} className="container mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-7">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 w-fit">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-semibold uppercase tracking-widest">AI-Powered Ocean Intelligence</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-hero text-white font-extrabold leading-[1.08]">
              Discover &amp; Visualize{" "}<TypingText />
            </motion.h1>

            <motion.div variants={itemVariants}><LiveFloatCounter /></motion.div>

            <motion.p variants={itemVariants} className="text-lg text-white/60 leading-relaxed max-w-[520px] font-light">
              AquaWave transforms complex ARGO float datasets into natural language conversations. Query, explore, and visualize ocean measurements with research-grade precision.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-1">
              <Link to="/signup">
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-teal text-primary-foreground font-semibold text-sm cursor-pointer shadow-glow-teal">
                  <span className="flex items-center gap-2">Get Started Free <ArrowRight className="w-4 h-4" /></span>
                </motion.span>
              </Link>
              <a href="#how-it-works">
                <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm cursor-pointer shadow-glow-subtle">
                  How It Works
                </motion.span>
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-8 pt-2 border-t border-white/10">
              {[{ value: "10K+", label: "Floats Analyzed" }, { value: "1M+", label: "Data Points" }, { value: "50+", label: "Researchers" }].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.12 }}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/40 font-medium mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="hidden lg:flex justify-center items-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.4 }}
              className="relative w-full max-w-[520px] aspect-square">
              <OceanGlobe className="w-full h-full" />
              {globeTooltips.map((tip, i) => (
                <div key={tip.wmo} className="absolute z-20" style={{ left: tip.x, top: tip.y, pointerEvents: "auto" }}
                  onMouseEnter={() => setHoveredTooltip(i)} onMouseLeave={() => setHoveredTooltip(null)}>
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: tip.delay }} className="relative cursor-pointer">
                    <span className="block w-3 h-3 rounded-full bg-primary border-2 border-white/30 shadow-lg shadow-primary/50" />
                    <motion.span className="absolute inset-0 rounded-full border border-primary/60" animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
                  </motion.div>
                  {hoveredTooltip === i && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute left-5 top-0 z-30 w-48 glass rounded-xl px-3.5 py-3 border border-primary/20 shadow-2xl">
                      <p className="text-[10px] text-white/40 font-mono mb-1">WMO ID: {tip.wmo}</p>
                      <p className="text-sm text-white font-bold">{tip.temp}</p>
                      <p className="text-xs text-primary font-semibold">{tip.region}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.a href="#features" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors cursor-pointer z-10">
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.a>
    </section>
  );
}
