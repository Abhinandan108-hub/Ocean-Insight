import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const RAW_DATA = `{
  "station_parameters": ["PRES","TEMP","PSAL"],
  "data": [
    [5.0, 24.831, 35.042],
    [10.0, 24.829, 35.041],
    [20.0, 24.754, 35.049],
    [30.0, 24.213, 35.107],
    [50.0, 22.684, 35.194],
    [75.0, 20.115, 35.387],
    [100.0, 18.442, 35.456],
    [150.0, 15.234, 35.312],
    [200.0, 13.871, 35.198],
    [300.0, 11.542, 35.087],
    [400.0, 9.876, 34.982],
    [500.0, 7.654, 34.876]
  ],
  "qc_flags": [1,1,1,1,1,1,1,2,1,1,1,1],
  "cycle_number": 247,
  "wmo_id": "5904671"
}`;

const depthProfile = [
  { depth: 5, temp: 24.8, color: "hsl(0, 85%, 55%)" },
  { depth: 20, temp: 24.7, color: "hsl(10, 80%, 55%)" },
  { depth: 50, temp: 22.7, color: "hsl(25, 75%, 50%)" },
  { depth: 100, temp: 18.4, color: "hsl(35, 70%, 50%)" },
  { depth: 200, temp: 13.9, color: "hsl(180, 60%, 45%)" },
  { depth: 300, temp: 11.5, color: "hsl(195, 65%, 40%)" },
  { depth: 500, temp: 7.7, color: "hsl(210, 70%, 38%)" },
];

export default function ComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const dragging = useRef(false);

  const handleMove = (e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(x);
  };

  const startDrag = () => { dragging.current = true; };
  const stopDrag = () => { dragging.current = false; };

  return (
    <section className="py-28 bg-gradient-section relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">Before vs After</p>
          <h2 className="text-display font-extrabold text-foreground mb-5">
            From raw NetCDF to visual insight
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Slide to compare raw ocean data with FloatChat's AI-powered visualization. See how we transform complex datasets into actionable research insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative rounded-2xl border border-ocean-border overflow-hidden shadow-card-hover bg-card h-[420px] select-none cursor-col-resize"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchEnd={stopDrag}
          >
            {/* LEFT: Raw Data */}
            <div className="absolute inset-0 bg-[#0d1117] p-6 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-white/40 text-xs font-mono ml-2">float_5904671_cycle247.json</span>
              </div>
              <pre className="text-[11px] font-mono leading-relaxed text-green-400/80 overflow-hidden whitespace-pre">
                {RAW_DATA}
              </pre>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-white/50 font-mono">Raw NetCDF / JSON</span>
              </div>
            </div>

            {/* RIGHT: FloatChat Visual */}
            <div className="absolute inset-0 bg-card p-6" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-teal flex items-center justify-center">
                    <span className="text-white text-xs font-bold">FC</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">FloatChat Visual Insight</span>
                </div>
                <span className="text-[10px] text-primary font-semibold px-2 py-1 rounded-full bg-primary/10">WMO: 5904671</span>
              </div>

              {/* Depth profile visualization */}
              <div className="flex gap-6 mt-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground mb-3">Temperature Depth Profile</p>
                  <div className="flex flex-col gap-1">
                    {depthProfile.map((d, i) => (
                      <motion.div
                        key={d.depth}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${(d.temp / 25) * 100}%` } : {}}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-[10px] text-muted-foreground font-mono w-10 text-right flex-shrink-0">{d.depth}m</span>
                        <motion.div
                          className="h-5 rounded-r-md flex items-center justify-end pr-2"
                          style={{ background: d.color, minWidth: 20 }}
                        >
                          <span className="text-[9px] text-white font-bold">{d.temp}°C</span>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="w-32 flex-shrink-0">
                  <p className="text-xs font-bold text-foreground mb-3">Summary</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Surface", value: "24.8°C" },
                      { label: "Thermocline", value: "~50m" },
                      { label: "QC Status", value: "Good ✓" },
                      { label: "Cycle", value: "#247" },
                    ].map((s) => (
                      <div key={s.label} className="text-left">
                        <p className="text-[9px] text-muted-foreground">{s.label}</p>
                        <p className="text-xs font-bold text-foreground">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-xs text-primary font-semibold">FloatChat AI Output</span>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div className="h-full w-0.5 bg-primary shadow-lg shadow-primary/40" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-glow-teal cursor-grab active:cursor-grabbing">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 2L1 7L4 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 2L13 7L10 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
