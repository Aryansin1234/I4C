"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

/* ─── CTA Section ────────────────────────────────────────────── */
export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: false, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="register"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Particle field */}

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,102,255,0.22) 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,102,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">

        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
          transition={{ duration: 0.6, ease: SOFT }}
        >
          <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
          <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>
            Registration
          </span>
          <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
        </motion.div>

        {/* Headline — lines clip up */}
        <h2
          className="font-display font-bold mb-6"
          style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "-0.04em" }}
          aria-label="Ready to build?"
        >
          {["Ready to", "build?"].map((line, li) => (
            <div key={li} style={{ overflow: "hidden" }}>
              <motion.div
                style={{ color: li === 1 ? "var(--brand-accent)" : "var(--text-primary)", display: "block" }}
                initial={{ y: "105%" }}
                animate={{ y: inView ? "0%" : "105%" }}
                transition={{ delay: 0.15 + li * 0.12, duration: 0.9, ease: SOFT }}
              >
                {line}
              </motion.div>
            </div>
          ))}
        </h2>

        {/* Sub */}
        <motion.p
          className="text-lg mb-12 max-w-md mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
          transition={{ delay: 0.4, duration: 0.7, ease: SOFT }}
        >
          Registration closes <strong style={{ color: "var(--text-primary)" }}>November 1st</strong>.
          Teams of 2–4. 48 hours to change everything.
        </motion.p>

        {/* Key stats row */}
        <motion.div
          className="flex items-center justify-center gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            { val: "20+", label: "Teams" },
            { val: "$18K", label: "Prize pool" },
            { val: "Dec 5", label: "Demo Day" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span
                className="font-display font-bold"
                style={{ fontSize: "1.5rem", letterSpacing: "-0.04em", color: "var(--text-primary)" }}
              >
                {s.val}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
          transition={{ delay: 0.58, duration: 0.6, ease: SOFT }}
        >
          {/* Primary */}
          <motion.a
            href="#"
            className="relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base font-bold min-h-[56px] overflow-hidden"
            style={{ background: "var(--brand-accent)", color: "#fff", boxShadow: "0 0 48px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.15)" }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 72px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
            data-cursor-hover
          >
            <motion.span
              className="absolute inset-0 -skew-x-12 pointer-events-none"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}
              initial={{ x: "-150%" }}
              whileHover={{ x: "150%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Register Now</span>
            <motion.svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </motion.svg>
          </motion.a>

          {/* Secondary */}
          <motion.a
            href="mailto:hackathon@company.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold min-h-[56px]"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border-color)", background: "transparent" }}
            whileHover={{ borderColor: "var(--brand-accent)", color: "var(--text-primary)", background: "var(--accent-subtle)" }}
            whileTap={{ scale: 0.97 }}
            data-cursor-hover
          >
            Questions? Contact us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
