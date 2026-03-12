import { useEffect, useRef } from "react";

export default function SpotlightCursor() {
  const spotRef = useRef(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;

    const move = (e) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };
    const leave = () => { el.style.opacity = "0"; };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="fixed pointer-events-none z-[9998] opacity-0 transition-opacity duration-300"
      style={{
        width: 500,
        height: 500,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, hsl(180 87% 35% / 0.07) 0%, transparent 70%)",
        filter: "blur(2px)",
      }}
    />
  );
}
