import { Database, MessageSquare, Cpu, LineChart } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Upload or Select Dataset",
    desc: "Connect to the global ARGO network or upload your own float data. FloatChat supports NetCDF, CSV, and direct API ingestion with automated schema detection.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Ask a Natural Language Question",
    desc: "Type your research question in plain English. No SQL, no complex query builders — just describe what you want to understand about the ocean.",
  },
  {
    number: "03",
    icon: Cpu,
    title: "AI Parses and Analyzes",
    desc: "Our ocean-specialized AI models interpret your intent, construct optimal queries, apply quality control flags, and run statistical analyses in seconds.",
  },
  {
    number: "04",
    icon: LineChart,
    title: "Visual Insights Generated",
    desc: "Interactive charts, maps, and summary reports are generated automatically. Export to PDF, PNG, or share live dashboards with your research team.",
  },
];

function Step({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-8 items-start group"
    >
      {/* Step icon */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.12, rotate: 6 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-12 h-12 rounded-xl bg-card border border-ocean-border flex items-center justify-center shadow-card group-hover:border-primary group-hover:shadow-teal transition-all duration-300 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(180 87% 35% / 0.12) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
          <Icon className="w-5 h-5 text-primary relative z-10" strokeWidth={1.8} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="step-number text-xs font-bold text-primary/60 tracking-widest font-mono">
            {step.number}
          </span>
          <motion.div
            className="h-px flex-1 bg-ocean-border origin-left"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          />
        </div>
        <h3 className="text-heading font-bold text-foreground mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="how-it-works" className="py-28 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Workflow
          </p>
          <h2 className="text-display font-extrabold text-foreground mb-5">
            From raw data to research insights in four steps
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            FloatChat handles the complexity of ocean data science so you can focus on discovery.
          </p>
        </motion.div>

        {/* Steps with SVG line animation */}
        <div className="relative">
          {/* Animated SVG connector line */}
          <div className="absolute left-[22px] top-8 bottom-8 w-px hidden lg:block overflow-hidden">
            <motion.svg
              width="2"
              height="100%"
              className="absolute inset-0"
              viewBox="0 0 2 400"
              preserveAspectRatio="none"
            >
              <motion.line
                x1="1" y1="0" x2="1" y2="400"
                stroke="hsl(180 87% 35%)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={headerInView ? { pathLength: 1, opacity: 0.4 } : {}}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              />
            </motion.svg>
          </div>

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
              <Step key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
