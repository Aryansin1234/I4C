"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import DotGrid from "@/components/sections/DotGrid";

const SOFT = [0.16, 1, 0.3, 1] as const;

const WORDS = [
  "design.",
  "prototype.",
  "solve.",
  "build.",
  "develop.",
  "debug.",
  "learn.",
  "ship.",
  "collaborate.",
  "create.",
  "innovate.",
  "test.",
  "optimize.",
  "inspire.",
  "transform.",
  "deploy.",
  "win.",
];

function wordHue(i: number) {
  // Full 360° cycle — last word hue is close to first, seamless loop
  return Math.round((i / WORDS.length) * 360);
}

const INTERVAL_MS  = 2000;

/* ── Stat pill ───────────────────────────────────────────────── */
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-start px-4 py-2.5 rounded-xl"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
      whileHover={{ borderColor: "var(--border-accent)", boxShadow: "0 0 20px var(--accent-glow)", y: -2 }}
      data-cursor-hover
    >
      <span className="font-display font-bold leading-none"
        style={{ fontSize: "clamp(1rem,1.6vw,1.4rem)", letterSpacing: "-0.04em", color: "var(--brand-accent)" }}>
        {value}
      </span>
      <span className="text-[9px] font-mono tracking-widest uppercase mt-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
    </motion.div>
  );
}

function RevealWord({ children, delay, color }: { children: string; delay: number; color?: string }) {
  return (
    <span style={{ display: "inline-block", overflow: "visible", verticalAlign: "bottom", paddingBottom: "0.05em" }}>
      <motion.span
        style={{ display: "inline-block", color: color ?? "var(--text-primary)" }}
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.85, ease: SOFT, delay }}
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
  const [show,      setShow]      = useState(false);
  // tick increments forever — translateY always moves forward, no snap ever
  const [tick,      setTick]      = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeIdx = tick % WORDS.length;

  // We render COPIES copies of WORDS. Keep tick < COPIES * WORDS.length
  // by doing a silent DOM-only reset every COPIES cycles — user never sees it
  // because the visual position is identical (modular arithmetic).
  const COPIES = 6;
  // Effective tick for transform: cycles within COPIES * WORDS.length
  const effectiveTick = tick % (COPIES * WORDS.length);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) return;
    intervalRef.current = setInterval(() => {
      setTick(t => t + 1);
    }, INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [show]);

  function smoothNav(href: string) {
    const target = document.querySelector(href);
    if (!target) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (globalThis as any).__lenis;
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    else (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }

  const WORD_FONT = "clamp(1.6rem, 3vw, 3.5rem)";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)", paddingTop: "80px" }}
    >
      {/* ambient dot grid — full hero, behind all content */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <DotGrid />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] relative" style={{ zIndex: 1 }}>

        {/* ── LEFT ── */}
        <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 xl:px-20 py-16">

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10 w-fit"
            style={{ background: "var(--accent-subtle)", border: "1px solid var(--border-accent)" }}
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

          <div
            className="font-display font-bold mb-6 leading-[1]"
            style={{ fontSize: "clamp(3.8rem, 8vw, 9.5rem)", letterSpacing: "-0.05em" }}
          >
            {show && (
              <>
                <div className="flex flex-wrap gap-x-[0.2em] mb-1">
                  <RevealWord delay={0.1}>Invent</RevealWord>
                  <RevealWord delay={0.22}>for</RevealWord>
                </div>
                <div>
                  <RevealWord delay={0.36} color="var(--brand-accent)">Customers</RevealWord>
                </div>
              </>
            )}
          </div>

          <motion.div
            className="h-px mb-7 w-12"
            style={{ background: "var(--border-accent)", transformOrigin: "left" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: show ? 1 : 0, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.5, ease: SOFT, delay: 0.58 }}
          />

          <motion.p
            className="text-base leading-relaxed mb-10 max-w-sm"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14 }}
            transition={{ duration: 0.7, ease: SOFT, delay: 0.66 }}
          >
            48 hours. Real problems from{" "}
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Apple</span>{" "}
            and partners. Winners get fast-tracked into product.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 mb-10"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14 }}
            transition={{ duration: 0.7, ease: SOFT, delay: 0.8 }}
          >
            <motion.button
              onClick={() => smoothNav("#register")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: "var(--brand-accent)", boxShadow: "0 0 28px var(--accent-glow)" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 48px var(--accent-glow)" }}
              whileTap={{ scale: 0.96 }}
              data-cursor-hover
            >
              Register Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => smoothNav("#overview")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              whileHover={{ borderColor: "var(--border-accent)", boxShadow: "0 0 18px var(--accent-glow)" }}
              whileTap={{ scale: 0.96 }}
              data-cursor-hover
            >
              Learn More
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-2.5 max-w-[16rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14 }}
            transition={{ duration: 0.7, ease: SOFT, delay: 0.94 }}
          >
            <StatPill value="48h"  label="Build sprint" />
            <StatPill value="20+"  label="Teams"        />
            <StatPill value="$18K" label="Prize pool"   />
            <StatPill value="3"    label="Partners"     />
          </motion.div>
        </div>

        {/* ── RIGHT — word cycler ── */}
        <div className="hidden lg:flex flex-col justify-center items-end px-8 xl:px-16 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontSize:   WORD_FONT,
              display:    "flex",
              alignItems: "center",
              height:     "calc(7 * 1.5em)",
              gap:        "0.25em",
            }}
          >
            <span
              className="font-display font-bold select-none"
              style={{
                fontSize:      WORD_FONT,
                letterSpacing: "-0.05em",
                lineHeight:    1,
                color:         "var(--text-primary)",
                whiteSpace:    "nowrap",
                flexShrink:    0,
              }}
            >
              You Can
            </span>

            <div
              style={{
                position: "relative",
                flex:     1,
                overflow: "hidden",
                height:   "100%",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
                maskImage:       "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
              }}
            >
              <div
                style={{
                  transform:  `translateY(calc(${-(effectiveTick + WORDS.length)} * 1.5em))`,
                  transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                  paddingTop: "calc(3 * 1.5em)",
                }}
              >
                {Array.from({ length: COPIES + 2 }).flatMap((_, copy) =>
                  WORDS.map((word, wi) => {
                    const globalI   = copy * WORDS.length + wi;
                    const midActive = effectiveTick + WORDS.length;
                    const dist      = Math.abs(globalI - midActive);
                    const opacity   = dist === 0 ? 1
                      : dist === 1 ? 0.4
                      : dist === 2 ? 0.2
                      : dist === 3 ? 0.1
                      : 0.05;
                    const display = word.charAt(0).toUpperCase() + word.slice(1);
                    return (
                      <div
                        key={`${copy}-${wi}`}
                        style={{ lineHeight: 1.5, opacity, transition: "opacity 0.4s ease" }}
                      >
                        <span
                          className="font-display font-bold select-none"
                          style={{
                            fontSize:      WORD_FONT,
                            letterSpacing: "-0.05em",
                            color:         `oklch(68% 0.19 ${wordHue(wi)})`,
                          }}
                        >
                          {display}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
