"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const STEPS = [
  {
    step: "01",
    date: "Nov 1",
    tag: "Kickoff",
    title: "Registration Opens",
    body: "Form your team of 2–4. Pick your problem track. No pitch needed — just show up ready to build.",
  },
  {
    step: "02",
    date: "Nov 15",
    tag: "Brief",
    title: "Kickoff & Problems Released",
    body: "Meet the partners. Receive full problem briefs. Ask every question you have — this is your only shot.",
  },
  {
    step: "03",
    date: "Nov 22",
    tag: "Mentors",
    title: "Midpoint Checkpoint",
    body: "Optional mentor sync to pressure-test your direction. Course-correct before it costs you the win.",
  },
  {
    step: "04",
    date: "Nov 28",
    tag: "Ship",
    title: "Submissions Due",
    body: "Code, demo video, and write-up submitted. No extensions. Ship it.",
  },
  {
    step: "05",
    date: "Dec 5",
    tag: "Final",
    title: "Demo Day & Judging",
    body: "Live demos to partners and leadership. Winners announced. Best solutions fast-tracked into product.",
  },
];

function StepRow({ s, i }: { s: typeof STEPS[0]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const isLast = i === STEPS.length - 1;

  return (
    <div ref={ref}>
      {/* Divider line */}
      <motion.div
        className="h-px w-full"
        style={{ background: "var(--border-color)", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ delay: i * 0.05, duration: 0.7, ease: EXPO }}
      />

      {/* Row */}
      <motion.div
        className="grid items-start py-8 gap-6"
        style={{ gridTemplateColumns: "5rem 1fr auto" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 24 }}
        transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: SOFT }}
      >
        {/* Step number */}
        <span
          className="font-display font-bold leading-none"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.04em",
            color: isLast ? "var(--brand-accent)" : "var(--text-muted)",
          }}
        >
          {s.step}
        </span>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* Tag */}
          <span
            className="text-[10px] font-mono tracking-[0.22em] uppercase w-fit px-2 py-0.5 rounded-full"
            style={{
              color: "var(--brand-accent)",
              background: "var(--accent-subtle)",
              border: "1px solid var(--border-accent)",
            }}
          >
            {s.tag}
          </span>

          {/* Title */}
          <h3
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.2rem, 2vw, 1.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: isLast ? "var(--brand-accent)" : "var(--text-primary)",
            }}
          >
            {s.title}
          </h3>

          {/* Body */}
          <p
            className="text-sm leading-relaxed max-w-lg"
            style={{ color: "var(--text-muted)" }}
          >
            {s.body}
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col items-end gap-1 pt-1">
          <span
            className="font-mono text-xs tracking-widest uppercase whitespace-nowrap"
            style={{ color: isLast ? "var(--brand-accent)" : "var(--text-secondary)" }}
          >
            {s.date}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function TimelineSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once: false, amount: 0.3 });

  return (
    <section
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
              Nov – Dec 2024
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
              Five weeks.{" "}
              <span style={{ color: "var(--brand-accent)" }}>No shortcuts.</span>
            </motion.h2>
          </div>
        </div>

        {/* Steps */}
        <div>
          {STEPS.map((s, i) => (
            <StepRow key={s.step} s={s} i={i} />
          ))}

          {/* Final bottom line */}
          <motion.div
            className="h-px w-full"
            style={{ background: "var(--border-color)", transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.7, ease: EXPO }}
          />
        </div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: SOFT }}
        >
          <div>
            <div className="font-display font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>
              Registration closes Nov 1
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
