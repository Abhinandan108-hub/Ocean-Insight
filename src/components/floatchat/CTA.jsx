import { ArrowRight, Waves } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="cta" className="py-28 bg-gradient-cta relative overflow-hidden">
      {/* Morphing blobs */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-teal/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6 lg:px-8 text-center relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex w-16 h-16 rounded-2xl bg-gradient-teal items-center justify-center mb-8 shadow-glow-teal mx-auto"
          >
            <Waves className="w-8 h-8 text-white" strokeWidth={1.8} />
          </motion.div>

          <h2 className="text-display font-extrabold text-foreground mb-5 leading-tight">
            Ready to explore the ocean through conversation?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Join researchers and oceanographers already unlocking insights from the
            world's largest ocean dataset network.
          </p>

          <Link to="/signup">
            <motion.span
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-teal text-primary-foreground font-bold text-base shadow-glow-teal cursor-pointer relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start for Free
                <motion.span className="group-hover:translate-x-1.5 transition-transform duration-200">
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
              <motion.span
                className="absolute inset-0 bg-white/15 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.8, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.span>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-xs mt-5"
          >
            No credit card required · Free for researchers · Scales with your team
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
