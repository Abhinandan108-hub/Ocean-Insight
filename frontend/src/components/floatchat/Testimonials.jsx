import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Physical Oceanographer",
    institution: "Scripps Institution of Oceanography",
    avatar: "SC",
    color: "hsl(180, 87%, 35%)",
    stars: 5,
    quote: "FloatChat has fundamentally changed how I interact with ARGO data. What used to take weeks of Python scripting now takes minutes. The AI accurately interprets complex oceanographic queries I never thought a language model could handle.",
  },
  {
    name: "Prof. James Okafor",
    role: "Climate Research Lead",
    institution: "NOAA Pacific Marine Laboratory",
    avatar: "JO",
    color: "hsl(200, 80%, 45%)",
    stars: 5,
    quote: "The depth of ocean domain knowledge built into FloatChat is remarkable. It understands WMO float IDs, QC flags, pressure-depth conversions — things no general AI tool gets right. This is research-grade tooling.",
  },
  {
    name: "Dr. Amira Hassan",
    role: "Senior Data Scientist",
    institution: "European Centre for Ocean Research",
    avatar: "AH",
    color: "hsl(170, 75%, 40%)",
    stars: 5,
    quote: "Our lab switched from manual NetCDF workflows to FloatChat six months ago. Productivity has tripled. The AI chat interface makes ocean data accessible to my marine biology students who have no programming background.",
  },
  {
    name: "Dr. Kenji Watanabe",
    role: "Pacific Basin Specialist",
    institution: "JAMSTEC Research Center",
    avatar: "KW",
    color: "hsl(190, 85%, 38%)",
    stars: 5,
    quote: "I tested FloatChat against our in-house MATLAB analysis pipeline on a complex El Niño detection query. FloatChat was 40x faster and produced comparable scientific accuracy. Absolutely transformative for our team.",
  },
  {
    name: "Dr. Lucia Martínez",
    role: "Ocean Carbon Cycle Researcher",
    institution: "IAEA Ocean Environment Lab",
    avatar: "LM",
    color: "hsl(160, 70%, 38%)",
    stars: 5,
    quote: "The anomaly detection and trend summarization features have accelerated our climate model validation by a full quarter. FloatChat understands the nuances of BGC-Argo sensors in ways that surprised even our senior scientists.",
  },
  {
    name: "Prof. David Nduka",
    role: "Marine Physics Department Head",
    institution: "University of Cape Town, SEACAP",
    avatar: "DN",
    color: "hsl(210, 80%, 42%)",
    stars: 5,
    quote: "Finally, a platform that treats oceanographers as its primary user. The natural language queries map perfectly to ARGO parameters, the visualizations are publication-ready, and the response speed is genuinely impressive.",
  },
];

const institutions = [
  "NOAA", "Scripps Oceanography", "JAMSTEC", "IFREMER", "NERC", "ESA", "CSIRO", "MBARI",
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className="py-28 bg-gradient-section relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Social Proof</p>
          <h2 className="text-display font-extrabold text-foreground mb-5">
            Trusted by the world's ocean scientists
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Researchers from top institutions use FloatChat to accelerate their ocean data science workflows.
          </p>
        </motion.div>

        {/* Stars aggregate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-1.5 mb-16"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ rotate: -20, opacity: 0 }}
              animate={inView ? { rotate: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
            >
              <Star className="w-5 h-5 fill-current text-amber-400" />
            </motion.div>
          ))}
          <span className="ml-2 text-sm text-muted-foreground font-medium">4.9/5 · 200+ researchers</span>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px -12px hsl(211 73% 13% / 0.12)" }}
              className="bg-card rounded-2xl p-7 border border-ocean-border shadow-card relative overflow-hidden group"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/10 absolute top-5 right-5" />

              {/* Shimmer top */}
              <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(90deg, transparent 0%, ${t.color} 50%, transparent 100%)`, backgroundSize: "200% 100%" }}
                  animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-[10px] text-primary font-semibold mt-0.5">{t.institution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Institution logos strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-center text-xs text-muted-foreground font-medium uppercase tracking-widest mb-6">
            Used by researchers at
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {institutions.map((inst, i) => (
              <motion.div
                key={inst}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ scale: 1.06, borderColor: "hsl(var(--primary))" }}
                className="px-5 py-2.5 rounded-full border border-ocean-border bg-card text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-200 cursor-default"
              >
                {inst}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
