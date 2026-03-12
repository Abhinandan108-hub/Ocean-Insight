import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const metrics = [
  { value: 10000, suffix: "+", label: "Floats Analyzed", desc: "Active ARGO profiling floats in our network" },
  { value: 1, suffix: "M+", label: "Data Points", desc: "Ocean measurements processed daily" },
  { value: 99.9, suffix: "%", label: "Uptime", desc: "Platform reliability SLA guarantee" },
  { value: 50, suffix: "+", label: "Researchers", desc: "Scientific teams using FloatChat globally" },
];

function useCountUp(target, decimals = 0, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(parseFloat(current.toFixed(decimals)));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target, decimals]);
  return count;
}

function MetricCard({ value, suffix, label, desc, index, active }) {
  const decimals = value % 1 !== 0 ? 1 : 0;
  const count = useCountUp(value, decimals, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="text-center group relative"
    >
      {/* Glow behind number */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-teal/8 blur-2xl group-hover:bg-teal/16 transition-all duration-500 pointer-events-none" />

      <div className="mb-1 relative">
        <span className="text-5xl font-extrabold text-white tracking-tight">
          {decimals > 0 ? count.toFixed(1) : Math.floor(count).toLocaleString()}
        </span>
        <span className="text-3xl font-bold text-teal ml-1">{suffix}</span>
      </div>
      <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-sm text-white/40 leading-snug max-w-[160px] mx-auto">{desc}</p>

      {/* Bottom accent line */}
      <motion.div
        className="mx-auto mt-4 h-px bg-teal/30 rounded-full"
        initial={{ width: 0 }}
        animate={active ? { width: "3rem" } : {}}
        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
      />
    </motion.div>
  );
}

export default function Metrics() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="metrics" className="py-28 bg-gradient-metrics relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 ocean-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal/4 blur-3xl pointer-events-none" />

      {/* Morphing shape top */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal/5 pointer-events-none"
        animate={{ borderRadius: ["50% 40% 60% 50%", "40% 60% 50% 60%", "60% 40% 50% 40%", "50% 40% 60% 50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-teal/3 pointer-events-none"
        animate={{ borderRadius: ["40% 60% 50% 60%", "50% 40% 60% 50%", "60% 40% 50% 40%", "40% 60% 50% 60%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-4">
            Platform Scale
          </p>
          <h2 className="text-display font-extrabold text-white mb-4">
            Trusted by the global ocean research community
          </h2>
          <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed">
            From small labs to international research consortia — FloatChat scales with your scientific ambition.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} {...m} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
