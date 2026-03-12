import {
  MessageSquare, Activity, Map, SlidersHorizontal, ShieldCheck, BrainCircuit,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: MessageSquare,
    title: "Conversational AI Query",
    desc: "Ask questions in plain English and receive precise, data-backed insights from ARGO float measurements without writing a single line of code.",
    color: "hsl(180, 87%, 35%)",
  },
  {
    icon: Activity,
    title: "Real-Time Data Streaming",
    desc: "Live ingestion of ARGO float telemetry. Observe salinity, temperature, and pressure profiles as they surface from the ocean floor.",
    color: "hsl(200, 80%, 45%)",
  },
  {
    icon: Map,
    title: "Interactive Ocean Map",
    desc: "Geospatial visualization of float trajectories across all ocean basins. Filter by region, depth, or date with intuitive controls.",
    color: "hsl(170, 75%, 40%)",
  },
  {
    icon: SlidersHorizontal,
    title: "Advanced Filtering",
    desc: "Multi-dimensional filtering across depth ranges, temporal windows, ocean basins, and measurement quality flags — all in real time.",
    color: "hsl(190, 85%, 38%)",
  },
  {
    icon: ShieldCheck,
    title: "Secure Role-Based Access",
    desc: "Enterprise-grade authentication with granular access controls. Share datasets with collaborators while protecting sensitive research.",
    color: "hsl(160, 70%, 38%)",
  },
  {
    icon: BrainCircuit,
    title: "AI Insight Generation",
    desc: "Automated anomaly detection, trend summarization, and pattern recognition powered by purpose-built ocean intelligence models.",
    color: "hsl(180, 87%, 35%)",
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: "0 20px 48px -12px hsl(211 73% 13% / 0.18)" }}
      className="bg-card rounded-2xl p-7 border border-ocean-border shadow-card group cursor-default relative overflow-hidden"
    >
      {/* Spotlight effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 60%)`,
        }}
      />

      {/* Shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${feature.color} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
        />
      </div>

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.12, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-11 h-11 rounded-xl bg-teal-pale flex items-center justify-center mb-5"
      >
        <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
      </motion.div>

      {/* Content */}
      <h3 className="text-heading font-bold text-foreground mb-2.5">{feature.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>

      {/* Expand bar on hover */}
      <motion.div
        className="mt-6 h-0.5 rounded-full bg-primary/30"
        initial={{ width: "2rem" }}
        whileHover={{ width: "5rem" }}
        animate={inView ? {} : {}}
        style={{ originX: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}

export default function Features() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="features" className="py-28 bg-gradient-section overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Platform Capabilities
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <h2 className="text-display font-extrabold text-foreground max-w-lg">
              Everything you need to explore the deep ocean
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm lg:text-right">
              Built for oceanographers, climate scientists, and researchers who need
              precision at the speed of insight.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
