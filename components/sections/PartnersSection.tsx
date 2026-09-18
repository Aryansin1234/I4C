"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

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

type Partner = typeof PARTNERS[0];

/* ── Partner accordion row ───────────────────────────────────── */
function PartnerRow({ p, i, open, onToggle, inView }: {
  p: Partner; i: number; open: boolean; onToggle: () => void; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
      transition={{ delay: i * 0.08, duration: 0.6, ease: SOFT }}
    >
      {/* Top rule — animates in, turns accent when open */}
      <motion.div
        className="h-px"
        style={{
          background: open
            ? `linear-gradient(90deg, ${p.accentColor}, var(--border-color))`
            : "var(--border-color)",
          transformOrigin: "left",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ delay: i * 0.06, duration: 0.65, ease: EXPO }}
      />

      {/* Trigger row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-5 lg:gap-8 py-6 text-left"
        aria-expanded={open}
      >
        {/* Large rank number */}
        <motion.span
          className="font-display font-bold leading-none select-none tabular-nums flex-shrink-0 w-10"
          style={{
            fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
            letterSpacing: "-0.05em",
            color: open ? p.accentColor : "var(--text-muted)",
            transition: "color 0.25s",
          }}
          animate={{ scale: open ? 1.08 : 1 }}
          transition={{ duration: 0.25 }}
        >
          {String(i + 1).padStart(2, "0")}
        </motion.span>

        {/* Partner initial badge */}
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
          style={{
            background: open ? p.accentColor + "20" : "var(--bg-surface)",
            color: open ? p.accentColor : "var(--text-muted)",
            border: `1px solid ${open ? p.accentColor + "44" : "var(--border-color)"}`,
            transition: "all 0.25s",
          }}
          animate={{ rotate: open ? 5 : 0 }}
          transition={{ duration: 0.3, ease: SOFT }}
        >
          {p.initial}
        </motion.div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <div
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: open ? "var(--text-primary)" : "var(--text-secondary)",
              transition: "color 0.2s",
            }}
          >
            {p.name}
          </div>
          <div
            className="text-[10px] font-mono tracking-[0.18em] uppercase mt-1"
            style={{ color: open ? p.accentColor : "var(--text-muted)", transition: "color 0.2s" }}
          >
            {p.role}
          </div>
        </div>

        {/* Track count */}
        <div className="hidden sm:flex flex-col items-end flex-shrink-0">
          <span
            className="font-display font-bold"
            style={{
              fontSize: "1.6rem",
              letterSpacing: "-0.05em",
              color: open ? p.accentColor : "var(--text-muted)",
              transition: "color 0.2s",
            }}
          >
            {p.tracks}
          </span>
          <span className="text-[8px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            {p.tracks === 1 ? "track" : "tracks"}
          </span>
        </div>

        {/* Plus / minus icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative"
          style={{
            background: open ? p.accentColor + "18" : "var(--bg-surface)",
            border: `1px solid ${open ? p.accentColor + "44" : "var(--border-color)"}`,
            transition: "all 0.25s",
          }}
        >
          <motion.div
            className="absolute w-3 h-px rounded-full"
            style={{ background: open ? p.accentColor : "var(--text-muted)" }}
          />
          <motion.div
            className="absolute w-px h-3 rounded-full"
            style={{ background: open ? p.accentColor : "var(--text-muted)" }}
            animate={{ scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </button>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: SOFT }}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden mb-6"
              style={{
                background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${p.accentColor}28`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.18)`,
              }}
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.3, ease: SOFT }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                style={{ background: `linear-gradient(to bottom, ${p.accentColor}, ${p.accentColor}44)` }}
              />

              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 55% at 0% 50%, ${p.accentColor}0C 0%, transparent 65%)` }} />

              <div className="relative z-10 pl-7 pr-6 py-5 flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-10">

                {/* Description + domains */}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.domains.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-mono tracking-[0.14em] uppercase px-2.5 py-1.5 rounded-lg"
                        style={{ color: p.accentColor, background: p.accentColor + "14", border: `1px solid ${p.accentColor}28` }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stat + CTA */}
                <div className="flex lg:flex-col items-center lg:items-end gap-5 flex-shrink-0">
                  <div className="text-right">
                    <div
                      className="font-display font-bold leading-none"
                      style={{ fontSize: "2.8rem", letterSpacing: "-0.05em", color: p.accentColor, filter: `drop-shadow(0 0 12px ${p.accentColor}55)` }}
                    >
                      {p.tracks}
                    </div>
                    <div className="text-[8px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: "var(--text-muted)" }}>
                      open {p.tracks === 1 ? "track" : "tracks"}
                    </div>
                  </div>
                  <motion.a
                    href="#problems"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: p.accentColor, color: "#fff", boxShadow: `0 0 18px ${p.accentColor}55` }}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${p.accentColor}77` }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View challenges
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Desktop card ─────────────────────────────────────────────── */
function PartnerCard({ p, i, inView }: { p: Partner; i: number; inView: boolean }) {
  const [hov, setHov] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = cardRef.current!.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden flex flex-col cursor-default"
      style={{ background: "var(--bg-surface)", border: `1px solid ${hov ? p.accentColor + "44" : "var(--border-color)"}`, transition: "border-color 0.3s" }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 28 }}
      transition={{ delay: i * 0.12, duration: 0.7, ease: SOFT }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseMove={onMouseMove}
      whileHover={{ y: -4, boxShadow: `0 24px 56px rgba(0,0,0,0.28), 0 0 0 1px ${p.accentColor}33` }}
    >
      <motion.div className="absolute inset-0 pointer-events-none" animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${p.accentColor}18 0%, transparent 60%)` }} />
      <motion.div className="h-[2px] flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${p.accentColor}, ${p.accentColor}55, transparent)`, transformOrigin: "left" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: EXPO }} />
      <div className="relative z-10 flex flex-col h-full p-6 lg:p-8 gap-5">
        <div className="flex items-start justify-between">
          <motion.div className="font-display font-bold leading-none select-none"
            style={{ fontSize: "clamp(4rem, 7vw, 6rem)", letterSpacing: "-0.06em", color: "transparent",
              WebkitTextStroke: `2px ${p.accentColor}`, filter: hov ? `drop-shadow(0 0 20px ${p.accentColor}66)` : "none", transition: "filter 0.3s" }}
            animate={{ scale: hov ? 1.04 : 1 }} transition={{ duration: 0.3, ease: SOFT }}>
            {p.initial}
          </motion.div>
          <div className="text-right">
            <div className="font-display font-bold leading-none" style={{ fontSize: "2.5rem", letterSpacing: "-0.05em", color: p.accentColor }}>{p.tracks}</div>
            <div className="text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: "var(--text-muted)" }}>{p.tracks === 1 ? "track" : "tracks"}</div>
          </div>
        </div>
        <div>
          <span className="text-[9px] font-mono tracking-[0.22em] uppercase block mb-1" style={{ color: p.accentColor }}>{p.role}</span>
          <h3 className="font-display font-bold" style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", letterSpacing: "-0.035em", lineHeight: 1.05, color: "var(--text-primary)" }}>{p.name}</h3>
        </div>
        <div className="h-px" style={{ background: "var(--border-color)" }} />
        <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
        <div className="flex flex-wrap gap-2">
          {p.domains.map((d) => (
            <span key={d} className="text-[10px] font-mono tracking-[0.14em] uppercase px-2.5 py-1.5 rounded-lg"
              style={{ color: hov ? p.accentColor : "var(--text-muted)", background: hov ? p.accentColor + "14" : "var(--bg-base)",
                border: `1px solid ${hov ? p.accentColor + "33" : "var(--border-color)"}`, transition: "all 0.25s" }}>{d}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
          <span className="text-[10px] font-mono tracking-[0.16em] uppercase" style={{ color: "var(--text-muted)" }}>{p.tracks} open {p.tracks === 1 ? "track" : "tracks"}</span>
          <motion.a href="#problems" className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: p.accentColor }}
            animate={{ x: hov ? 3 : 0, opacity: hov ? 1 : 0.45 }} transition={{ duration: 0.2 }}>
            View problems
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: false, amount: 0.05, margin: "0px 0px -150px 0px" });
  const headerView = useInView(headerRef,  { once: false, amount: 0.3,  margin: "0px 0px -150px 0px" });
  const [open, setOpen] = useState<string | null>("apple");

  return (
    <section ref={sectionRef} id="partners" className="py-28 lg:py-36" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: headerView ? 1 : 0, x: headerView ? 0 : -16 }}
            transition={{ duration: 0.6, ease: SOFT }}
          >
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>Partners</span>
            <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>{PARTNERS.length} organisations</span>
          </motion.div>

          <div className="flex items-end justify-between gap-8">
            <div style={{ overflow: "hidden" }}>
              <motion.h2
                className="font-display font-bold"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text-primary)" }}
                initial={{ y: "105%" }}
                animate={{ y: headerView ? "0%" : "105%" }}
                transition={{ delay: 0.1, duration: 0.9, ease: SOFT }}
              >
                Who you&apos;ll work with.
              </motion.h2>
            </div>
            <motion.p
              className="hidden lg:block text-sm leading-relaxed max-w-xs text-right flex-shrink-0 mb-1"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: headerView ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Real enterprise partners. Real engineers judging. Real problems that haven&apos;t been solved yet.
            </motion.p>
          </div>
        </div>

        {/* Desktop: 3-col card grid */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {PARTNERS.map((p, i) => (
            <PartnerCard key={p.id} p={p} i={i} inView={inView} />
          ))}
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden">
          {PARTNERS.map((p, i) => (
            <PartnerRow
              key={p.id}
              p={p}
              i={i}
              open={open === p.id}
              onToggle={() => setOpen(open === p.id ? null : p.id)}
              inView={inView}
            />
          ))}
          <motion.div
            className="h-px"
            style={{ background: "var(--border-color)", transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.65, ease: EXPO }}
          />
        </div>

      </div>
    </section>
  );
}
