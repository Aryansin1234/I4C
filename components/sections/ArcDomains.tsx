"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAnimationFrame } from "framer-motion";

// ─── Domain list ─────────────────────────────────────────────
const DOMAINS = [
  { label: "Agentic AI",        sub: "LLM · Agents · RAG" },
  { label: "DevOps",            sub: "CI/CD · GitOps · SRE" },
  { label: "Cloud",             sub: "AWS · Azure · GCP" },
  { label: "FDE",               sub: "Full-Stack · Edge · APIs" },
  { label: "Data Engineering",  sub: "Pipelines · Lakehouse · ETL" },
  { label: "Cybersecurity",     sub: "Zero-Trust · SecOps · IAM" },
  { label: "MLOps",             sub: "Training · Inference · Drift" },
  { label: "Platform Eng.",     sub: "IDP · Backstage · SDP" },
  { label: "Observability",     sub: "Tracing · Metrics · Logs" },
  { label: "FinTech",           sub: "Payments · Ledger · Fraud" },
  { label: "Edge Computing",    sub: "WASM · IoT · Serverless" },
  { label: "UI/UX Engineering", sub: "Design Systems · A11y" },
];

const TOTAL = DOMAINS.length;

// ─── Arc geometry ────────────────────────────────────────────
// Circle center sits to the RIGHT of the container.
// Arc = left edge of that circle → concave-right shape.
const ARC_RADIUS = 420;
const CX_FRAC    = 1.05;   // circle center x — pushed past right edge so arc shifts right
const CY_FRAC    = 0.50;   // circle center y as fraction of container height

// Angular gap between adjacent items (degrees)
const STEP_DEG = 13;
// Items within ±FADE_SLOTS of center are visible; beyond → fade out entirely
const FADE_SLOTS = 3.5;
// Rotation speed: degrees per second (positive = anticlockwise = items move upward)
const DEG_PER_SEC = 5.5;

function degToRad(d: number) { return (d * Math.PI) / 180; }

// Convert a continuous fractional slot offset to (x, y) on the arc.
// angleDeg 180° = pointing directly left (center of arc).
function slotToPt(slotF: number, w: number, h: number) {
  const cx  = w * CX_FRAC;
  const cy  = h * CY_FRAC;
  const deg = 180 + slotF * STEP_DEG;
  const rad = degToRad(deg);
  return {
    x: cx + Math.cos(rad) * ARC_RADIUS,
    y: cy + Math.sin(rad) * ARC_RADIUS,
  };
}

// ─── CSS tokens ──────────────────────────────────────────────
const TOKENS = `
  :root {
    --dot-hi:         #8ec4ff;
    --dot-core:       #1a6aff;
    --dot-dim:        rgba(55,105,225,0.28);
    --dot-glow:       rgba(30,120,255,0.68);
    --lbl-active:     #deeeff;
    --lbl-dim:        rgba(170,188,228,0.45);
    --lbl-glow:       rgba(30,120,255,0.65);
    --lbl-glow-wide:  rgba(30,120,255,0.22);
    --sub-col:        #5878c0;
    --arc-glow-bg:    rgba(25,110,255,0.09);
  }
  .light {
    --dot-hi:         #2b6eff;
    --dot-core:       #0050dd;
    --dot-dim:        rgba(0,75,210,0.20);
    --dot-glow:       rgba(0,75,210,0.52);
    --lbl-active:     #00195e;
    --lbl-dim:        rgba(20,45,115,0.42);
    --lbl-glow:       rgba(0,75,210,0.42);
    --lbl-glow-wide:  rgba(0,75,210,0.15);
    --sub-col:        #1a3d9e;
    --arc-glow-bg:    rgba(0,75,210,0.07);
  }
`;

// ─── Main ─────────────────────────────────────────────────────
export default function ArcDomains() {
  const containerRef              = useRef<HTMLDivElement>(null);
  const [size, setSize]           = useState({ w: 0, h: 0 });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Continuous fractional angle offset (in "slots").
  // Increases over time → items scroll upward (anticlockwise from viewer's POV).
  const angleRef   = useRef(0);          // raw float, updated every frame
  const pausedRef  = useRef(false);
  const [frame, setFrame] = useState(0); // triggers re-render each animation frame

  useEffect(() => {
    pausedRef.current = hoveredIdx !== null;
  }, [hoveredIdx]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => obs.disconnect();
  }, []);

  // Drive continuous rotation via rAF
  useAnimationFrame((_, delta) => {
    if (pausedRef.current) return;
    // delta is ms since last frame
    angleRef.current += (DEG_PER_SEC / STEP_DEG) * (delta / 1000);
    setFrame(f => f + 1); // force re-render
  });

  const handleHover = useCallback((i: number) => setHoveredIdx(i), []);
  const handleLeave = useCallback(() => setHoveredIdx(null), []);

  // Build visible items from continuous offset.
  // We show all TOTAL items but compute each one's fractional slot position.
  const items = DOMAINS.map((domain, i) => {
    // slot = how far from center this item is (float, wrapping)
    let slot = i - angleRef.current;
    // Wrap into range [-TOTAL/2, TOTAL/2]
    slot = ((slot % TOTAL) + TOTAL) % TOTAL;
    if (slot > TOTAL / 2) slot -= TOTAL;
    const { x, y } = slotToPt(slot, size.w, size.h);
    const absSlot   = Math.abs(slot);
    // Items beyond FADE_SLOTS are invisible
    const visible   = absSlot < FADE_SLOTS;
    // Opacity curve: 1 at center, fades toward edges
    const opacity   = visible
      ? Math.max(0, 1 - (absSlot / FADE_SLOTS) ** 1.4)
      : 0;
    const isCenter  = absSlot < 0.5;
    return { domain, i, slot, x, y, absSlot, visible, opacity, isCenter };
  });

  return (
    <>
      <style>{TOKENS}</style>
      <div ref={containerRef} className="relative w-full h-full" aria-hidden="true">
        {size.w > 0 && (
          <>
            {items.map(({ domain, i, slot, x, y, absSlot, visible, opacity, isCenter }) => {
              if (!visible) return null;
              const lit      = isCenter || hoveredIdx === i;
              const fontSize = 18 - absSlot * 0.9;
              const fw       = isCenter ? 700 : absSlot < 1.5 ? 600 : 500;
              const blur     = absSlot > 1.8 ? (absSlot - 1.8) * 1.2 : 0;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0, top: 0,
                    // We set x/y via style (not transform) so the browser composites cheaply
                    transform: `translate(${x}px, ${y}px)`,
                    pointerEvents: visible && absSlot < 3 ? "auto" : "none",
                  }}
                  onMouseEnter={() => handleHover(i)}
                  onMouseLeave={handleLeave}
                >
                  {/* Dot — centered on arc point */}
                  <div style={{
                    position: "absolute",
                    width:  lit ? 9 : Math.max(3, 5 - absSlot * 0.8),
                    height: lit ? 9 : Math.max(3, 5 - absSlot * 0.8),
                    borderRadius: "50%",
                    background: lit
                      ? "radial-gradient(circle, var(--dot-hi) 0%, var(--dot-core) 70%)"
                      : "var(--dot-dim)",
                    boxShadow: lit ? "0 0 10px 3px var(--dot-glow)" : "none",
                    transform: "translate(-50%, -50%)",
                    opacity,
                    transition: "width 0.3s, height 0.3s, box-shadow 0.3s",
                  }} />

                  {/* Label — extends leftward from dot */}
                  <div style={{
                    position: "absolute",
                    right: "calc(100% + 12px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    textAlign: "right",
                    lineHeight: 1.15,
                    opacity: hoveredIdx === i && !isCenter ? Math.min(opacity + 0.35, 1) : opacity,
                    filter: blur > 0 ? `blur(${blur}px)` : "none",
                    transition: "opacity 0.3s, filter 0.3s",
                    pointerEvents: "none",
                    cursor: "default",
                  }}>
                    <div style={{
                      fontSize,
                      fontWeight: fw,
                      letterSpacing: "0.025em",
                      whiteSpace: "nowrap",
                      color: lit ? "var(--lbl-active)" : "var(--lbl-dim)",
                      textShadow: lit
                        ? "0 0 18px var(--lbl-glow), 0 0 36px var(--lbl-glow-wide)"
                        : "none",
                      transition: "color 0.3s, text-shadow 0.3s, font-size 0.3s",
                    }}>
                      {domain.label}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: "var(--sub-col)",
                      letterSpacing: "0.09em",
                      marginTop: 2,
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      opacity: isCenter ? 0.8 : hoveredIdx === i ? 0.6 : 0,
                      transition: "opacity 0.25s",
                    }}>
                      {domain.sub}
                    </div>
                  </div>

                  {/* Center highlight backdrop */}
                  {isCenter && (
                    <div style={{
                      position: "absolute",
                      inset: "-14px -4px -14px -240px",
                      background:
                        "radial-gradient(ellipse 80% 70% at 95% 50%, var(--arc-glow-bg) 0%, transparent 70%)",
                      borderRadius: 12,
                      pointerEvents: "none",
                      opacity,
                    }} />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
