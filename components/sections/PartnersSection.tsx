"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const PARTNERS = [
  {
    id: "apple",
    name: "Apple",
    initial: "A",
    role: "Technology Partner",
    description:
      "Challenges around spatial computing, on-device ML, and accessibility at enterprise scale — problems directly from Apple engineering teams.",
    tracks: 3,
    domains: ["Spatial Computing", "On-Device ML", "Accessibility"],
    accentColor: "#0066FF",
  },
  {
    id: "partnerb",
    name: "Partner B",
    initial: "B",
    role: "Technology Partner",
    description:
      "Enterprise data and AI challenges from a strategic technology partner. Real production systems, real constraints, real engineers judging.",
    tracks: 1,
    domains: ["Data", "AI", "Analytics"],
    accentColor: "#0055EE",
  },
  {
    id: "partnerc",
    name: "Partner C",
    initial: "C",
    role: "Infrastructure Partner",
    description:
      "Cloud infrastructure and developer tooling problems at scale. Build the internal tools engineers wish they already had.",
    tracks: 1,
    domains: ["Cloud", "DevTools", "Scale"],
    accentColor: "#0044CC",
  },
];

function PartnerCard({ p, i }: { p: typeof PARTNERS[0]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.25 });
  const [hov, setHov] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 32 }}
      transition={{ delay: i * 0.12, duration: 0.7, ease: SOFT }}
    >
      <motion.div
        className="relative flex flex-col h-full rounded-2xl overflow-hidden cursor-default"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          minHeight: "320px",
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        animate={{
          borderColor: hov ? p.accentColor + "55" : "var(--border-color)",
          boxShadow: hov
            ? `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${p.accentColor}33`
            : "0 2px 12px rgba(0,0,0,0.12)",
          y: hov ? -4 : 0,
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Mouse-follow spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${p.accentColor}18 0%, transparent 55%)`,
          }}
        />

        {/* Top accent line — draws in on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          animate={{
            scaleX: hov ? 1 : 0,
            opacity: hov ? 1 : 0,
          }}
          style={{
            background: `linear-gradient(90deg, ${p.accentColor}, transparent)`,
            transformOrigin: "left",
          }}
          transition={{ duration: 0.35, ease: EXPO }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-7">

          {/* Header: mark + role */}
          <div className="flex items-start justify-between mb-6">
            {/* Partner mark */}
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-2xl flex-shrink-0 relative overflow-hidden"
              style={{
                background: p.accentColor + "18",
                border: `1px solid ${p.accentColor}33`,
                color: p.accentColor,
              }}
              animate={{ scale: hov ? 1.07 : 1 }}
              transition={{ duration: 0.22 }}
            >
              {/* Inner glow on hover */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: hov ? 1 : 0 }}
                style={{ background: `radial-gradient(circle, ${p.accentColor}22 0%, transparent 70%)` }}
              />
              <span className="relative z-10">{p.initial}</span>
            </motion.div>

            {/* Track count badge */}
            <div
              className="flex flex-col items-end"
            >
              <span
                className="font-display font-bold leading-none"
                style={{ fontSize: "2rem", letterSpacing: "-0.05em", color: p.accentColor }}
              >
                {p.tracks}
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: "var(--text-muted)" }}>
                {p.tracks === 1 ? "track" : "tracks"}
              </span>
            </div>
          </div>

          {/* Role label */}
          <span
            className="text-[10px] font-mono tracking-[0.22em] uppercase mb-2 block"
            style={{ color: "var(--text-muted)" }}
          >
            {p.role}
          </span>

          {/* Name */}
          <h3
            className="font-display font-bold mb-4"
            style={{
              fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            {p.name}
          </h3>

          {/* Divider */}
          <div className="h-px mb-4" style={{ background: "var(--border-color)" }} />

          {/* Description */}
          <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
            {p.description}
          </p>

          {/* Domain tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {p.domains.map((d) => (
              <span
                key={d}
                className="text-[10px] font-mono tracking-[0.16em] uppercase px-2.5 py-1.5 rounded-lg"
                style={{
                  color: hov ? p.accentColor : "var(--text-muted)",
                  background: hov ? p.accentColor + "14" : "var(--bg-base)",
                  border: `1px solid ${hov ? p.accentColor + "33" : "var(--border-color)"}`,
                  transition: "all 0.25s",
                }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: "var(--text-muted)" }}>
              {p.tracks} open {p.tracks === 1 ? "track" : "tracks"}
            </span>
            <motion.span
              className="text-xs font-bold flex items-center gap-1.5"
              style={{ color: p.accentColor }}
              animate={{ x: hov ? 3 : 0, opacity: hov ? 1 : 0.45 }}
              transition={{ duration: 0.2 }}
            >
              View problems
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PartnersSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once: false, amount: 0.4 });

  return (
    <section id="partners" className="py-28 lg:py-36" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        {/* Header */}
        <div ref={headerRef} className="mb-14">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
            transition={{ duration: 0.6, ease: SOFT }}
          >
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>
              Partners
            </span>
            <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>
              {PARTNERS.length} organisations
            </span>
          </motion.div>

          <div className="flex items-end justify-between gap-8">
            <div style={{ overflow: "hidden" }}>
              <motion.h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                  color: "var(--text-primary)",
                }}
                initial={{ y: "105%" }}
                animate={{ y: inView ? "0%" : "105%" }}
                transition={{ delay: 0.1, duration: 0.9, ease: SOFT }}
              >
                Who you&apos;ll work with.
              </motion.h2>
            </div>

            <motion.p
              className="hidden lg:block text-sm leading-relaxed max-w-xs text-right flex-shrink-0 mb-1"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Real enterprise partners. Real engineers judging. Real problems that haven&apos;t been solved yet.
            </motion.p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PARTNERS.map((p, i) => (
            <PartnerCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
