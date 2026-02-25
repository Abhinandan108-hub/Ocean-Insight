import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setTrail({ x: e.clientX, y: e.clientY }), 80);
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const checkHover = (e) => {
      const el = e.target;
      const isInteractive = el.closest("a, button, [role='button'], input, textarea, select");
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", checkHover);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", checkHover);
    };
  }, []);

  return (
    <>
      {/* Trail / outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border border-teal/40"
        animate={{
          x: trail.x - (hovering ? 20 : 16),
          y: trail.y - (hovering ? 20 : 16),
          width: hovering ? 40 : 32,
          height: hovering ? 40 : 32,
          opacity: hovering ? 0.8 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      />
      {/* Dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-teal"
        animate={{
          x: pos.x - (clicking ? 3 : 4),
          y: pos.y - (clicking ? 3 : 4),
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </>
  );
}
