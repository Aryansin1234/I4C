"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;

const NAV_COLS = [
  {
    heading: "Hackathon",
    links: [
      { label: "Overview",  href: "#overview"  },
      { label: "Timeline",  href: "#timeline"  },
      { label: "Problems",  href: "#problems"  },
      { label: "Prizes",    href: "#prizes"    },
    ],
  },
  {
    heading: "Participate",
    links: [
      { label: "Register",      href: "#register"  },
      { label: "Partners",      href: "#partners"  },
      { label: "Criteria",      href: "#criteria"  },
      { label: "What You Gain", href: "#learnings" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms",   href: "#" },
      { label: "Contact", href: "mailto:hackathon@company.com" },
      { label: "About",   href: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <footer
      ref={ref}
      id="footer"
      className="relative overflow-hidden"
      style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border-color)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 100%, var(--accent-subtle) 0%, transparent 70%)",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-20 pt-16 pb-8">

        {/* Nav columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">

          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
            transition={{ delay: 0.2, duration: 0.6, ease: SOFT }}
          >
            <span
              className="font-display font-bold text-xl mb-4 block"
              style={{ letterSpacing: "-0.04em", color: "var(--text-primary)" }}
            >
              I4C<span style={{ color: "var(--brand-accent)" }}>.</span>
            </span>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              An internal hackathon where engineers, designers, and PMs build real solutions to real customer problems.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  whileHover={{
                    borderColor: "var(--border-accent)",
                    color: "var(--brand-accent)",
                    y: -2,
                    boxShadow: "0 4px 16px var(--accent-glow)",
                  }}
                  transition={{ duration: 0.18 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {NAV_COLS.map((col, ci) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
              transition={{ delay: 0.28 + ci * 0.06, duration: 0.6, ease: SOFT }}
            >
              <p
                className="text-[10px] font-mono tracking-[0.22em] uppercase mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <motion.a
                      href={l.href}
                      className="text-sm inline-flex items-center gap-1"
                      style={{ color: "var(--text-secondary)" }}
                      whileHover={{ color: "var(--text-primary)", x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {l.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid var(--border-color)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            © 2026 SAP Labs India. Invent for Customers — internal hackathon event.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              Built with
            </span>
            {["Next.js", "Framer Motion", "GSAP"].map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 rounded"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
