import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Settings, LogOut, Send, Sun, Moon,
  Compass, Link2, BookmarkCheck, Bot, ClipboardList, FileDown,
  ChevronLeft, Menu,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import aquawaveLogo from "@/assets/aquawave-logo.png";

const FEATURE_CARDS = [
  { title: "Ocean Analysis", pct: 85, icon: Compass, color: "from-orange-400 to-rose-500" },
  { title: "Data Links", pct: 63, icon: Link2, color: "from-cyan-400 to-blue-500" },
  { title: "Save Queries", pct: 41, icon: BookmarkCheck, color: "from-blue-400 to-indigo-500" },
  { title: "Chat With AI", pct: 72, icon: Bot, color: "from-pink-400 to-fuchsia-500" },
  { title: "Research Plans", pct: 56, icon: ClipboardList, color: "from-emerald-400 to-green-500" },
  { title: "Export Data", pct: 41, icon: FileDown, color: "from-violet-400 to-purple-500" },
];

const DEMO_RESPONSES = [
  "Based on ARGO float data, the North Pacific shows a **+0.84°C** temperature anomaly for 2024.\n\n**Key findings:**\n- Surface warming concentrated at 35°N–45°N\n- 847 floats recorded temperatures exceeding historical maximums\n- Deep water (>1000m) shows minimal change",
  "Float **WMO 5904671** is currently active in the North Atlantic at 32.4°N, 64.2°W.\n\n**Sensor suite:** CTD + Dissolved O₂ + pH\n**Last profile depth:** 2000m with 78 levels\n**Data quality:** All parameters passed QC flags",
  "Comparing Pacific vs Indian Ocean salinity:\n\n• **Pacific avg:** 34.8 PSU (surface)\n• **Indian Ocean avg:** 35.6 PSU (surface)\n\nThe Indian Ocean shows higher evaporation-driven salinity above the thermocline.",
];

const SUGGESTIONS = [
  "Compare Pacific vs Indian Ocean salinity",
  "Show 2024 temperature anomalies",
  "Find oxygen minimum zones > 800m",
  "Track Float #5904671 trajectory",
];

function ProgressBar({ pct, color }) {
  return (
    <div className="w-1.5 h-full rounded-full bg-muted/30 overflow-hidden">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className={`w-full rounded-full bg-gradient-to-t ${color}`}
        style={{ marginTop: "auto" }}
      />
    </div>
  );
}

export default function Chat() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);
  const [demoIdx, setDemoIdx] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateStream = async (text) => {
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    for (let i = 0; i <= text.length; i++) {
      await new Promise((r) => setTimeout(r, 6));
      setMessages((prev) => {
        const u = [...prev];
        u[u.length - 1] = { role: "assistant", content: text.slice(0, i) };
        return u;
      });
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
    await new Promise((r) => setTimeout(r, 400));
    await simulateStream(response);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col z-30
                       fixed lg:relative h-full"
          >
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border">
              <Link to="/" className="flex items-center gap-2.5">
                <img src={aquawaveLogo} alt="AquaWave" className="w-8 h-8 rounded-lg object-contain" />
                <span className="font-bold text-foreground">
                  Aqua<span className="text-gradient">Wave</span>
                </span>
              </Link>
            </div>

            {/* Nav */}
            <div className="flex-1 px-3 py-4 flex flex-col gap-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Chats
              </motion.button>
            </div>

            {/* Bottom */}
            <div className="px-3 pb-4 flex flex-col gap-1 border-t border-border pt-3">
              <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-sm transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-sm transition-colors cursor-pointer">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <Link to="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-sm transition-colors cursor-pointer">
                <LogOut className="w-4 h-4" />
                Log Out
              </Link>

              {/* User */}
              <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-muted/50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                  A
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-foreground truncate">Researcher</p>
                  <p className="text-[11px] text-muted-foreground truncate">user@aquawave.ai</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
          <h2 className="text-sm font-semibold text-foreground">AquaWave AI</h2>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 max-w-4xl mx-auto w-full py-8">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold text-foreground mb-2"
              >
                Hi, I'm <span className="text-gradient">AquaWave</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-sm sm:text-base mb-10 text-center"
              >
                Tell me your research goal, and get complete ocean data insights.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-sm italic mb-6"
              >
                Here is what You'll get
              </motion.p>

              {/* Feature cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl mb-10">
                {FEATURE_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      whileHover={{ scale: 1.04, y: -4 }}
                      className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 cursor-pointer group transition-shadow hover:shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight">{card.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{card.pct}%</p>
                        </div>
                        <ProgressBar pct={card.pct} color={card.color} />
                      </div>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mt-auto`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick suggestions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-2 justify-center"
              >
                {SUGGESTIONS.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(s)}
                    className="px-4 py-2 rounded-full border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
                  >
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden bg-primary/10 mt-0.5">
                      <img src={aquawaveLogo} alt="" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground border border-primary/20"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                      <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-4 py-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Enter your goal/prompts here..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none min-w-0"
                disabled={isStreaming}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => sendMessage()}
                disabled={isStreaming || !input.trim()}
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center cursor-pointer disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </motion.button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
              Demo mode — responses simulated from real ARGO data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
