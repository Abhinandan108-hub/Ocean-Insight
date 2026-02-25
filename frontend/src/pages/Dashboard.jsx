import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Waves, LayoutDashboard, Map, MessageSquare, Settings,
  Bell, TrendingUp, Activity, Globe, Database, LogOut, ChevronRight, Wifi
} from "lucide-react";
import ParticleBackground from "@/components/floatchat/ParticleBackground";

const sideNav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Map, label: "Ocean Map" },
  { icon: MessageSquare, label: "AI Chat" },
  { icon: Activity, label: "Data Streams" },
  { icon: Database, label: "Datasets" },
  { icon: Settings, label: "Settings" },
];

const recentQueries = [
  "Show Pacific temperature anomalies 2023",
  "Float WMO 5904671 trajectory last 6 months",
  "Compare salinity profiles Atlantic vs Indian Ocean",
  "Identify oxygen minimum zones depth > 800m",
];

const chartBars = [42, 67, 55, 80, 63, 74, 58, 88, 71, 95, 82, 76];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hello! I'm FloatChat AI. Ask me anything about ocean data." }
  ]);
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1500));
    const responses = [
      `Analyzing ${userMsg}... I found 2,847 ARGO floats matching your query. Temperature anomaly of +0.8°C detected in the North Pacific.`,
      `Great question! Based on ARGO data, I can see interesting patterns related to "${userMsg}". Here's what the data shows: salinity values ranging from 34.2 to 35.8 PSU.`,
      `Processing your request... Found 142 floats with relevant profiles. Average depth: 1,842m. Data quality flag: Good.`,
    ];
    setChatMessages((prev) => [...prev, { role: "ai", text: responses[Math.floor(Math.random() * responses.length)] }]);
    setTyping(false);
  };

  return (
    <div className="min-h-screen bg-navy-deep flex overflow-hidden relative">
      {/* Subtle 3D data stream background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <ParticleBackground variant="data" className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-navy-deep/60 pointer-events-none" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-64 flex-shrink-0 border-r border-white/8 bg-navy-deep/80 backdrop-blur-xl flex flex-col"
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center shadow-teal">
              <Waves className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Float<span className="text-gradient">Chat</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {sideNav.map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveNav(label)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                activeNav === label
                  ? "bg-teal/15 text-teal border border-teal/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {activeNav === label && <ChevronRight className="w-3 h-3 ml-auto" />}
            </motion.button>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center text-white text-xs font-bold">DR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Dr. Researcher</p>
              <p className="text-[10px] text-white/40 truncate">demo@floatchat.ai</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Link>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-navy-deep/60 backdrop-blur-sm">
          <div>
            <h1 className="text-lg font-bold text-white">Ocean Intelligence Dashboard</h1>
            <p className="text-xs text-white/40">ARGO Global Network · Real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-teal" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-xs text-teal font-medium">3,241 floats live</span>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-white cursor-pointer">
              <Bell className="w-4 h-4" />
            </motion.button>
          </div>
        </header>

        {/* Dashboard body */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
            {/* Left: Metrics + Map */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Floats Active", value: "3,241", icon: Globe, trend: "+12%" },
                  { label: "Profiles Today", value: "8,432", icon: Activity, trend: "+5.2%" },
                  { label: "Avg. Depth", value: "1,842m", icon: TrendingUp, trend: "-0.3%" },
                  { label: "Data Quality", value: "99.1%", icon: Wifi, trend: "+0.2%" },
                ].map(({ label, value, icon: Icon, trend }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal/15 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-teal" />
                      </div>
                      <span className={`text-xs font-semibold ${trend.startsWith("+") ? "text-teal" : "text-white/40"}`}>{trend}</span>
                    </div>
                    <p className="text-xl font-extrabold text-white">{value}</p>
                    <p className="text-xs text-white/40 mt-0.5">{label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Map + Chart */}
              <div className="grid sm:grid-cols-2 gap-4 flex-1">
                {/* Map mock */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-white/8 bg-navy-ocean/60 overflow-hidden relative min-h-[200px]"
                >
                  <div className="absolute inset-0 ocean-grid opacity-30" />
                  {[
                    { x: 20, y: 30 }, { x: 45, y: 55 }, { x: 68, y: 25 },
                    { x: 30, y: 70 }, { x: 75, y: 45 }, { x: 15, y: 50 },
                    { x: 55, y: 35 }, { x: 82, y: 65 }, { x: 40, y: 42 },
                  ].map((pos, i) => (
                    <div key={i} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                      <motion.div className="w-2.5 h-2.5 rounded-full bg-teal border border-teal/30"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
                      />
                      <motion.div className="absolute inset-0 rounded-full border border-teal/30"
                        animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </div>
                  ))}
                  <div className="absolute top-3 left-3 glass rounded-lg px-2.5 py-1.5">
                    <span className="text-white/80 text-xs font-semibold">Global ARGO Map</span>
                  </div>
                  <div className="absolute bottom-3 right-3 glass rounded-lg px-2 py-1">
                    <span className="text-white/60 text-[10px] font-mono">Live · Updated 2s ago</span>
                  </div>
                </motion.div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-white">Temperature Profile (°C)</p>
                    <span className="text-[10px] text-white/30">Last 12 months</span>
                  </div>
                  <div className="flex items-end gap-1 h-24">
                    {chartBars.map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: "easeOut" }}
                        style={{ background: `hsl(180, ${60 + (h / 100) * 27}%, ${35 + (h / 100) * 15}%)` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                      <span key={m} className="text-[9px] text-white/25">{m}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: AI Chat panel */}
            <div className="flex flex-col rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-teal flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">AI Query Engine</span>
                <motion.div className="w-1.5 h-1.5 rounded-full bg-teal ml-auto" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[200px]">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user" ? "bg-teal/20 text-white border border-teal/20" : "bg-white/6 text-white/80 border border-white/8"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white/6 border border-white/8 rounded-xl px-3.5 py-2.5 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-teal"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick queries */}
              <div className="px-4 pb-2 flex flex-col gap-1">
                <p className="text-[10px] text-white/30 mb-1">Try a query:</p>
                {recentQueries.slice(0, 2).map((q) => (
                  <button key={q} onClick={() => setChatInput(q)}
                    className="text-left text-[10px] text-teal/70 hover:text-teal px-2 py-1 rounded-lg hover:bg-teal/8 transition-colors cursor-pointer truncate">
                    → {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 pb-4">
                <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about ocean data..."
                    className="flex-1 bg-transparent text-white placeholder:text-white/25 text-xs outline-none px-2"
                  />
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="w-7 h-7 rounded-lg bg-gradient-teal flex items-center justify-center cursor-pointer flex-shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}
