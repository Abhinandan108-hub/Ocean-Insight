import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Droplets, FlaskConical, Leaf, Thermometer, Waves, Atom } from "lucide-react";

const parameters = [
  {
    icon: Thermometer,
    symbol: "T",
    name: "Temperature",
    unit: "°C",
    range: "-2 to 35",
    desc: "Precision temperature profiles from surface to 2000m depth with ±0.002°C accuracy.",
    color: "hsl(0, 75%, 55%)",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    icon: Droplets,
    symbol: "S",
    name: "Salinity",
    unit: "PSU",
    range: "33–37",
    desc: "Practical salinity derived from conductivity measurements across the full water column.",
    color: "hsl(200, 80%, 50%)",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Waves,
    symbol: "O₂",
    name: "Dissolved Oxygen",
    unit: "μmol/kg",
    range: "0–350",
    desc: "Oxygen concentration profiles critical for understanding ocean ventilation and biological activity.",
    color: "hsl(180, 87%, 35%)",
    gradient: "from-teal-500/20 to-emerald-500/20",
  },
  {
    icon: FlaskConical,
    symbol: "pH",
    name: "Acidity",
    unit: "pH units",
    range: "7.5–8.4",
    desc: "Ocean acidification monitoring through high-precision pH measurements across depth profiles.",
    color: "hsl(270, 70%, 55%)",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    icon: Atom,
    symbol: "NO₃⁻",
    name: "Nitrate",
    unit: "μmol/kg",
    range: "0–45",
    desc: "Nitrate concentration essential for understanding marine nutrient cycles and primary productivity.",
    color: "hsl(45, 80%, 50%)",
    gradient: "from-amber-500/20 to-yellow-500/20",
  },
  {
    icon: Leaf,
    symbol: "Chl-a",
    name: "Chlorophyll",
    unit: "mg/m³",
    range: "0–30",
    desc: "Chlorophyll-a fluorescence for phytoplankton biomass estimation and biological productivity mapping.",
    color: "hsl(140, 70%, 45%)",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
];

export default function BGCArgoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 ocean-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">BGC-Argo Sensors</span>
          </div>
          <h2 className="text-display font-extrabold text-foreground mb-5">
            Beyond temperature & salinity
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            FloatChat supports the full suite of BGC-Argo biogeochemical parameters.
            Research-grade chemical data, made conversational.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {parameters.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, boxShadow: "0 20px 48px -12px hsl(211 73% 13% / 0.12)" }}
                className="bg-card rounded-2xl p-6 border border-ocean-border shadow-card relative overflow-hidden group"
              >
                {/* Gradient bg on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Shimmer top */}
                <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${p.color} 50%, transparent 100%)`, backgroundSize: "200% 100%" }}
                    animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: p.color }} strokeWidth={1.8} />
                    </div>
                    <span className="text-2xl font-black font-mono" style={{ color: p.color }}>{p.symbol}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground font-mono">{p.unit}</span>
                    <span className="text-[10px] text-muted-foreground/60">·</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Range: {p.range}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
