"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const GAINS = [
  {
    id: "experience",
    num: "01",
    title: "Hands-On\nExperience",
    body: "Production-grade problems. Real constraints, real timelines, real partners watching you demo.",
    stat: "48h",
    statLabel: "sprint",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "network",
    num: "02",
    title: "Industry\nConnections",
    body: "Apple engineers. Partner leaders. The people you meet here decide what ships next.",
    stat: "3+",
    statLabel: "partners",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    id: "growth",
    num: "03",
    title: "Technical\nGrowth",
    body: "Stretch across AI, UX, infrastructure, and data. 48 hours forces you to learn fast.",
    stat: "10",
    statLabel: "tracks",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "recognition",
    num: "04",
    title: "Real\nRecognition",
    body: "Winners featured with partners. Your solution on a real product roadmap — not a shelf.",
    stat: "$18K",
    statLabel: "prizes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    id: "impact",
    num: "05",
    title: "Shipped\nImpact",
    body: "Skip the gatekeeping. Winning solutions go straight from demo day to engineering roadmap.",
    stat: "100%",
    statLabel: "to prod",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "mentorship",
    num: "06",
    title: "Expert\nMentorship",
    body: "Engineers and PMs who've shipped to millions — available for 1:1s throughout the sprint.",
    stat: "20+",
    statLabel: "sessions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

/* ─── Single editorial row ───────────────────────────────────── */
function GainRow({ g, i }: { g: typeof GAINS[0]; i: number }) {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: false, amount: 0.4 });
  const [hov, setHov] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // number parallaxes up slightly as you scroll past
  const numY = useTransform(scrollYProgress, [0, 1], ["12px", "-12px"]);

  return (
    <div ref={ref}>
      {/* Rule — draws in from left */}
      <motion.div
        className="h-px"
        style={{ transformOrigin: "left", background: "var(--border-color)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.75, ease: EXPO, delay: i * 0.04 }}
      />

      {/* Row */}
      <motion.div
        className="grid items-center py-8 gap-6"
        style={{
          gridTemplateColumns: "4rem 1fr 1fr auto",
          cursor: "default",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >

        {/* ── Col 1: large number ── */}
        <motion.span
          className="font-display font-bold leading-none select-none tabular-nums"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            letterSpacing: "-0.05em",
            y: numY,
            color: hov ? "var(--brand-accent)" : "var(--text-muted)",
            transition: "color 0.25s",
          }}
        >
          {g.num}
        </motion.span>

        {/* ── Col 2: title ── */}
        <div style={{ overflow: "hidden" }}>
          <motion.h3
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.6rem, 3.2vw, 3rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              whiteSpace: "pre-line",
              color: hov ? "var(--text-primary)" : "var(--text-secondary)",
              transition: "color 0.25s",
            }}
            initial={{ y: "105%" }}
            animate={{ y: inView ? "0%" : "105%" }}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.85, ease: SOFT }}
          >
            {g.title}
          </motion.h3>
        </div>

        {/* ── Col 3: body ── */}
        <motion.p
          className="text-sm leading-relaxed max-w-sm hidden md:block"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.2 + i * 0.04, duration: 0.6 }}
        >
          {g.body}
        </motion.p>

        {/* ── Col 4: stat + icon ── */}
        <motion.div
          className="flex flex-col items-end gap-1"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 16 }}
          transition={{ delay: 0.15 + i * 0.04, duration: 0.6, ease: SOFT }}
        >
          <div className="flex items-center gap-3">
            {/* Icon pill */}
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: hov ? "var(--accent-subtle)" : "var(--bg-surface)",
                border: `1px solid ${hov ? "var(--border-accent)" : "var(--border-color)"}`,
                color: hov ? "var(--brand-accent)" : "var(--text-muted)",
                transition: "all 0.25s",
              }}
              animate={{ rotate: hov ? 8 : 0, scale: hov ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {g.icon}
            </motion.div>

            {/* Stat */}
            <div className="text-right">
              <div
                className="font-display font-bold leading-none tabular-nums"
                style={{
                  fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                  letterSpacing: "-0.04em",
                  color: hov ? "var(--brand-accent)" : "var(--text-primary)",
                  filter: hov ? "drop-shadow(0 0 10px var(--accent-glow))" : "none",
                  transition: "color 0.25s, filter 0.25s",
                }}
              >
                {g.stat}
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                {g.statLabel}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────── */
export default function LearningsSection() {
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once: false, amount: 0.4 });

  return (
    <section id="learnings" className="py-28 lg:py-36" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        {/* ── Header ── */}
        <div ref={headerRef} className="flex items-end justify-between gap-8 mb-16">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
              transition={{ duration: 0.6, ease: SOFT }}
            >
              <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>
                What you&apos;ll gain
              </span>
              <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>
                Beyond the prize
              </span>
            </motion.div>

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
                You leave with more<br />
                <span style={{ color: "var(--brand-accent)" }}>than a trophy.</span>
              </motion.h2>
            </div>
          </div>

          {/* CTA top-right */}
          <motion.a
            href="#register"
            className="hidden lg:inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0 mb-1"
            style={{ background: "var(--brand-accent)", color: "#fff", boxShadow: "0 0 28px var(--accent-glow)" }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 48px var(--accent-glow)" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Register Now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.a>
        </div>

        {/* ── Editorial rows ── */}
        <div>
          {GAINS.map((g, i) => (
            <GainRow key={g.id} g={g} i={i} />
          ))}
          {/* Final bottom rule */}
          <motion.div
            className="h-px"
            style={{ transformOrigin: "left", background: "var(--border-color)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.75, ease: EXPO }}
          />
        </div>
      </div>
    </section>
  );
}
