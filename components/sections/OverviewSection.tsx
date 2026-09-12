"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView, animate } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const SOFT = [0.16, 1, 0.3, 1] as const;

/* ─── SVG Icons ──────────────────────────────────────────────── */
function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconAward() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7v10"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */
const PILLARS = [
  { Icon: IconTarget, title: "Real problems",       body: "From Apple and partners — not toy datasets. Challenges that $100B engineering orgs haven't cracked.", accent: "#0066FF" },
  { Icon: IconUsers,  title: "Ship-ready mentors",  body: "Engineers, designers, and PMs who've launched products used by millions — available throughout.",    accent: "#33AAFF" },
  { Icon: IconAward,  title: "Prizes + fast-track", body: "Cash prizes and direct access to real product teams. Winning solutions skip the gatekeeping.",       accent: "#5599FF" },
];

const STATS = [
  { value: 20,  suffix: "+", label: "Competing teams",    bar: 0.65 },
  { value: 12,  suffix: "",  label: "Problem statements", bar: 0.40 },
  { value: 48,  suffix: "h", label: "Build window",       bar: 1.0  },
  { value: 18,  suffix: "K", label: "Prize pool",         bar: 0.85, prefix: "$" },
  { value: 3,   suffix: "",  label: "Industry partners",  bar: 0.25 },
  { value: 100, suffix: "%", label: "Production path",    bar: 1.0,  special: "Real" },
];

const PROCESS = [
  { step: "01", date: "Nov 1",  title: "Registration Opens",          detail: "Form your team of 2–4. Pick your problem track." },
  { step: "02", date: "Nov 15", title: "Kickoff & Problems Released", detail: "Meet partners. Get full briefs. Ask everything." },
  { step: "03", date: "Nov 22", title: "Midpoint Checkpoint",         detail: "Optional mentor sync. Course-correct before it's too late." },
  { step: "04", date: "Nov 28", title: "Submissions Due",             detail: "Code, demo video, and write-up. No extensions." },
  { step: "05", date: "Dec 5",  title: "Demo Day & Judging",          detail: "Live demos to partners and leadership. Winners announced." },
];

/* ─── Rolling counter ───────────────────────────────────────── */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, {
      duration: 1.6, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, to]);

  return <span ref={ref} className="tabular-nums">{prefix}{val}{suffix}</span>;
}

/* ─── Clip-reveal line — driven by inView bool, not intersection ─ */
function ClipLine({ children, inView, delay, style }: {
  children: React.ReactNode;
  inView: boolean;
  delay: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        style={style}
        initial={{ y: "105%" }}
        animate={{ y: inView ? "0%" : "105%" }}
        transition={{ delay: inView ? delay : 0, duration: 0.9, ease: SOFT }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PANEL 1 — What is I4C
══════════════════════════════════════════════════════════════ */
function Panel1() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 flex flex-col justify-center px-10 md:px-16 lg:px-24 py-20"
      style={{ width: "100vw", minHeight: "100vh", borderRight: "1px solid var(--border-color)" }}
    >
      {/* Eyebrow */}
      <motion.div
        className="flex items-center gap-3 mb-10"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
        transition={{ duration: 0.6, ease: SOFT }}
      >
        <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>01</span>
        <span className="w-10 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>What is I4C</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl">
        {/* Left */}
        <div>
          <h2 className="font-display font-bold mb-6"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            <ClipLine inView={inView} delay={0.05}>We don&apos;t build</ClipLine>
            <ClipLine inView={inView} delay={0.15}>
              for <span style={{ color: "var(--brand-accent)" }}>demos.</span>
            </ClipLine>
          </h2>

          <motion.p
            className="text-base leading-relaxed mb-8 max-w-sm"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 14 }}
            transition={{ delay: 0.3, duration: 0.7, ease: SOFT }}
          >
            48 hours. Real enterprise problems from Apple and partners.
            Real engineers judging.{" "}
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              Winners get fast-tracked into product.
            </span>
          </motion.p>

          <div className="flex gap-6">
            {[
              { val: "48h", label: "Build sprint" },
              { val: "20+", label: "Teams" },
              { val: "$18K", label: "Prizes" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: SOFT }}
              >
                <div className="font-display font-bold text-xl mb-0.5" style={{ color: "var(--brand-accent)", letterSpacing: "-0.03em" }}>{s.val}</div>
                <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: pillar cards */}
        <div className="flex flex-col gap-3">
          {PILLARS.map(({ Icon, title, body, accent }, i) => (
            <motion.div
              key={title}
              className="flex items-start gap-4 p-5 rounded-2xl cursor-default"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 20 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.65, ease: SOFT }}
              whileHover={{ borderColor: accent + "55", boxShadow: `0 0 28px ${accent}18`, x: 4 }}
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                style={{ background: accent + "18", color: accent, border: `1px solid ${accent}33` }}>
                <Icon />
              </div>
              <div>
                <div className="font-display font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute right-6 bottom-4 font-display font-bold pointer-events-none select-none hidden lg:block"
        style={{ fontSize: "clamp(10rem, 22vw, 20rem)", lineHeight: 1, color: "var(--bg-surface)", letterSpacing: "-0.06em" }}>
        01
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PANEL 2 — By the numbers
══════════════════════════════════════════════════════════════ */
function Panel2() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!inView) return;
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: STATS[i].bar, duration: 1.3,
        delay: 0.2 + i * 0.1, ease: "power3.out",
      });
    });
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 flex flex-col justify-center px-10 md:px-16 lg:px-24 py-20"
      style={{ width: "100vw", minHeight: "100vh", borderRight: "1px solid var(--border-color)" }}
    >
      <motion.div
        className="flex items-center gap-3 mb-10"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
        transition={{ duration: 0.6, ease: SOFT }}
      >
        <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>02</span>
        <span className="w-10 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>By the numbers</span>
      </motion.div>

      <div className="max-w-5xl">
        <h2 className="font-display font-bold mb-3"
          style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
          <ClipLine inView={inView} delay={0.05}>The scale of</ClipLine>
          <ClipLine inView={inView} delay={0.15}>
            <span style={{ color: "var(--brand-accent)" }}>the challenge.</span>
          </ClipLine>
        </h2>

        <motion.p className="text-sm mb-12 max-w-xs" style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Real numbers. Honest scope. Not a toy hackathon.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px"
          style={{ border: "1px solid var(--border-color)", borderRadius: "1.25rem", overflow: "hidden" }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              className="flex flex-col justify-between p-6"
              style={{ background: "var(--bg-surface)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: SOFT }}
            >
              <div className="font-display font-bold mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--brand-accent)", lineHeight: 1 }}>
                {s.special ? s.special : <Counter to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />}
              </div>
              <div>
                <div className="relative h-px w-full mb-2.5" style={{ background: "var(--border-color)" }}>
                  <div ref={(el) => { barsRef.current[i] = el; }}
                    className="absolute inset-y-0 left-0 origin-left"
                    style={{ background: "linear-gradient(90deg, var(--brand-accent), #33AAFF)", boxShadow: "0 0 6px var(--accent-glow)", transform: "scaleX(0)" }} />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute right-6 bottom-4 font-display font-bold pointer-events-none select-none hidden lg:block"
        style={{ fontSize: "clamp(10rem, 22vw, 20rem)", lineHeight: 1, color: "var(--bg-surface)", letterSpacing: "-0.06em" }}>
        02
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PANEL 3 — What happens next
══════════════════════════════════════════════════════════════ */
function Panel3() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 flex flex-col justify-center px-10 md:px-16 lg:px-24 py-20"
      style={{ width: "100vw", minHeight: "100vh" }}
    >
      <motion.div
        className="flex items-center gap-3 mb-10"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -16 }}
        transition={{ duration: 0.6, ease: SOFT }}
      >
        <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>03</span>
        <span className="w-10 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>What happens next</span>
      </motion.div>

      <div className="max-w-5xl w-full">
        <h2 className="font-display font-bold mb-3"
          style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
          <ClipLine inView={inView} delay={0.05}>Five weeks.</ClipLine>
          <ClipLine inView={inView} delay={0.15}>
            <span style={{ color: "var(--brand-accent)" }}>Everything changes.</span>
          </ClipLine>
        </h2>

        <motion.p className="text-sm mb-10 max-w-xs" style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          Every step is intentional. No filler, no busywork.
        </motion.p>

        <div className="flex flex-col" style={{ borderTop: "1px solid var(--border-color)" }}>
          {PROCESS.map((p, i) => {
            const isLast = i === PROCESS.length - 1;
            return (
              <motion.div key={p.step}
                className="grid items-center gap-6 py-5 cursor-default"
                style={{ gridTemplateColumns: "3.5rem 1fr auto", borderBottom: "1px solid var(--border-color)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.65, ease: SOFT }}
                whileHover={{ x: 6 }}
              >
                <span className="font-display font-bold"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.04em",
                    color: isLast ? "var(--brand-accent)" : "var(--text-muted)", lineHeight: 1 }}>
                  {p.step}
                </span>
                <div>
                  <div className="font-display font-semibold mb-0.5"
                    style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {p.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.detail}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span style={{ color: "var(--text-muted)" }}><IconClock /></span>
                  <span className="text-[10px] font-mono tracking-widest uppercase whitespace-nowrap"
                    style={{ color: isLast ? "var(--brand-accent)" : "var(--text-muted)" }}>
                    {p.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="flex items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
          transition={{ delay: 0.6, duration: 0.6, ease: SOFT }}>
          <motion.a href="#register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
            style={{ background: "var(--brand-accent)", color: "#fff", boxShadow: "0 0 28px var(--accent-glow)" }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 48px var(--accent-glow)" }}
            whileTap={{ scale: 0.97 }} data-cursor-hover>
            Register at step 01
            <IconArrow />
          </motion.a>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Registration closes Nov 1</span>
        </motion.div>
      </div>

      <div className="absolute right-6 bottom-4 font-display font-bold pointer-events-none select-none hidden lg:block"
        style={{ fontSize: "clamp(10rem, 22vw, 20rem)", lineHeight: 1, color: "var(--bg-surface)", letterSpacing: "-0.06em" }}>
        03
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION SHELL
══════════════════════════════════════════════════════════════ */
export default function OverviewSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stRef        = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const isMobile = () => window.innerWidth < 768;
    if (isMobile()) return;

    const init = () => {
      const section   = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;
      stRef.current?.kill();

      const scrollDist = window.innerWidth * 2;
      gsap.set(container, { x: 0 });

      stRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${scrollDist}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(container, { x: -scrollDist * self.progress }),
        onRefresh: () => gsap.set(container, { x: 0 }),
      });
    };

    const t = setTimeout(() => { init(); ScrollTrigger.refresh(); }, 120);
    const onResize = () => { if (isMobile()) { stRef.current?.kill(); return; } init(); };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      stRef.current?.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} id="overview" className="overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div ref={containerRef} className="flex will-change-transform" style={{ width: "300vw" }}>
        <Panel1 />
        <Panel2 />
        <Panel3 />
      </div>
    </section>
  );
}
