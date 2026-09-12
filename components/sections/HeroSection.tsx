"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import DotGrid from "@/components/sections/DotGrid";

const SOFT = [0.16, 1, 0.3, 1] as const;

/* ── Stat pill ───────────────────────────────────────────────── */
function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center px-5 py-3 rounded-2xl"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: SOFT, delay }}
      whileHover={{ borderColor: "var(--border-accent)", boxShadow: "0 0 28px var(--accent-glow)", y: -3 }}
      data-cursor-hover
    >
      <span
        className="font-display font-bold leading-none"
        style={{ fontSize: "clamp(1.3rem,2.5vw,1.8rem)", letterSpacing: "-0.04em", color: "var(--brand-accent)" }}
      >
        {value}
      </span>
      <span className="text-[10px] font-mono tracking-widest uppercase mt-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ── Word reveal — each word clips up from below ────────────── */
function RevealWord({
  children,
  delay,
  color,
}: {
  children: string;
  delay: number;
  color?: string;
}) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
      <motion.span
        style={{ display: "inline-block", color: color ?? "var(--text-primary)" }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.75, ease: SOFT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* scroll exit */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY         = useTransform(scrollYProgress, [0, 0.55], ["0%", "-38%"]);
  const contentOpacity   = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const contentScale     = useTransform(scrollYProgress, [0, 0.55], [1, 0.88]);
  const glowOpacity      = useTransform(scrollYProgress, [0, 0.40], [1, 0]);
  const scrollIndOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  /* mouse parallax */
  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const badgeX  = useTransform(springX, v => v *  8);
  const badgeY  = useTransform(springY, v => v *  6);
  const headX   = useTransform(springX, v => v * -12);
  const headY   = useTransform(springY, v => v *  -8);
  const subX    = useTransform(springX, v => v *  5);
  const subY    = useTransform(springY, v => v *  4);
  const glowX   = useTransform(springX, v => 50 + v * 12);
  const glowY   = useTransform(springY, v => 40 + v *  8);
  const spotBg  = useMotionTemplate`radial-gradient(ellipse 65% 50% at ${glowX}% ${glowY}%, var(--accent-subtle), transparent 70%)`;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width  - 0.5);
      rawY.set((e.clientY - r.top)  / r.height - 0.5);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  function smoothNav(href: string) {
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = (globalThis as { __lenis?: { scrollTo: (el: Element, opts: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    else (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "80px" }}
    >
      <div className="absolute inset-0"><DotGrid /></div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: spotBg, opacity: glowOpacity }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        {/* badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
          style={{ background: "var(--accent-subtle)", border: "1px solid var(--border-accent)", x: badgeX, y: badgeY }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
          transition={{ duration: 0.6, ease: SOFT }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--brand-accent)" }}
            animate={{ boxShadow: ["0 0 4px var(--brand-accent)", "0 0 14px var(--brand-accent)", "0 0 4px var(--brand-accent)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase" style={{ color: "var(--brand-accent)" }}>
            Nov 2025 · SAP Labs India
          </span>
        </motion.div>

        {/* headline — word-by-word clip reveal with parallax */}
        {show && (
          <motion.div
            className="mb-6 leading-none font-display font-bold"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 10.5rem)",
              letterSpacing: "-0.05em",
              x: headX,
              y: headY,
            }}
          >
            {/* line 1 */}
            <div className="flex flex-wrap justify-center gap-x-[0.22em] mb-1">
              <RevealWord delay={0.1}>Invent</RevealWord>
              <RevealWord delay={0.22}>for</RevealWord>
            </div>
            {/* line 2 */}
            <div className="flex flex-wrap justify-center">
              <RevealWord delay={0.36} color="var(--brand-accent)">Customers</RevealWord>
            </div>
          </motion.div>
        )}

        {/* hairline rule */}
        <motion.div
          className="w-16 h-px mb-8"
          style={{ background: "var(--border-accent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: show ? 1 : 0, opacity: show ? 1 : 0 }}
          transition={{ duration: 0.6, ease: SOFT, delay: 0.65 }}
        />

        {/* sub */}
        <motion.p
          className="max-w-lg text-lg leading-relaxed mb-10"
          style={{ color: "var(--text-secondary)", x: subX, y: subY }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14 }}
          transition={{ duration: 0.7, ease: SOFT, delay: 0.72 }}
        >
          48 hours. Real problems from{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Apple</span> and partners.
          Real engineers judging. Winners get fast-tracked into product.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-14"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14 }}
          transition={{ duration: 0.7, ease: SOFT, delay: 0.86 }}
        >
          <motion.button
            onClick={() => smoothNav("#register")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white"
            style={{ background: "var(--brand-accent)", boxShadow: "0 0 32px var(--accent-glow)" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 52px var(--accent-glow)" }}
            whileTap={{ scale: 0.96 }}
            data-cursor-hover
          >
            Register Now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.button>

          <motion.button
            onClick={() => smoothNav("#overview")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            whileHover={{ borderColor: "var(--border-accent)", boxShadow: "0 0 20px var(--accent-glow)" }}
            whileTap={{ scale: 0.96 }}
            data-cursor-hover
          >
            Learn More
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </motion.div>

        {/* stats */}
        <div className="flex flex-wrap gap-3 justify-center">
          <StatPill value="48h"  label="Build sprint" delay={1.0} />
          <StatPill value="20+"  label="Teams"        delay={1.08} />
          <StatPill value="$18K" label="Prize pool"   delay={1.16} />
          <StatPill value="3"    label="Partners"     delay={1.24} />
        </div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: scrollIndOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
          Scroll
        </span>
        <motion.div
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, var(--brand-accent), transparent)" }}
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
