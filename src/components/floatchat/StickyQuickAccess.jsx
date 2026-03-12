import { Search, MessageSquare, BookOpen, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const items = [
  { icon: Search, label: "Search Data", href: "#data" },
  { icon: MessageSquare, label: "AI Chat", href: "#ai-chat" },
  { icon: BarChart2, label: "Metrics", href: "#metrics" },
  { icon: BookOpen, label: "Docs", href: "#how-it-works" },
];

export default function StickyQuickAccess() {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-card/80 backdrop-blur-md border border-ocean-border shadow-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <Icon className="w-4 h-4" />
            </motion.div>
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.9 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-card border border-ocean-border text-xs font-semibold text-foreground shadow-card"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </a>
        );
      })}
    </motion.div>
  );
}
