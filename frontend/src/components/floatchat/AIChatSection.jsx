import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Waves, Send, Sparkles, RotateCcw, BarChart2 } from "lucide-react";

const DEMO_EXCHANGES = [
  {
    question: "Compare Pacific vs Indian Ocean",
    answer: "Comparison complete across 2,847 matched float pairs:\n\n• **Atlantic avg salinity**: 35.2 PSU (surface), 34.8 PSU (1000m)\n• **Indian Ocean avg salinity**: 35.6 PSU (surface), 34.9 PSU (1000m)\n• Indian Ocean shows higher evaporation-driven salinity above thermocline\n• Atlantic exhibits stronger halocline gradient between 200–600m",
    chart: [45, 62, 78, 55, 82, 91, 67, 73, 85, 60],
  },
  {
    question: "Find 2024 Temperature Anomalies",
    answer: "I analyzed 4,231 ARGO floats for 2024. Key findings:\n\n• Average surface temperature anomaly: **+0.84°C** above 1990–2020 baseline\n• Strongest warming: North Pacific (35°N–45°N), anomaly up to **+1.6°C**\n• La Niña signature detected in equatorial region through Q1\n• 847 floats recorded temperatures exceeding historical max",
    chart: [30, 42, 58, 75, 88, 92, 86, 79, 95, 88],
  },
  {
    question: "Show me Float #5904671",
    answer: "Float WMO 5904671 — Active since 2019:\n\n• **Current Position**: 32.4°N, 64.2°W (North Atlantic)\n• **Last Cycle**: #247, surfaced 2h ago\n• **Depth Range**: 0–2000m, 78 levels\n• **QC Status**: All parameters passed\n• **Sensors**: CTD + Dissolved O₂ + pH\n\nTrajectory shows 340km drift over last 30 cycles.",
    chart: [20, 35, 50, 65, 72, 68, 55, 48, 42, 38],
  },
];

const QUICK_CHIPS = [
  { label: "Compare Pacific vs Indian Ocean", icon: "🌊" },
  { label: "Find 2024 Temperature Anomalies", icon: "🌡️" },
  { label: "Show me Float #5904671", icon: "📍" },
  { label: "Detect Oxygen Minimum Zones", icon: "💨" },
  { label: "ENSO Signal Detection", icon: "⚡" },
];

function TypingResponse({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
      {displayed.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong> : part
      )}
      <span className="inline-block w-0.5 h-4 bg-teal ml-0.5 animate-pulse align-middle" />
    </span>
  );
}

/* Animated mini chart that appears after AI response */
function MiniChart({ data, visible }) {
  if (!visible || !data) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5 }}
      className="mt-3 p-3 rounded-xl bg-white/5 border border-white/8"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart2 className="w-3 h-3 text-teal" />
        <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Analysis Result</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        {data.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-teal/60 to-teal"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AIChatSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm FloatChat AI — trained on global ARGO ocean data. Ask me anything about ocean temperatures, salinity, float trajectories, or anomalies.", typed: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q, typed: true }]);
    setLoading(true);
    scrollToBottom();

    await new Promise((r) => setTimeout(r, 900));

    const match = DEMO_EXCHANGES.find((d) =>
      q.toLowerCase().includes(d.question.split(" ").slice(0, 3).join(" ").toLowerCase())
    );
    const exchange = match || DEMO_EXCHANGES[demoIdx % DEMO_EXCHANGES.length];
    setDemoIdx((i) => i + 1);

    setMessages((prev) => [...prev, { role: "ai", text: exchange.answer, typed: false, chart: exchange.chart }]);
    setLoading(false);
    scrollToBottom();
  };

  const reset = () => {
    setMessages([{ role: "ai", text: "Hello! I'm FloatChat AI — trained on global ARGO ocean data. Ask me anything about ocean temperatures, salinity, float trajectories, or anomalies.", typed: true }]);
    setInput("");
    setDemoIdx(0);
  };

  return (
    <section id="ai-chat" className="py-28 bg-gradient-metrics relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 ocean-grid opacity-30 pointer-events-none" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-teal/5 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/30 bg-teal/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span className="text-teal text-xs font-semibold uppercase tracking-widest">Live AI Demo</span>
          </div>
          <h2 className="text-display font-extrabold text-white mb-5">
            Ask the ocean anything
          </h2>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            Try our AI query engine — click a quick action chip or type any ocean science question.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-6xl mx-auto">
          {/* Quick Action Chips sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-3"
          >
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Quick Actions</p>
            {QUICK_CHIPS.map((q, i) => (
              <motion.button
                key={q.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ x: 6, backgroundColor: "hsl(180 87% 35% / 0.12)", borderColor: "hsl(180 87% 35% / 0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(q.label)}
                className="text-left px-4 py-3 rounded-xl border border-white/10 bg-white/4 text-sm text-white/70 hover:text-white transition-all duration-200 cursor-pointer group flex items-center gap-3"
              >
                <span className="text-lg">{q.icon}</span>
                <span>{q.label}</span>
              </motion.button>
            ))}

            {/* Stats panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-4 p-4 rounded-2xl border border-white/8 bg-white/4"
            >
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Live Network</p>
              {[
                { label: "Active Floats", value: "3,241", dot: true },
                { label: "Profiles / Day", value: "8,432" },
                { label: "Ocean Basins", value: "5" },
                { label: "Data Quality", value: "99.1%" },
              ].map(({ label, value, dot }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    {dot && <motion.div className="w-1.5 h-1.5 rounded-full bg-teal" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                    <span className="text-xs text-white/50">{label}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3 rounded-3xl border border-white/10 bg-navy-ocean/60 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            {/* Header bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-white/3">
              <div className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center shadow-teal flex-shrink-0">
                <Waves className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">FloatChat AI</p>
                <div className="flex items-center gap-1.5">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-teal" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-xs text-white/40">Ocean Intelligence Engine · Active</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -20 }}
                whileTap={{ scale: 0.9 }}
                onClick={reset}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-teal/30 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-5 flex flex-col gap-4 scroll-smooth">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-teal flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Waves className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">U</span>
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-teal/20 border border-teal/20 ml-auto"
                        : "bg-white/6 border border-white/8"
                    }`}>
                      {msg.role === "ai" && !msg.typed ? (
                        <>
                          <TypingResponse text={msg.text} onDone={() => {
                            setMessages((prev) => prev.map((m, idx) => idx === i ? { ...m, typed: true } : m));
                          }} />
                          <MiniChart data={msg.chart} visible={msg.typed} />
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                            {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                              part.startsWith("**") ? <strong key={pi} className="text-white font-semibold">{part.slice(2, -2)}</strong> : part
                            )}
                          </span>
                          {msg.role === "ai" && <MiniChart data={msg.chart} visible={!!msg.chart} />}
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-teal flex-shrink-0 flex items-center justify-center">
                    <Waves className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white/6 border border-white/8 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-2 h-2 rounded-full bg-teal"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 pb-5 border-t border-white/8 pt-4">
              <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-teal/30 transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about ocean temperature, salinity, float data..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm outline-none px-2"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center cursor-pointer flex-shrink-0 disabled:opacity-40 transition-opacity shadow-glow-teal"
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <p className="text-[10px] text-white/25 text-center mt-2">Demo mode — responses are simulated from real ARGO data patterns</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
