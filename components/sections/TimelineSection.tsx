"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const STEPS = [
  {
    step: "01",
    date: "Nov 1",
    tag: "Kickoff",
    title: "Registration Opens",
    body: "Form your team of 2–4. Pick your problem track. No pitch needed — just show up ready to build.",
    accent: "#0066FF",
  },
  {
    step: "02",
    date: "Nov 15",
    tag: "Brief",
    title: "Kickoff & Problems Released",
    body: "Meet the partners. Receive full problem briefs. Ask every question you have — this is your only shot.",
    accent: "#0077FF",
  },
  {
    step: "03",
    date: "Nov 22",
    tag: "Mentors",
    title: "Midpoint Checkpoint",
    body: "Optional mentor sync to pressure-test your direction. Course-correct before it costs you the win.",
    accent: "#0088FF",
  },
  {
    step: "04",
    date: "Nov 28",
    tag: "Ship",
    title: "Submissions Due",
    body: "Code, demo video, and write-up submitted. No extensions. Ship it.",
    accent: "#0099FF",
    urgent: true,
  },
  {
    step: "05",
    date: "Dec 5",
    tag: "Final",
    title: "Demo Day & Judging",
    body: "Live demos to partners and leadership. Winners announced. Best solutions fast-tracked into product.",
    accent: "#33AAFF",
    isLast: true,
  },
];

/* ─── Animated SVG connector line ───────────────────────────── */
function ConnectorLine({ progress }: { progress: number }) {
  return (
    <div
      className="absolute left-[22px] top-0 bottom-0 w-px pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      {/* Static track */}
      <div className="absolute inset-0" style={{ background: "var(--border-color)" }} />
      {/* Animated fill */}
      <motion.div
        className="absolute inset-x-0 top-0 origin-top"
        style={{
          background: "linear-gradient(to bottom, #0044CC, #0066FF, #33AAFF)",
          boxShadow: "0 0 8px rgba(0,102,255,0.5)",
          height: `${progress * 100}%`,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

/* ─── Single step node ──────────────────────────────────────── */
function StepNode({ s, i, isActive }: { s: typeof STEPS[0]; i: number; isActive: boolean }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5, margin: "0px 0px -150px 0px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6 cursor-default"
      style={{ paddingLeft: "52px" }}
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -24 }}
      transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: SOFT }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Node dot */}
      <motion.div
        className="absolute left-0 top-1 flex items-center justify-center"
        style={{ width: "44px", height: "44px" }}
      >
        {/* Outer ring — pulses on active/hover */}
        <motion.div
          className="absolute rounded-full"
          style={{ border: `1px solid ${s.accent}44` }}
          animate={{
            width:   (isActive || hovered) ? "44px" : "0px",
            height:  (isActive || hovered) ? "44px" : "0px",
            opacity: (isActive || hovered) ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: SOFT }}
        />
        {/* Inner dot */}
        <motion.div
          className="rounded-full z-10 flex items-center justify-center font-mono font-bold"
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.02em",
          }}
          animate={{
            width:      (isActive || hovered) ? "28px" : "20px",
            height:     (isActive || hovered) ? "28px" : "20px",
            background: (isActive || hovered) ? s.accent : "var(--bg-elevated)",
            border:     `1px solid ${(isActive || hovered) ? s.accent : "var(--border-color)"}`,
            color:      (isActive || hovered) ? "#fff" : "var(--text-muted)",
            boxShadow:  (isActive || hovered) ? `0 0 16px ${s.accent}66` : "none",
          }}
          transition={{ duration: 0.3, ease: SOFT }}
        >
          {s.step}
        </motion.div>
      </motion.div>

      {/* Content card */}
      <motion.div
        className="flex-1 pb-10 last:pb-0"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.25, ease: SOFT }}
      >
        {/* Tag + date row */}
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-[9px] font-mono tracking-[0.22em] uppercase px-2 py-0.5 rounded-full"
            style={{
              color: s.urgent ? "var(--amber-accent)" : s.accent,
              background: s.urgent ? "var(--amber-subtle)" : `${s.accent}15`,
              border: `1px solid ${s.urgent ? "var(--amber-glow)" : s.accent + "33"}`,
            }}
          >
            {s.tag}
          </span>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: s.urgent ? "var(--amber-accent)" : "var(--text-muted)" }}>
            {s.date}
          </span>
          {s.urgent && (
            <motion.span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--amber-accent)" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold mb-2"
          style={{
            fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: s.isLast ? s.accent : "var(--text-primary)",
          }}
        >
          {s.title}
        </h3>

        {/* Body */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "520px" }}>
          {s.body}
        </p>

        {/* Winner accent on last item */}
        {s.isLast && (
          <motion.div
            className="flex items-center gap-2 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="h-px w-8" style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: s.accent }}>
              Winners announced
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function TimelineSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLDivElement>(null);
  const inView        = useInView(headerRef, { once: false, amount: 0.3, margin: "0px 0px -150px 0px" });

  // Track scroll progress through the steps for the connector line fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [lp, setLp] = useState(0);
  useEffect(() => {
    return lineProgress.on("change", (v) => setLp(v));
  }, [lineProgress]);

  // Determine which step is "active" based on scroll
  const activeIndex = Math.min(Math.floor(lp * STEPS.length), STEPS.length - 1);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="py-28 lg:py-36 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
            transition={{ duration: 0.6, ease: SOFT }}
          >
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>
              Schedule
            </span>
            <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>
              Nov – Dec 2025
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
                Five weeks.{" "}
                <span style={{ color: "var(--brand-accent)" }}>No shortcuts.</span>
              </motion.h2>
            </div>

            <motion.p
              className="hidden lg:block text-sm max-w-xs text-right flex-shrink-0 mb-1 leading-relaxed"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Every step is intentional. No filler, no busywork.
            </motion.p>
          </div>
        </div>

        {/* Vertical timeline */}
        <div ref={containerRef} className="relative max-w-3xl">
          {/* Animated connector */}
          <ConnectorLine progress={lp} />

          {/* Steps */}
          {STEPS.map((s, i) => (
            <StepNode key={s.step} s={s} i={i} isActive={i <= activeIndex} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px 0px -150px 0px" }}
          transition={{ duration: 0.7, ease: SOFT }}
        >
          <div>
            <div className="font-display font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>
              Registration closes{" "}
              <span style={{ color: "var(--amber-accent)" }}>Nov 1</span>
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              Teams of 2–4. All levels welcome.
            </div>
          </div>
          <motion.a
            href="#register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0"
            style={{ background: "var(--brand-accent)", color: "#fff", boxShadow: "0 0 28px var(--accent-glow)" }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 48px var(--accent-glow)" }}
            whileTap={{ scale: 0.97 }}
            data-cursor-hover
          >
            Register now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
