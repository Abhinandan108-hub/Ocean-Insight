import { CheckCircle2, BarChart2, Layers, Wifi } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

const benefits = [
  "Temperature & salinity profiles at depth",
  "Dissolved oxygen concentration maps",
  "Float trajectory visualization by WMO ID",
  "Multi-year trend analysis with AI summaries",
  "Anomaly detection & alert thresholds",
];

const chartBars = [42, 67, 55, 80, 63, 74, 58, 88, 71, 95, 82, 76];

const floatPositions = [
  { x: 22, y: 35, active: true },
  { x: 45, y: 55, active: false },
  { x: 68, y: 28, active: true },
  { x: 33, y: 70, active: true },
  { x: 78, y: 60, active: false },
  { x: 15, y: 48, active: true },
  { x: 58, y: 42, active: true },
  { x: 85, y: 72, active: false },
];

export default function DataPreview() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-80px" });
  const rightInView = useInView(rightRef, { once: true, margin: "-80px" });

  return (
    <section id="data" className="py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -48 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              Data Visualization
            </p>
            <h2 className="text-display font-extrabold text-foreground mb-6">
              Research-grade data, made visual and conversational
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
              FloatChat connects directly to the Global ARGO data network — parsing,
              structuring, and presenting ocean measurements in an interface built for
              deep exploration.
            </p>

            <ul className="flex flex-col gap-3.5 mb-10">
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -24 }}
                  animate={leftInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-foreground font-medium">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-4">
              <motion.a
                href="#features"
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px -8px hsl(180 87% 35% / 0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-teal text-primary-foreground font-semibold text-sm cursor-pointer relative overflow-hidden group"
              >
                <span className="relative z-10">Explore Data</span>
                <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl" />
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-ocean-border text-foreground font-medium text-sm hover:bg-muted transition-colors cursor-pointer"
              >
                View Docs
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Mock Dashboard */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={rightInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-light rounded-3xl p-5 shadow-card-hover border border-white/60">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-teal"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-foreground">Live Dashboard</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Wifi className="w-3 h-3" />
                  <span>3,241 floats active</span>
                </div>
              </div>

              {/* Map mock with animated float pings */}
              <div className="relative bg-navy-deep rounded-2xl h-44 mb-4 overflow-hidden ocean-grid">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/80 to-navy-ocean/60" />
                {floatPositions.map((pos, i) => (
                  <div key={i} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                    <motion.div
                      className={`w-2.5 h-2.5 rounded-full border border-teal/50 ${pos.active ? "bg-teal" : "bg-teal/30"}`}
                      animate={pos.active ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    {pos.active && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-teal/40"
                        animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      />
                    )}
                  </div>
                ))}
                <div className="absolute bottom-3 right-3 glass rounded-lg px-2.5 py-1.5">
                  <span className="text-white/80 text-xs font-mono">ARGO Global Network</span>
                </div>
              </div>

              {/* Chart row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Animated bar chart */}
                <div className="bg-card rounded-xl p-4 border border-ocean-border">
                  <div className="flex items-center gap-1.5 mb-3">
                    <BarChart2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Temperature (°C)</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-14">
                    {chartBars.map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm"
                        initial={{ height: 0 }}
                        animate={rightInView ? { height: `${h}%` } : { height: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                        style={{
                          background: `hsl(180, ${60 + (h / 100) * 27}%, ${35 + (h / 100) * 15}%)`,
                          opacity: 0.7 + (h / 100) * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Avg Depth", value: "1,842 m", change: "+2.3%" },
                    { label: "Salinity", value: "34.8 PSU", change: "-0.1%" },
                    { label: "O₂ Conc.", value: "214 μmol", change: "+5.7%" },
                  ].map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={rightInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-card rounded-xl px-3 py-2 border border-ocean-border flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                        <p className="text-xs font-bold text-foreground">{m.value}</p>
                      </div>
                      <span className={`text-[10px] font-semibold ${m.change.startsWith("+") ? "text-teal" : "text-muted-foreground"}`}>
                        {m.change}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {["Pacific Ocean", "2023–Present", "0–2000m", "QC Flag: Good"].map((chip, i) => (
                  <motion.div
                    key={chip}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={rightInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="flex items-center gap-1.5 bg-teal-pale px-2.5 py-1 rounded-full cursor-pointer hover:bg-teal/10 transition-colors"
                  >
                    <Layers className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[10px] font-semibold text-primary">{chip}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
