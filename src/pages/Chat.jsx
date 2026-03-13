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
  { title: "Ocean\nAnalysis", pct: 15, icon: Compass, iconBg: "bg-gradient-to-br from-orange-400 to-rose-500", barColor: "from-yellow-400 to-orange-400" },
  { title: "Data\nLinks", pct: 63, icon: Link2, iconBg: "bg-gradient-to-br from-cyan-400 to-blue-500", barColor: "from-cyan-300 to-blue-400" },
  { title: "Save\nQueries", pct: 41, icon: BookmarkCheck, iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500", barColor: "from-blue-300 to-indigo-400" },
  { title: "Chat\nWith AI", pct: 15, icon: Bot, iconBg: "bg-gradient-to-br from-pink-400 to-fuchsia-500", barColor: "from-pink-300 to-fuchsia-400" },
  { title: "Research\nPlans", pct: 63, icon: ClipboardList, iconBg: "bg-gradient-to-br from-emerald-400 to-green-500", barColor: "from-emerald-300 to-green-400" },
  { title: "Export\nData", pct: 41, icon: FileDown, iconBg: "bg-gradient-to-br from-violet-400 to-purple-500", barColor: "from-violet-300 to-purple-400" },
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
    <div className="h-screen flex overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      {/* Wavy abstract background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 20% 100%, hsl(250 40% 20% / 0.6) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 80% 20%, hsl(220 50% 15% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 60%, hsl(180 87% 35% / 0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[220px] flex-shrink-0 flex flex-col z-30 fixed lg:relative h-full"
            style={{ background: "hsl(var(--card))", borderRight: "1px solid hsl(var(--border))" }}
          >
            {/* Logo */}
            <div className="px-4 pt-5 pb-4">
              <Link to="/" className="flex items-center gap-2.5">
                <img src={aquawaveLogo} alt="AquaWave" className="w-9 h-9 rounded-xl object-contain" />
                <span className="font-bold text-base text-foreground tracking-tight">
                  Aqua<span className="text-gradient">Wave</span>
                </span>
              </Link>
            </div>

            {/* Chats button */}
            <div className="px-3 py-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                <MessageSquare className="w-4 h-4" />
                Chats
              </motion.button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom actions */}
            <div className="px-3 pb-3 flex flex-col gap-0.5">
              <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm transition-colors cursor-pointer">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <Link to="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm transition-colors cursor-pointer">
                <LogOut className="w-4 h-4" />
                Log Out
              </Link>
            </div>

            {/* User profile */}
            <div className="px-3 pb-4">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, hsl(220 80% 50%), hsl(260 70% 55%))" }}>
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Ayush Gupta</p>
                  <p className="text-[11px] text-muted-foreground truncate">ayushgp674@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/60 backdrop-blur-md">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
          <h2 className="text-sm font-semibold text-foreground">AquaWave AI</h2>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full px-4 sm:px-8 w-full py-8">
              {/* Hero heading */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl font-extrabold text-foreground mb-3 text-center"
              >
                Hi, I'm <span className="text-gradient">Chat Bot</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-muted-foreground text-base sm:text-lg mb-12 text-center max-w-md"
              >
                Tell me your goal, and get complete Learning Plans.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                className="text-muted-foreground text-sm italic mb-7 text-center"
              >
                Here is what You'll get
              </motion.p>

              {/* Feature cards — exact image layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-[600px] mb-6">
                {FEATURE_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 + i * 0.07 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="relative rounded-2xl p-4 pb-3 flex flex-col cursor-pointer group overflow-hidden"
                      style={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        minHeight: "130px",
                      }}
                    >
                      {/* Vertical progress bar — right edge */}
                      <div className="absolute top-3 right-3 bottom-3 w-[5px] rounded-full overflow-hidden"
                        style={{ background: "hsl(var(--muted) / 0.4)" }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${card.pct}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 + i * 0.08 }}
                          className={`absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-t ${card.barColor}`}
                        />
                      </div>

                      {/* Title & percent */}
                      <div className="pr-4">
                        <p className="text-sm font-bold text-foreground leading-tight whitespace-pre-line">{card.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.pct}%</p>
                      </div>

                      {/* Icon at bottom-left */}
                      <div className="mt-auto pt-3">
                        <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-4.5 h-4.5 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
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
                    <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden mt-0.5"
                      style={{ background: "hsl(var(--primary) / 0.1)" }}>
                      <img src={aquawaveLogo} alt="" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground border border-primary/20"
                        : "text-foreground"
                    }`}
                    style={msg.role === "assistant" ? { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" } : {}}
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

        {/* Input bar — spans full bottom with avatar */}
        <div className="border-t border-border px-4 py-4" style={{ background: "hsl(var(--background) / 0.9)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            {/* User avatar */}
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(220 80% 50%), hsl(260 70% 55%))" }}>
              <span className="text-white font-bold text-xs">A</span>
            </div>

            {/* Input */}
            <div className="flex-1 flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "hsl(var(--muted) / 0.4)", border: "1px solid hsl(var(--border))" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Enter your goal/prompts here............"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none min-w-0"
                disabled={isStreaming}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => sendMessage()}
                disabled={isStreaming || !input.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40 flex-shrink-0"
                style={{ background: "hsl(var(--primary))" }}
              >
                <Send className="w-4 h-4" style={{ color: "hsl(var(--primary-foreground))" }} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
