"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Timeline", href: "#timeline" },
  { label: "Problems", href: "#problems" },
  { label: "Partners", href: "#partners" },
  { label: "Prizes",   href: "#prizes"   },
  { label: "Register", href: "#register" },
];

/* ─── Smooth scroll via Lenis ────────────────────────────────── */
function useSmoothNav() {
  return (href: string, onDone?: () => void) => {
    const target = href === "#hero" ? document.body : document.querySelector(href);
    if (!target) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (globalThis as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2, onComplete: onDone });
    } else {
      (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
      onDone?.();
    }
  };
}

/* ─── Active section tracker ─────────────────────────────────── */
function useActiveSection(hrefs: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    hrefs.forEach((href) => {
      const el = document.getElementById(href.replace("#", ""));
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(href); },
        { threshold: 0.25 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [hrefs]);
  return active;
}

/* ─── Theme toggle ───────────────────────────────────────────── */
function useLocalTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);
  const setTheme = (next: "dark" | "light") => {
    const html = document.documentElement;
    if (next === "dark") { html.classList.add("dark");  html.classList.remove("light"); }
    else                 { html.classList.add("light"); html.classList.remove("dark");  }
    try { localStorage.setItem("theme", next); } catch {}
    setThemeState(next);
  };
  return { theme, setTheme };
}

function ThemeToggle() {
  const { theme, setTheme } = useLocalTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const toggle = () => {
    if (!btnRef.current) return;
    const next = theme === "dark" ? "light" : "dark";
    const r    = btnRef.current.getBoundingClientRect();
    const cx   = r.left + r.width  / 2;
    const cy   = r.top  + r.height / 2;
    const maxR = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    const cvs  = Object.assign(document.createElement("canvas"), { width: innerWidth, height: innerHeight });
    cvs.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none";
    document.body.appendChild(cvs);
    const ctx  = cvs.getContext("2d")!;
    const fill = next === "dark" ? "#0D0D0F" : "#F5F4F0";
    let radius = 0; let swapped = false;
    const step = () => {
      radius += maxR / 26;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill; ctx.fill();
      if (radius > maxR * 0.6 && !swapped) { swapped = true; setTheme(next); }
      if (radius < maxR + 10) requestAnimationFrame(step);
      else { cvs.style.transition = "opacity .2s"; cvs.style.opacity = "0"; setTimeout(() => cvs.remove(), 220); }
    };
    requestAnimationFrame(step);
  };

  if (!mounted) return <div className="w-8 h-8" />;
  const dark = theme === "dark";
  return (
    <motion.button
      ref={btnRef} onClick={toggle} aria-label="Toggle theme"
      className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{ border: "1px solid var(--border-color)", background: "transparent" }}
      whileHover={{ scale: 1.08, borderColor: "var(--brand-accent)" }}
      whileTap={{ scale: 0.92 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? "sun" : "moon"}
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.18 }}>
          {dark ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-secondary)" }}>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-secondary)" }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Main Navigation ────────────────────────────────────────── */
export default function Navigation() {
  const [scrollY, setScrollY]       = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillStyle, setPillStyle]   = useState<{ left: number; width: number } | null>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const { scrollY: sv }   = useScroll();
  const active    = useActiveSection(NAV_LINKS.map((l) => l.href));
  const smoothNav = useSmoothNav();

  useMotionValueEvent(sv, "change", (v) => setScrollY(v));

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrolled = scrollY > 60;

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const container = linksContainerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const lr = e.currentTarget.getBoundingClientRect();
    setPillStyle({ left: lr.left - cr.left, width: lr.width });
  };
  const handleLinksLeave = () => setPillStyle(null);

  return (
    <>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.nav
          className="flex items-center gap-0 rounded-2xl"
          style={{
            marginTop: scrolled ? "8px" : "14px",
            paddingLeft:   scrolled ? "12px" : "0px",
            paddingRight:  scrolled ? "12px" : "0px",
            paddingTop:    scrolled ? "6px"  : "10px",
            paddingBottom: scrolled ? "6px"  : "10px",
            background:    scrolled ? "color-mix(in srgb, var(--bg-surface) 82%, transparent)" : "transparent",
            backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
            border: `1px solid ${scrolled ? "var(--border-color)" : "transparent"}`,
            boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); smoothNav("#hero"); }}
            className="shrink-0 flex items-center"
            style={{
              paddingTop: "6px", paddingBottom: "6px",
              paddingRight: scrolled ? "12px" : "0px",
              marginRight:  scrolled ? "4px"  : "0px",
              borderRight: scrolled ? "1px solid var(--border-color)" : "none",
              opacity: scrolled ? 1 : 0,
              pointerEvents: scrolled ? "auto" : "none",
              transition: "all 0.3s ease",
            }}
            whileHover={{ scale: 1.04 }}
          >
            <span className="font-display font-bold" style={{ fontSize: "0.95rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
              I4C<span style={{ color: "var(--brand-accent)" }}>.</span>
            </span>
          </motion.a>

          {/* Desktop links */}
          <div
            ref={linksContainerRef}
            className="relative hidden md:flex items-center py-1 px-1 flex-1"
            onMouseLeave={handleLinksLeave}
          >
            <AnimatePresence>
              {pillStyle && (
                <motion.div
                  key="hover-pill"
                  className="absolute top-1/2 -translate-y-1/2 rounded-lg pointer-events-none"
                  style={{ height: "calc(100% - 8px)", background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}
                  initial={{ opacity: 0, left: pillStyle.left, width: pillStyle.width }}
                  animate={{ opacity: 1, left: pillStyle.left, width: pillStyle.width }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.6 }}
                />
              )}
            </AnimatePresence>
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <a key={link.href} href={link.href}
                  onClick={(e) => { e.preventDefault(); smoothNav(link.href); }}
                  onMouseEnter={handleLinkHover}
                  className="relative z-10 px-3 py-2 text-[13px] font-medium rounded-lg whitespace-nowrap select-none"
                  style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)", letterSpacing: "0.01em", transition: "color 0.15s" }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span layoutId="active-dot"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--brand-accent)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div
            className="flex items-center gap-2 shrink-0 ml-auto"
            style={{
              paddingLeft:   scrolled ? "12px" : "0px",
              marginLeft:    scrolled ? "4px"  : "0px",
              borderLeft:    scrolled ? "1px solid var(--border-color)" : "none",
              paddingTop: "6px", paddingBottom: "6px",
              transition: "all 0.3s ease",
            }}
          >
            <ThemeToggle />
            <motion.a
              href="#register"
              onClick={(e) => { e.preventDefault(); smoothNav("#register"); }}
              className="hidden md:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold"
              style={{ background: "var(--brand-accent)", color: "#fff" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--accent-glow)" }}
              whileTap={{ scale: 0.96 }}
            >
              Register
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </motion.a>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-lg flex-shrink-0"
              style={{ border: "1px solid var(--border-color)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {[0, 1, 2].map((i) => (
                <motion.span key={i}
                  className="block h-px rounded-full"
                  style={{ background: "var(--text-secondary)", width: i === 1 ? "10px" : "14px" }}
                  animate={mobileOpen
                    ? i === 0 ? { rotate: 45,  y: 6,  width: "14px" }
                    : i === 1 ? { opacity: 0 }
                    :           { rotate: -45, y: -6, width: "14px" }
                    : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? "10px" : "14px" }
                  }
                  transition={{ duration: 0.22 }}
                />
              ))}
            </button>
          </div>
        </motion.nav>
      </motion.div>

      {/* ─── Scroll progress ─────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[102] h-px origin-left"
        style={{
          background: "linear-gradient(90deg, #0044CC, #0066FF, #33AAFF)",
          scaleX: sv,
          boxShadow: "0 0 6px #0066FF88",
        }}
      />

      {/* ─── Mobile menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[99] flex flex-col md:hidden"
            style={{ background: "var(--bg-base)" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{   clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                opacity: 0.3,
              }}
            />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <span className="font-display font-bold text-lg" style={{ letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                I4C<span style={{ color: "var(--brand-accent)" }}>.</span>
              </span>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
                  aria-label="Close menu"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Links */}
            <ul className="relative z-10 flex flex-col flex-1 justify-center px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.li key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); smoothNav(link.href, () => setMobileOpen(false)); setMobileOpen(false); }}
                    className="flex items-center justify-between py-4 border-b"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <span className="font-display font-semibold text-xl" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      {link.label}
                    </span>
                    <span className="text-sm" style={{ color: "var(--brand-accent)" }}>→</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div
              className="relative z-10 px-6 py-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <a
                href="#register"
                onClick={(e) => { e.preventDefault(); smoothNav("#register", () => setMobileOpen(false)); setMobileOpen(false); }}
                className="flex items-center justify-center w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: "var(--brand-accent)", color: "#fff", boxShadow: "0 0 40px var(--accent-glow)" }}
              >
                Register Now →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
