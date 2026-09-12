"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const TIERS = [
  {
    rank: "02",
    place: "Second",
    amount: 5000,
    label: "Runner-up",
    desc: "2nd place team",
    order: 1,   // visual order on desktop (left)
    size: "md",
  },
  {
    rank: "01",
    place: "First",
    amount: 10000,
    label: "Winner",
    desc: "Best overall solution",
    order: 0,   // center — tallest
    size: "lg",
    highlight: true,
  },
  {
    rank: "03",
    place: "Third",
    amount: 2500,
    label: "Third Place",
    desc: "3rd place team",
    order: 2,   // right
    size: "sm",
  },
] as const;

const SPECIALS = [
  { label: "Best UX",         amount: 500, icon: "✦" },
  { label: "Best Demo",       amount: 500, icon: "◈" },
  { label: "Most Innovative", amount: 500, icon: "◇" },
];

/* ─── Premium counter — scramble → resolve with blur ────────── */
function Counter({ to, trigger, delay = 0 }: { to: number; trigger: boolean; delay?: number }) {
  const [display, setDisplay] = useState("—");
  const [blurred, setBlurred] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!trigger) {
      setDisplay("—");
      setBlurred(false);
      return;
    }

    // Start after delay
    timerRef.current = setTimeout(() => {
      setBlurred(true);
      let frame = 0;
      const totalFrames = 28;
      const scramble = () => {
        frame++;
        const progress = frame / totalFrames;
        const eased = Math.pow(progress, 2);
        const resolved = Math.floor(eased * to);

        if (progress < 0.65) {
          // Scramble phase: show random number near target
          const noise = Math.floor(Math.random() * to * 0.8);
          setDisplay(`$${noise >= 1000 ? `${Math.floor(noise / 1000)}K` : noise}`);
        } else {
          // Resolve phase: count up cleanly
          const v = Math.floor(eased * to);
          setDisplay(`$${v >= 1000 ? `${Math.floor(v / 1000)}K` : v}`);
          if (progress > 0.85) setBlurred(false);
        }

        if (frame < totalFrames) {
          requestAnimationFrame(scramble);
        } else {
          setDisplay(`$${to >= 1000 ? `${Math.floor(to / 1000)}K` : to}`);
          setBlurred(false);
        }
      };
      requestAnimationFrame(scramble);
    }, delay * 1000);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [trigger, to, delay]);

  return (
    <motion.span
      className="tabular-nums inline-block"
      animate={{ filter: blurred ? "blur(4px)" : "blur(0px)" }}
      transition={{ duration: 0.15 }}
    >
      {display}
    </motion.span>
  );
}

/* ─── Tier card ──────────────────────────────────────────────── */
function TierCard({ t, inView, i }: { t: typeof TIERS[number]; inView: boolean; i: number }) {
  const isWinner = t.rank === "01";
  const [hov, setHov] = useState(false);

  // Heights: winner is tallest
  const heights = { lg: "340px", md: "290px", sm: "260px" };
  const h = heights[t.size as keyof typeof heights];

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ flex: isWinner ? "0 0 38%" : "0 0 28%", alignSelf: "flex-end" }}
      // Entry: winner rises from furthest below, sides from less far
      // Exit: sides drop first, winner last (reversed stagger)
      initial={{ opacity: 0, y: isWinner ? 80 : 50, scale: 0.9 }}
      animate={inView
        ? { opacity: 1,  y: 0,  scale: 1   }
        : { opacity: 0,  y: isWinner ? 80 : 50, scale: 0.9 }
      }
      transition={{
        delay:    inView ? (isWinner ? 0.22 : i === 0 ? 0.08 : 0.38) : (isWinner ? 0.18 : i === 0 ? 0.28 : 0.05),
        duration: inView ? 0.85 : 0.55,
        ease:     inView ? SOFT : EXPO,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden flex flex-col justify-between"
        style={{
          height: h,
          background: isWinner ? "var(--bg-elevated)" : "var(--bg-surface)",
          border: `1px solid ${isWinner ? "var(--border-accent)" : "var(--border-color)"}`,
        }}
        animate={{
          y: hov ? -6 : 0,
          boxShadow: hov
            ? isWinner
              ? "0 24px 64px rgba(0,102,255,0.22), 0 0 0 1px var(--border-accent)"
              : "0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px var(--border-accent)"
            : isWinner
              ? "0 8px 40px rgba(0,102,255,0.14)"
              : "0 2px 12px rgba(0,0,0,0.12)",
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Winner ambient glow */}
        {isWinner && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(0,102,255,0.12) 0%, transparent 65%)",
            }}
          />
        )}

        {/* Watermark rank number */}
        <span
          className="absolute right-3 bottom-2 font-display font-bold select-none pointer-events-none leading-none"
          style={{
            fontSize: isWinner ? "9rem" : "7rem",
            letterSpacing: "-0.08em",
            color: isWinner ? "rgba(0,102,255,0.07)" : "var(--bg-elevated)",
            zIndex: 0,
          }}
        >
          {t.rank}
        </span>

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full">

          {/* Top: place label + badge */}
          <div className="flex items-start justify-between mb-auto">
            <div>
              <span
                className="text-[9px] font-mono tracking-[0.26em] uppercase block mb-1"
                style={{ color: isWinner ? "var(--brand-accent)" : "var(--text-muted)" }}
              >
                {t.place}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {t.desc}
              </span>
            </div>

            {isWinner && (
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--brand-accent)",
                  boxShadow: "0 0 16px var(--accent-glow)",
                }}
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#fff" }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </motion.div>
            )}
          </div>

          {/* Big amount */}
          <div
            className="font-display font-bold leading-none my-4"
            style={{
              fontSize: isWinner ? "clamp(2.8rem, 5vw, 4.5rem)" : "clamp(2rem, 3.8vw, 3.2rem)",
              letterSpacing: "-0.05em",
              color: isWinner ? "var(--brand-accent)" : "var(--text-primary)",
              filter: isWinner ? "drop-shadow(0 0 20px var(--accent-glow))" : "none",
            }}
          >
            <Counter
              to={t.amount}
              trigger={inView}
              delay={isWinner ? 0.55 : i === 0 ? 0.38 : 0.72}
            />
          </div>

          {/* Label */}
          <span
            className="text-[10px] font-mono tracking-[0.22em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            {t.label} · cash prize
          </span>

          {/* Winner bottom accent line */}
          {isWinner && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: "linear-gradient(90deg, var(--brand-accent), transparent)",
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: inView ? 1 : 0 }}
              transition={{ delay: 0.6, duration: 1.0, ease: EXPO }}
            />
          )}
        </div>
      </motion.div>

      {/* Podium base */}
      <motion.div
        className="h-3 rounded-b-xl mx-2"
        style={{
          background: isWinner
            ? "linear-gradient(180deg, var(--border-accent), transparent)"
            : "var(--border-color)",
          opacity: 0.5,
        }}
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: inView ? 1 : 0 }}
        transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
      />
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────── */
export default function PrizesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: false, amount: 0.2 });
  const headerView = useInView(headerRef,  { once: false, amount: 0.4 });

  // Sort visually: 2nd, 1st, 3rd (podium order)
  const podiumOrder = [TIERS[1], TIERS[0], TIERS[2]]; // second, first, third

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="py-28 lg:py-36 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: headerView ? 1 : 0, x: headerView ? 0 : -16 }}
            transition={{ duration: 0.6, ease: SOFT }}
          >
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>
              Prizes
            </span>
            <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>
              $18,500 total pool
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
                animate={{ y: headerView ? "0%" : "105%" }}
                transition={{ delay: 0.1, duration: 0.9, ease: SOFT }}
              >
                Win big.{" "}
                <span style={{ color: "var(--brand-accent)" }}>Ship real.</span>
              </motion.h2>
            </div>

            <motion.p
              className="hidden lg:block text-sm leading-relaxed max-w-xs text-right flex-shrink-0 mb-1"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: headerView ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Cash prizes for the top three teams, plus special category awards.
            </motion.p>
          </div>
        </div>

        {/* Podium — 2nd | 1st | 3rd */}
        <div className="flex items-end justify-center gap-4 mb-16">
          {podiumOrder.map((t, i) => (
            <TierCard key={t.rank} t={t} inView={inView} i={i} />
          ))}
        </div>

        {/* Special awards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
          transition={{ delay: 0.55, duration: 0.6, ease: SOFT }}
        >
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: "var(--text-muted)" }}>
              Special awards
            </span>
            <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {SPECIALS.map((s, i) => (
              <motion.div
                key={s.label}
                className="relative flex items-center gap-4 px-6 py-4 rounded-2xl overflow-hidden cursor-default"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  minWidth: "200px",
                }}
                whileHover={{
                  borderColor: "var(--border-accent)",
                  y: -3,
                  boxShadow: "0 12px 32px rgba(0,102,255,0.12)",
                }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.92 }}
              >
                {/* Icon */}
                <span
                  className="text-lg flex-shrink-0"
                  style={{ color: "var(--brand-accent)" }}
                >
                  {s.icon}
                </span>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                    Special award
                  </span>
                </div>

                <div className="ml-auto flex-shrink-0 pl-4" style={{ borderLeft: "1px solid var(--border-color)" }}>
                  <span
                    className="font-display font-bold"
                    style={{ fontSize: "1.2rem", letterSpacing: "-0.04em", color: "var(--brand-accent)" }}
                  >
                    ${s.amount.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
