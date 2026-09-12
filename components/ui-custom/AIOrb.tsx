"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Section palette ────────────────────────────────────────── */
const SECTIONS: Record<string, { r: number; g: number; b: number; label: string }> = {
  hero:      { r:  0, g: 102, b: 255, label: "Hello"      },
  overview:  { r:  0, g: 170, b: 255, label: "Exploring"  },
  timeline:  { r:  0, g: 204, b: 102, label: "Planning"   },
  problems:  { r: 255, g: 140, b:  0, label: "Thinking"   },
  partners:  { r: 170, g:  68, b: 255, label: "Connecting" },
  criteria:  { r: 255, g:  68, b: 136, label: "Evaluating" },
  prizes:    { r: 255, g: 204, b:  0, label: "Winning"    },
  learnings: { r:  0, g: 220, b: 170, label: "Growing"    },
  register:  { r:  0, g: 102, b: 255, label: "Ready?"     },
  footer:    { r:  85, g:  85, b: 119, label: "See you"   },
};

const SECTION_IDS = Object.keys(SECTIONS);

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

export default function AIOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const st = useRef({
    // Physics
    sx: -300, sy: -300,   // spring pos
    vx: 0,    vy: 0,      // velocity
    mx: -300, my: -300,   // mouse target
    // Color — smooth interpolation
    cr: 0,   cg: 102, cb: 255,     // current rgb (animated)
    tr: 0,   tg: 102, tb: 255,     // target rgb
    // State
    visible: false,
    hovering: false,
    clicking: false,
    idleTimer: 0,
    idle: false,
    idleAngle: 0,
    idleCx: 0, idleCy: 0,
    // Visual
    pulse: 0,       pulseV: 0.018,
    orbitAngle: 0,
    stretchX: 1,    stretchY: 1,
    // Trail
    trail: [] as Array<{ x: number; y: number }>,
    // Flash on click
    flashR: 0, flashing: false,
    // Label
    label: "Hello",
    labelAlpha: 0,
  });

  /* ── Section observer ── */
  const onSection = useCallback((id: string) => {
    const s = SECTIONS[id];
    if (!s) return;
    const c = st.current;
    c.tr = s.r; c.tg = s.g; c.tb = s.b;
    c.label = s.label;
    c.labelAlpha = 1;
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true); return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) onSection(e.target.id); }),
      { threshold: 0.3 }
    );
    SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [onSection]);

  /* ── Canvas loop ── */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const c = st.current;
    let raf: number;

    /* Mouse */
    const onMove = (e: MouseEvent) => {
      c.mx = e.clientX; c.my = e.clientY;
      c.idle = false; c.idleTimer = 0;
      if (!c.visible) { c.visible = true; c.sx = e.clientX - 30; c.sy = e.clientY - 30; }
    };
    const onDown = () => { c.clicking = true;  c.flashing = true; c.flashR = 0; };
    const onUp   = () => { c.clicking = false; };
    const onHoverIn  = () => { c.hovering = true;  };
    const onHoverOut = () => { c.hovering = false; };

    const attachHovers = () => {
      document.querySelectorAll("a,button,[data-cursor-hover]").forEach(el => {
        el.addEventListener("mouseenter", onHoverIn);
        el.addEventListener("mouseleave", onHoverOut);
      });
    };
    attachHovers();
    const mo = new MutationObserver(attachHovers);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    /* ── Tick ── */
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!c.visible) { raf = requestAnimationFrame(tick); return; }

      /* ── Color lerp — smooth 2.5% per frame ── */
      c.cr += (c.tr - c.cr) * 0.025;
      c.cg += (c.tg - c.cg) * 0.025;
      c.cb += (c.tb - c.cb) * 0.025;
      const R = Math.round(c.cr), G = Math.round(c.cg), B = Math.round(c.cb);

      /* ── Idle detection ── */
      c.idleTimer++;
      if (c.idleTimer > 180 && !c.idle) {
        c.idle = true;
        c.idleCx = c.sx; c.idleCy = c.sy; c.idleAngle = 0;
      }

      /* ── Target pos ── */
      let tx: number, ty: number;
      if (c.idle) {
        c.idleAngle += 0.006;
        const dr = 70;
        tx = c.idleCx + Math.sin(c.idleAngle)       * dr;
        ty = c.idleCy + Math.sin(c.idleAngle * 2)   * dr * 0.45;
      } else {
        // Sit top-left of cursor with a natural offset
        tx = c.mx - 32;
        ty = c.my - 32;
      }
      if (c.hovering) { tx -= 6; ty -= 10; }

      /* ── Spring — smooth + natural ──
         stiffness 0.055 = slow/smooth, damping 0.80 = well-settled */
      const STIFF = 0.055;
      const DAMP  = 0.80;
      c.vx = c.vx * DAMP + (tx - c.sx) * STIFF;
      c.vy = c.vy * DAMP + (ty - c.sy) * STIFF;
      c.sx += c.vx;
      c.sy += c.vy;

      /* ── Stretch in direction of travel ── */
      const speed = Math.hypot(c.vx, c.vy);
      const sa = Math.min(speed * 0.035, 0.32);
      const ang = Math.atan2(c.vy, c.vx);
      c.stretchX += (1 + sa       - c.stretchX) * 0.18;
      c.stretchY += (1 - sa * 0.5 - c.stretchY) * 0.18;

      /* ── Pulse (breathing) ── */
      c.pulse += c.pulseV;
      if (c.pulse > 1 || c.pulse < 0) c.pulseV *= -1;
      const orbR = 10 + c.pulse * 2.2 + (c.hovering ? 2 : 0) + (c.clicking ? -2 : 0);

      /* ── Orbit ── */
      c.orbitAngle += c.hovering ? 0.07 : 0.025;

      /* ── Label fade-out ── */
      if (c.labelAlpha > 0) c.labelAlpha = Math.max(0, c.labelAlpha - 0.006);

      /* ── Flash ── */
      if (c.flashing) {
        c.flashR += 2.8;
        if (c.flashR > 50) c.flashing = false;
      }

      /* ── Trail ── */
      c.trail.push({ x: c.sx, y: c.sy });
      if (c.trail.length > 20) c.trail.shift();

      /* ── DRAW ── */

      // Trail — tapered, fade with position
      c.trail.forEach((p, i) => {
        const pct = i / c.trail.length;
        const tA  = pct * 0.14;
        const tR  = pct * 4.5;
        if (tA < 0.005 || tR < 0.5) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, tR, 0, Math.PI * 2);
        ctx.fillStyle = rgba(R, G, B, tA);
        ctx.fill();
      });

      // Click flash ring
      if (c.flashing) {
        const fA = Math.max(0, 0.45 * (1 - c.flashR / 50));
        ctx.beginPath();
        ctx.arc(c.sx, c.sy, c.flashR, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(R, G, B, fA);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Orbit dots — 3 dots, unequal sizes for asymmetry
      [0, 1, 2].forEach((d) => {
        const a   = c.orbitAngle + (d / 3) * Math.PI * 2;
        const or  = orbR + 9;
        const ox  = c.sx + Math.cos(a) * or;
        const oy  = c.sy + Math.sin(a) * or;
        const dr  = d === 0 ? 2.0 : d === 1 ? 1.3 : 0.9;
        const da  = d === 0 ? 0.85 : d === 1 ? 0.45 : 0.25;
        ctx.beginPath();
        ctx.arc(ox, oy, dr, 0, Math.PI * 2);
        ctx.fillStyle = rgba(R, G, B, da);
        ctx.fill();
      });

      // Outer glow
      const og = ctx.createRadialGradient(c.sx, c.sy, 0, c.sx, c.sy, orbR * 3.2);
      og.addColorStop(0,   rgba(R, G, B, 0.14));
      og.addColorStop(0.4, rgba(R, G, B, 0.06));
      og.addColorStop(1,   rgba(R, G, B, 0));
      ctx.beginPath();
      ctx.arc(c.sx, c.sy, orbR * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = og;
      ctx.fill();

      // Core — stretch transform
      ctx.save();
      ctx.translate(c.sx, c.sy);
      ctx.rotate(ang);
      ctx.scale(c.stretchX, c.stretchY);
      ctx.rotate(-ang);

      // Core glow
      const cg2 = ctx.createRadialGradient(0, 0, 0, 0, 0, orbR * 1.8);
      cg2.addColorStop(0,   rgba(R, G, B, 0.55));
      cg2.addColorStop(1,   rgba(R, G, B, 0));
      ctx.beginPath();
      ctx.arc(0, 0, orbR * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = cg2;
      ctx.fill();

      // Sphere
      const baseAlpha = c.clicking ? 0.75 : c.hovering ? 1.0 : 0.88;
      const sg = ctx.createRadialGradient(
        -orbR * 0.3, -orbR * 0.32, 0,
         0, 0, orbR
      );
      sg.addColorStop(0,    `rgba(255,255,255,${baseAlpha * 0.95})`);
      sg.addColorStop(0.3,   rgba(R, G, B, baseAlpha));
      sg.addColorStop(1,     rgba(Math.max(0,R-30), Math.max(0,G-20), Math.max(0,B-20), baseAlpha * 0.7));
      ctx.beginPath();
      ctx.arc(0, 0, orbR, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

      // Specular
      ctx.beginPath();
      ctx.arc(-orbR * 0.3, -orbR * 0.3, orbR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${baseAlpha * 0.6})`;
      ctx.fill();

      ctx.restore();

      /* ── Label — theme-aware, larger, crisp ── */
      if (c.labelAlpha > 0.02) {
        const isDark = document.documentElement.classList.contains("dark");
        const lx = c.sx + orbR + 14;
        const ly = c.sy + 5; // vertically centered on orb

        ctx.save();
        ctx.font = `800 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`;

        const text = c.label.toUpperCase();

        if (isDark) {
          // Dark theme — white text with colored glow
          ctx.shadowColor = rgba(R, G, B, c.labelAlpha * 0.9);
          ctx.shadowBlur  = 10;
          ctx.fillStyle   = `rgba(255,255,255,${c.labelAlpha})`;
          ctx.fillText(text, lx, ly);
          // Second pass: colored tint on top
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = rgba(R, G, B, c.labelAlpha * 0.55);
          ctx.fillText(text, lx, ly);
        } else {
          // Light theme — black text, no transparency, strong contrast
          ctx.shadowColor = rgba(R, G, B, c.labelAlpha * 0.5);
          ctx.shadowBlur  = 6;
          ctx.fillStyle   = `rgba(0,0,0,${c.labelAlpha})`;
          ctx.fillText(text, lx, ly);
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = `rgba(0,0,0,${c.labelAlpha})`;
          ctx.fillText(text, lx, ly);
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      mo.disconnect();
    };
  }, []);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden
    />
  );
}
