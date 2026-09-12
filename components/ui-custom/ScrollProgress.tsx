"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      id="scroll-progress"
      className="fixed top-0 left-0 right-0 h-0.5 z-[101] origin-left"
      style={{ scaleX, background: "var(--brand-accent)", boxShadow: "0 0 8px var(--accent-glow)" }}
    />
  );
}
