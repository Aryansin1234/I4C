"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────
type Phase = "scatter" | "line" | "circle" | "arc";

interface TechItem {
  label: string;
  category: string;
  color: string;
  icon: React.ReactNode;
}

// ─── Tech icon set ───────────────────────────────────────────
const TECHS: TechItem[] = [
  {
    label: "React", category: "Frontend", color: "#61DAFB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TypeScript", category: "Language", color: "#3178C6",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
        <path d="M9 13v-1.5h6V13h-2v5H11v-5H9z" fill="white" />
        <path d="M15.5 14.5c0-.8.6-1.5 1.5-1.5s1.5.7 1.5 1.5v3c0 .3-.2.5-.5.5H16c-.8 0-1.5-.7-1.5-1.5v-.5h1.5v.5h1V15h-1v-.5z" fill="white" />
      </svg>
    ),
  },
  {
    label: "Python", category: "Language", color: "#3776AB",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.5 2 8 3 8 5v2h4v1H6C4 8 2 9.5 2 12s1.5 4 4 4h1v-2H6c-1 0-2-.9-2-2s1-2 2-2h8c2 0 4-1.5 4-4V5c0-2-1.5-3-4-3zm-1 2.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
        <path d="M12 22c2.5 0 4-1 4-3v-2h-4v-1h6c2 0 4-1.5 4-4s-1.5-4-4-4h-1v2h1c1 0 2 .9 2 2s-1 2-2 2H10c-2 0-4 1.5-4 4v3c0 2 1.5 3 4 3zm1-2.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
      </svg>
    ),
  },
  {
    label: "Swift", category: "Mobile", color: "#FA7343",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 14.2c.1-.4.2-.8.2-1.2 0-3.3-2.7-6-6-6-1 0-1.9.3-2.8.7C10.3 6.1 8.3 5 6 5 3.8 5 2 6.8 2 9c0 1 .4 2 1 2.7-.1.4-.1.8-.1 1.3 0 4.4 3.6 8 8 8 3.5 0 6.5-2.2 7.7-5.3l1.9-1.5c.2-.1.3-.4.2-.6l-.2.6z" />
        <path d="M12 17c-2.8 0-5-2.2-5-5 0-.5.1-1 .2-1.5C8.5 11 10.2 11.5 12 11.5c2.5 0 4.5-1 6-2.5.3.7.5 1.3.5 2 0 3.3-2.7 6-6 6z" fill="white" opacity=".4" />
      </svg>
    ),
  },
  {
    label: "Kubernetes", category: "Cloud", color: "#326CE5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8 22 16 12 22 2 16 2 8" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="22" />
        <line x1="22" y1="8" x2="15.6" y2="11.5" />
        <line x1="8.4" y1="12.5" x2="2" y2="16" />
        <line x1="22" y1="16" x2="15.6" y2="12.5" />
        <line x1="8.4" y1="11.5" x2="2" y2="8" />
      </svg>
    ),
  },
  {
    label: "GraphQL", category: "API", color: "#E10098",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
        <circle cx="12" cy="2"  r="1.5" fill="currentColor" stroke="none" />
        <circle cx="21" cy="7"  r="1.5" fill="currentColor" stroke="none" />
        <circle cx="21" cy="17" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="22" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3"  cy="17" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3"  cy="7"  r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="2"   fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Docker", category: "DevOps", color: "#2496ED",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 11.5c-.3-2-1.9-2.9-2.6-3.1-.6-.1-1.2.1-1.5.3-.2-1.5-1.4-2.3-1.9-2.6l-.4-.2-.3.3c-.3.4-.4 1.2-.4 1.7.1.5.3.9.6 1.2-.6.3-1.2.3-1.3.3H2.5c-.3 1.5.1 3.8 1.4 5.3.9 1.1 2.1 1.6 3.8 1.6 3.3 0 5.7-1.5 7-4.2.7 0 2-.1 2.7-1.3l.1-.3zM6 11H4V9h2v2zm3 0H7V9h2v2zm3 0h-2V9h2v2zm3 0h-2V9h2v2zm-9-3H4V6h2v2zm3 0H7V6h2v2zm3 0h-2V6h2v2z" />
      </svg>
    ),
  },
  {
    label: "TensorFlow", category: "AI/ML", color: "#FF6F00",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.4l7.2 3.6-7.2 3.6L4.8 8 12 4.4zM3.5 9.4l8 4v7.5L3.5 17V9.4zm9.5 11.5V13l8-4v7.5l-8 4z" opacity=".85" />
      </svg>
    ),
  },
  {
    label: "Next.js", category: "Frontend", color: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="M7 9h2v6H7V9zm3 0h2l4 4.5V9h2v6h-2l-4-4.5V15h-2V9z" fill="#000" />
      </svg>
    ),
  },
  {
    label: "Rust", category: "Language", color: "#CE422B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="22" />
        <line x1="2" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="22" y2="12" />
        <circle cx="12" cy="2"  r="1.2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="22" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="2"  cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="22" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Go", category: "Language", color: "#00ACD7",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.2 12c0-2.7 1.6-5.1 4-6.3L7 7.5C5.4 8.3 4.5 9.9 4.5 12c0 2.1.9 3.7 2.5 4.5l-.8 1.8C4 17.1 2.2 14.7 2.2 12zM12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm3.5-8h-7v2h5c-.3 1.2-1.4 2-2.5 2-1.7 0-3-1.3-3-3s1.3-3 3-3c.8 0 1.5.3 2 .8l1.5-1.5C13.5 6.5 12.8 6 12 6c-2.2 0-4 1.8-4 4s1.8 4 4 4c2.2 0 4-1.8 4-4v-1h-.5z" />
      </svg>
    ),
  },
  {
    label: "PostgreSQL", category: "Database", color: "#336791",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
        <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </svg>
    ),
  },
  {
    label: "AWS", category: "Cloud", color: "#FF9900",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 13.5c-1.7 0-3-1.3-3-3V8c0-1.7 1.3-3 3-3h10c1.7 0 3 1.3 3 3v2.5c0 1.7-1.3 3-3 3H7zm5 2l-4 3h8l-4-3z" opacity=".85" />
        <path d="M6 9h12M6 11h12" stroke="white" strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: "Redis", category: "Database", color: "#DC382D",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <ellipse cx="12" cy="8" rx="9" ry="3.5" />
        <path d="M3 8v3c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5V8" />
        <path d="M3 11v3c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-3" />
      </svg>
    ),
  },
  {
    label: "Figma", category: "Design", color: "#F24E1E",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 2h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8z" opacity=".9" />
        <path d="M8 10h4a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8z" opacity=".75" />
        <path d="M12 10a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" opacity=".6" />
        <path d="M8 18a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" opacity=".45" />
      </svg>
    ),
  },
  {
    label: "Terraform", category: "DevOps", color: "#7B42BC",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 5.5L2 9.5v8L9 21.5v-8L15 10v-2L9 5.5zM15 4v8l7-4V0l-7 4zM16 13.5v8L22 18v-8l-6 3.5z" opacity=".85" />
      </svg>
    ),
  },
  {
    label: "Kafka", category: "Data", color: "#231F20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <circle cx="4"  cy="16" r="2" />
        <circle cx="20" cy="16" r="2" />
        <line x1="12" y1="6"  x2="12" y2="11" />
        <line x1="12" y1="11" x2="4"  y2="14" />
        <line x1="12" y1="11" x2="20" y2="14" />
        <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "WASM", category: "Runtime", color: "#654FF0",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 8l2 8 3-5 3 5 2-8" />
      </svg>
    ),
  },
  {
    label: "LLM", category: "AI/ML", color: "#10A37F",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 1 1 0 18A9 9 0 0 1 12 2z" />
        <path d="M8 12h8M12 8l4 4-4 4" />
        <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "SwiftUI", category: "Mobile", color: "#FA7343",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 16s1-2 4-2 4 2 4 2" />
        <path d="M16 8s-3 3-7 1" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    ),
  },
];

const TOTAL   = TECHS.length; // 20
const CARD_W  = 64;
const CARD_H  = 80;
const MAX_SCROLL = 2800;

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

// ─── Card ─────────────────────────────────────────────────────
function TechCard({
  item, target,
}: {
  item: TechItem;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}) {
  return (
    <motion.div
      animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: "spring", stiffness: 38, damping: 14 }}
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        transformStyle: "preserve-3d",
        perspective: "800px",
        zIndex: 1,
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ rotateY: 180 }}
        transition={{ type: "spring", stiffness: 240, damping: 20, duration: 0.6 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-2xl"
          style={{
            backfaceVisibility: "hidden",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04) inset`,
          }}
        >
          <span style={{ color: item.color, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
          </span>
          <span style={{
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            lineHeight: 1,
          }}>
            {item.label}
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--bg-elevated)",
            border: `1px solid ${item.color}44`,
            boxShadow: `0 0 16px ${item.color}22`,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
          <span style={{
            fontSize: "7px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: item.color,
            lineHeight: 1,
          }}>
            {item.category}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function TechOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [phase, setPhase] = useState<Phase>("scatter");

  // Container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    obs.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => obs.disconnect();
  }, []);

  // Intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("line"),   400);
    const t2 = setTimeout(() => setPhase("circle"), 2000);
    const t3 = setTimeout(() => setPhase("arc"),    3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Virtual scroll (isolated — doesn't affect page)
  const vScroll   = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Only hijack when the element is in view and cursor is over it
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      e.stopPropagation(); // don't bubble — let page scroll normally
      const next = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = next;
      vScroll.set(next);
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [vScroll]);

  // Mouse parallax
  const mouseX     = useMotionValue(0);
  const smoothMX   = useSpring(mouseX,  { stiffness: 28, damping: 18 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseX.set(((e.clientX - r.left) / r.width * 2 - 1) * 60);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  // Morph: circle → arc (scroll 0→600)
  const morphProg  = useTransform(vScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProg, { stiffness: 38, damping: 18 });

  // Arc rotation (scroll 600→2800)
  const arcRot     = useTransform(vScroll, [600, 2800], [0, 280]);
  const smoothRot  = useSpring(arcRot, { stiffness: 38, damping: 18 });

  // Subscribe to derived values
  const [morph,    setMorph]    = useState(0);
  const [rotation, setRotation] = useState(0);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorph);
    const u2 = smoothRot.on("change",   setRotation);
    const u3 = smoothMX.on("change",    setParallax);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothRot, smoothMX]);

  // Scatter positions — deterministic, no Math.random at render time
  const scatter = useMemo(() => TECHS.map((_, i) => ({
    x:        (((i * 137) % 200) - 100) * 6,
    y:        (((i * 97)  % 200) - 100) * 4,
    rotation: ((i * 53)   % 360) - 180,
    scale: 0.5,
    opacity: 0,
  })), []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      {/* Faint radial glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 55%, var(--accent-subtle) 0%, transparent 70%)" }}
      />

      {/* Cards */}
      <div className="absolute inset-0 flex items-center justify-center">
        {TECHS.map((item, i) => {
          let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

          if (phase === "scatter") {
            target = scatter[i];

          } else if (phase === "line") {
            const spacing = 72;
            const totalW  = TOTAL * spacing;
            target = { x: i * spacing - totalW / 2, y: 0, rotation: 0, scale: 0.85, opacity: 1 };

          } else if (phase === "circle") {
            const r     = Math.min(size.w, size.h) * 0.36;
            const angle = (i / TOTAL) * 360;
            const rad   = (angle * Math.PI) / 180;
            target = {
              x: Math.cos(rad) * r,
              y: Math.sin(rad) * r,
              rotation: angle + 90,
              scale: 1,
              opacity: 1,
            };

          } else {
            // arc phase — morph circle→arc, then arc scrolls

            // Circle coords
            const r      = Math.min(size.w, size.h) * 0.36;
            const cAngle = (i / TOTAL) * 360;
            const cRad   = (cAngle * Math.PI) / 180;
            const circX  = Math.cos(cRad) * r;
            const circY  = Math.sin(cRad) * r;

            // Arc coords — bottom arc, convex upward
            const baseR    = Math.min(size.w, size.h * 1.6);
            const arcR     = baseR * 1.05;
            const apexY    = size.h * 0.20;
            const arcCY    = apexY + arcR;
            const spread   = 124;
            const startA   = -90 - spread / 2;
            const step     = spread / (TOTAL - 1);
            const bounded  = -(rotation / 280) * spread * 0.85;
            const arcAngle = startA + i * step + bounded;
            const arcRad2  = (arcAngle * Math.PI) / 180;
            const arcX     = Math.cos(arcRad2) * arcR + parallax * 0.5;
            const arcY     = Math.sin(arcRad2) * arcR + arcCY;
            const arcScale = 1.6;

            target = {
              x:        lerp(circX, arcX,     morph),
              y:        lerp(circY, arcY,     morph),
              rotation: lerp(cAngle + 90, arcAngle + 90, morph),
              scale:    lerp(1,     arcScale, morph),
              opacity:  1,
            };
          }

          return <TechCard key={item.label} item={item} target={target} />;
        })}
      </div>

      {/* Scroll hint — visible in arc phase before user scrolls */}
      {phase === "arc" && morph < 0.3 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-muted)" }}>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
          <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            scroll
          </span>
        </motion.div>
      )}
    </div>
  );
}
