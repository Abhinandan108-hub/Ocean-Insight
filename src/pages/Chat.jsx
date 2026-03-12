import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, AudioLines, Sun, Moon, ChevronDown, Send } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import aquawaveLogo from "@/assets/aquawave-logo.png";

const DEMO_RESPONSES = [
  "Based on ARGO float data, the North Pacific shows a +0.84°C temperature anomaly for 2024.\n\nKey findings:\n- Surface warming concentrated at 35°N–45°N\n- 847 floats recorded temperatures exceeding historical maximums\n- Deep water (>1000m) shows minimal change",
  "Float WMO 5904671 is currently active in the North Atlantic at 32.4°N, 64.2°W.\n\nSensor suite: CTD + Dissolved O₂ + pH\nLast profile depth: 2000m with 78 levels\nData quality: All parameters passed QC flags",
  "Comparing Pacific vs Indian Ocean salinity:\n\n• Pacific avg: 34.8 PSU (surface)\n• Indian Ocean avg: 35.6 PSU (surface)\n\nThe Indian Ocean shows higher evaporation-driven salinity above the thermocline.",
];

const SUGGESTIONS = ["Compare Pacific vs Indian Ocean salinity", "Show 2024 temperature anomalies", "Find oxygen minimum zones > 800m", "Track Float #5904671 trajectory"];

export default function Chat() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef(null);
  const [demoIdx, setDemoIdx] = useState(0);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const simulateStream = async (text) => {
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    for (let i = 0; i <= text.length; i++) {
      await new Promise((r) => setTimeout(r, 8));
      setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: text.slice(0, i) }; return u; });
    }
    setIsStreaming(false);
  };

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || isStreaming) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    const response = DEMO_RESPONSES[demoIdx % DEMO_RESPONSES.length];
    setDemoIdx((i) => i + 1);
    await new Promise((r) => setTimeout(r, 500));
    await simulateStream(response);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={aquawaveLogo} alt="AquaWave" className="w-7 h-7 rounded-lg object-contain" />
          <span className="font-bold text-sm text-foreground">AquaWave</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>
          <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Login</Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center overflow-y-auto">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-2xl w-full">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-semibold text-foreground mb-10">
              What's on the agenda today?
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
              <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-4 py-3.5 focus-within:border-primary transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground" />
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask anything" className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" />
                <Mic className="w-5 h-5 text-muted-foreground" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()} className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center cursor-pointer">
                  <AudioLines className="w-4 h-4 text-background" />
                </motion.button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-2 mt-6 justify-center">
              {SUGGESTIONS.map((s) => (
                <motion.button key={s} whileHover={{ scale: 1.03 }} onClick={() => sendMessage(s)}
                  className="px-4 py-2 rounded-full border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer">{s}</motion.button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="w-full max-w-3xl px-4 py-6 flex flex-col gap-6">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "assistant" && <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden"><img src={aquawaveLogo} alt="" className="w-7 h-7 object-contain" /></div>}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-primary/15 text-foreground border border-primary/20" : "text-foreground"}`}>
                  {msg.content}
                  {msg.role === "assistant" && isStreaming && i === messages.length - 1 && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {hasMessages && (
        <div className="border-t border-border px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-4 py-3.5 focus-within:border-primary transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything" className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none" disabled={isStreaming} />
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()} disabled={isStreaming || !input.trim()}
                className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center cursor-pointer disabled:opacity-40">
                <Send className="w-4 h-4 text-background" />
              </motion.button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-2">Demo mode — responses simulated from real ARGO data</p>
          </div>
        </div>
      )}
    </div>
  );
}
