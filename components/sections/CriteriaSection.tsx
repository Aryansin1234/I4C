"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const CRITERIA = [
  {
    index: "01",
    label: "Customer Impact",
    weight: 30,
    desc: "Does it solve a real, documented customer problem? Judges will assess depth of problem understanding and quality of the solution's impact on end users.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    index: "02",
    label: "Technical Innovation",
    weight: 25,
    desc: "Is the approach novel? Judges evaluate the sophistication of the technical implementation, creative use of tools, and whether the solution pushes boundaries.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    index: "03",
    label: "Feasibility",
    weight: 20,
    desc: "Could this realistically ship within 6 months with a small team? Judges assess technical viability, scope management, and production-readiness of the prototype.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    index: "04",
    label: "Design & UX",
    weight: 15,
    desc: "Is it intuitive and well-crafted? Beyond aesthetics — does the interface reduce friction, communicate clearly, and demonstrate product thinking?",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      </svg>
    ),
  },
  {
    index: "05",
    label: "Business Value",
    weight: 10,
    desc: "Clear ROI or strategic alignment with company objectives. Judges want to see that you understand the commercial context and can articulate measurable outcomes.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

function CriterionRow({ c, i, open, onToggle }: {
  c: typeof CRITERIA[0]; i: number; open: boolean; onToggle: () => void;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -20 }}
      transition={{ delay: i * 0.07, duration: 0.6, ease: SOFT }}
    >
      {/* Top border */}
      <motion.div
        className="h-px"
        style={{ background: open ? "var(--border-accent)" : "var(--border-color)", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ delay: i * 0.07, duration: 0.6, ease: EXPO }}
      />

      {/* Row button */}
      <button
        onClick={onToggle}
        className="w-full text-left py-6 flex items-center gap-5 group"
        aria-expanded={open}
      >
        {/* Index */}
        <span
          className="font-mono text-xs tracking-widest flex-shrink-0 w-6 transition-colors duration-200"
          style={{ color: open ? "var(--brand-accent)" : "var(--text-muted)" }}
        >
          {c.index}
        </span>

        {/* Icon */}
        <span
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: open ? "var(--accent-subtle)" : "var(--bg-surface)",
            color: open ? "var(--brand-accent)" : "var(--text-muted)",
            border: `1px solid ${open ? "var(--border-accent)" : "var(--border-color)"}`,
          }}
        >
          {c.icon}
        </span>

        {/* Label */}
        <span
          className="flex-1 font-display font-semibold transition-colors duration-200"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
            letterSpacing: "-0.02em",
            color: open ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        >
          {c.label}
        </span>

        {/* Weight */}
        <span
          className="font-display font-bold flex-shrink-0 transition-colors duration-200"
          style={{
            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
            letterSpacing: "-0.04em",
            color: open ? "var(--brand-accent)" : "var(--text-muted)",
          }}
        >
          {c.weight}
          <span className="text-xs font-mono font-normal" style={{ color: "var(--text-muted)" }}>%</span>
        </span>

        {/* Chevron */}
        <motion.svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className="flex-shrink-0"
          style={{ color: "var(--text-muted)" }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: SOFT }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-7 pl-[76px] pr-6">
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                {c.desc}
              </p>
              {/* Weight bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-widest uppercase flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                  Weight
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border-color)" }}>
                  <motion.div
                    className="h-full origin-left"
                    style={{ background: "linear-gradient(90deg, var(--brand-accent), #33AAFF)", boxShadow: "0 0 6px var(--accent-glow)" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: c.weight / 30 }}
                    transition={{ delay: 0.1, duration: 0.7, ease: EXPO }}
                  />
                </div>
                <span className="font-mono text-xs flex-shrink-0" style={{ color: "var(--brand-accent)" }}>
                  {c.weight}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CriteriaSection() {
  const [open, setOpen] = useState<number | null>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once: false, amount: 0.4 });

  return (
    <section id="criteria" className="py-28 lg:py-36" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        <div ref={headerRef} className="mb-14">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
            transition={{ duration: 0.6, ease: SOFT }}
          >
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>Judging</span>
            <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>{CRITERIA.length} criteria</span>
          </motion.div>
          <div style={{ overflow: "hidden" }}>
            <motion.h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text-primary)" }}
              initial={{ y: "105%" }}
              animate={{ y: inView ? "0%" : "105%" }}
              transition={{ delay: 0.1, duration: 0.9, ease: SOFT }}
            >
              How you&apos;ll be judged.
            </motion.h2>
          </div>
        </div>

        <div>
          {CRITERIA.map((c, i) => (
            <CriterionRow
              key={c.index}
              c={c}
              i={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
          <div className="h-px" style={{ background: "var(--border-color)" }} />
        </div>

        {/* Total note */}
        <motion.p
          className="mt-6 text-xs font-mono tracking-[0.18em] uppercase text-right"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Total weight — 100%
        </motion.p>
      </div>
    </section>
  );
}
