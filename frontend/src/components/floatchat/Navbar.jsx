import { useState, useEffect } from "react";
import { Menu, X, Waves, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Data", href: "#data" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "BGC-Argo", href: "#bgc-argo" },
  { label: "AI Chat", href: "#ai-chat" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Metrics", href: "#metrics" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-card border-b border-ocean-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group cursor-pointer">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center shadow-teal"
          >
            <Waves className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </motion.div>
          <span
            className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            Float<span className="text-gradient">Chat</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-sm font-medium transition-colors duration-200 group ${
                scrolled
                  ? "text-foreground hover:text-primary"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer block ${
                scrolled
                  ? "border-ocean-border text-foreground hover:bg-muted"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              Login
            </motion.span>
          </Link>
          <Link to="/signup">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px -8px hsl(180 87% 35% / 0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden text-sm font-semibold px-5 py-2 rounded-lg bg-gradient-teal text-primary-foreground cursor-pointer block shadow-glow-teal"
            >
              <span className="relative z-10">Get Started</span>
              <motion.span
                className="absolute inset-0 bg-white/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ borderRadius: "inherit", transformOrigin: "center" }}
              />
            </motion.span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`md:hidden p-2 rounded-lg transition-colors z-50 cursor-pointer ${
            scrolled ? "text-foreground" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-0 right-0 bottom-0 w-72 bg-background/98 backdrop-blur-xl border-l border-ocean-border shadow-2xl z-40"
          >
            <div className="flex flex-col gap-2 px-6 pt-20 pb-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  href={link.href}
                  className="text-foreground font-medium py-3 px-4 rounded-xl hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-3 pt-6 border-t border-ocean-border mt-4">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="text-center text-sm font-medium px-4 py-2.5 rounded-lg border border-ocean-border text-foreground hover:bg-muted cursor-pointer">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="text-center text-sm font-semibold px-4 py-2.5 rounded-lg bg-gradient-teal text-primary-foreground cursor-pointer shadow-glow-teal">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
