"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const BENEFITS = [
  {
    icon: "⚡",
    title: "Solve Real Problems",
    body: "Build solutions for actual enterprise challenges, not toy datasets or academic exercises.",
  },
  {
    icon: "🤝",
    title: "Partner Access",
    body: "Direct exposure to Apple and other industry partners during build week and judging.",
  },
  {
    icon: "💰",
    title: "Cash Prizes",
    body: "Up to $10,000 in prizes across multiple categories. Win big for building bold.",
  },
  {
    icon: "🚀",
    title: "Ship-Ready Mentorship",
    body: "Dedicated mentors from engineering, design, and product available throughout.",
  },
];

function BenefitCard({ card, index }: { card: typeof BENEFITS[0]; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const mouseX   = useMotionValue(0);
  const mouseY   = useMotionValue(0);
  const rotateX  = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 30 });
  const rotateY  = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 30 });
  const glowX    = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY    = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const glowOpacity = useMotionValue(0);

  const handleMove = (e: React.MouseEvent) => {
    const rect = cardRef.current!.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
    glowOpacity.set(0.6);
  };
  const handleLeave = () => {
    mouseX.set(0); mouseY.set(0);
    glowOpacity.set(0);
  };

  // Diagonal stagger: top-left → bottom-right
  const diagonalIndex = [0, 2, 1, 3][index] ?? index;

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-2xl p-8 overflow-hidden cursor-default"
      style={{
        background:  "var(--bg-surface)",
        border:      "1px solid var(--border-color)",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
      initial={{ rotateY: 90, opacity: 0 }}
      whileInView={{ rotateY: 0, opacity: 1 }}
      transition={{
        delay:    diagonalIndex * 0.12,
        duration: 0.7,
        ease:     [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: false, margin: "0px 0px -150px 0px" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
    >
      {/* Specular highlight layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) =>
              `radial-gradient(circle at ${x} ${y}, var(--accent-subtle), transparent 60%)`
          ),
          opacity: glowOpacity,
          mixBlendMode: "overlay",
        }}
      />

      <span className="text-3xl mb-4 block">{card.icon}</span>
      <h3
        className="font-display font-semibold text-xl mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {card.body}
      </p>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{ background: "var(--brand-accent)", scaleX: glowOpacity }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-24 lg:py-32"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, margin: "0px 0px -150px 0px" }}
        >
          <span
            className="text-xs font-mono tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "var(--brand-accent)" }}
          >
            Why Join
          </span>
          <h2 className="font-display text-display-lg font-bold" style={{ color: "var(--text-primary)" }}>
            What you get
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {BENEFITS.map((card, i) => (
            <BenefitCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
