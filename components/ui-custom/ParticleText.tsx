"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  // home position (letter pixel)
  hx: number; hy: number;
  // current position
  x: number;  y: number;
  // velocity
  vx: number; vy: number;
  // visual
  size: number;
  opacity: number;
  // color components
  r: number; g: number; b: number;
  // burst angle for disassembly
  burstAngle: number;
  burstSpeed: number;
}

const FONT_SIZE  = 180;
const SAMPLE_GAP = 3;
const FRICTION   = 0.82;
const RETURN_F   = 0.08;   // gentle spring back
const EXPLODE_F  = 4;      // subtle push — not violent
const EXPLODE_R  = 120;    // smaller influence radius
const MAX_DISP   = 40;     // clamp max displacement so particles don't fly off

export default function ParticleText() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef     = useRef<{
    particles: Particle[];
    assembled: boolean;
    mx: number; my: number;
    hovering: boolean;
    raf: number;
    burstProgress: number; // 0=assembled, 1=exploded
  }>({
    particles:     [],
    assembled:     true,
    mx:            -9999,
    my:            -9999,
    hovering:      false,
    raf:           0,
    burstProgress: 0,
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(window.devicePixelRatio, 2);
    const s   = stateRef.current;

    const build = () => {
      const W = container.offsetWidth  || 600;
      const H = Math.round(FONT_SIZE * 1.4);

      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // ── sample letter pixels from offscreen canvas ──
      const off    = document.createElement("canvas");
      off.width    = W;
      off.height   = H;
      const oc     = off.getContext("2d")!;

      // resolve CSS font variable
      const cssVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-clash-display").trim();
      const fontStack = cssVar
        ? `${cssVar}, system-ui, sans-serif`
        : "system-ui, sans-serif";

      oc.font         = `700 ${FONT_SIZE}px ${fontStack}`;
      oc.textBaseline = "middle";
      oc.textAlign    = "center";
      oc.fillStyle    = "#fff";
      oc.fillText("I4C", W / 2, H / 2);

      const img      = oc.getImageData(0, 0, W, H);
      const isDark   = () => document.documentElement.classList.contains("dark");
      const particles: Particle[] = [];

      for (let py = 0; py < H; py += SAMPLE_GAP) {
        for (let px = 0; px < W; px += SAMPLE_GAP) {
          if (img.data[(py * W + px) * 4 + 3] < 80) continue;

          // color: base accent blue, slight variation per particle
          const hue    = 200 + (Math.random() - 0.5) * 60;
          const light  = isDark() ? 0.65 + Math.random() * 0.2 : 0.45 + Math.random() * 0.2;
          // convert hsl → rgb approximately
          const h = hue / 360;
          const s2 = 0.85, l2 = light;
          const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
          const p2 = 2 * l2 - q;
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          const r = Math.round(hue2rgb(p2, q, h + 1/3) * 255);
          const g = Math.round(hue2rgb(p2, q, h)       * 255);
          const b = Math.round(hue2rgb(p2, q, h - 1/3) * 255);

          particles.push({
            hx: px, hy: py,
            x:  px + (Math.random() - 0.5) * 2,
            y:  py + (Math.random() - 0.5) * 2,
            vx: 0, vy: 0,
            size:        0.8 + Math.random() * 1.4,
            opacity:     0.6 + Math.random() * 0.4,
            r, g, b,
            burstAngle: Math.random() * Math.PI * 2,
            burstSpeed: 4 + Math.random() * 8,
          });
        }
      }

      s.particles = particles;
      setReady(true);
    };

    // wait for fonts
    document.fonts.ready.then(build);
    const ro = new ResizeObserver(build);
    ro.observe(container);

    return () => { ro.disconnect(); };
  }, []);

  // ── RAF loop ──
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s   = stateRef.current;
    const DPR = Math.min(window.devicePixelRatio, 2);

    const tick = () => {
      const W = canvas.width  / DPR;
      const H = canvas.height / DPR;
      ctx.clearRect(0, 0, W, H);

      const isDark = document.documentElement.classList.contains("dark");

      for (const p of s.particles) {
        if (s.hovering) {
          // disassemble — particles fly outward from mouse
          const dx   = p.x - s.mx;
          const dy   = p.y - s.my;
          const dist = Math.hypot(dx, dy);

          if (dist < EXPLODE_R) {
            const force = (1 - dist / EXPLODE_R) * EXPLODE_F;
            // push away from mouse
            const nx = dist > 0 ? dx / dist : Math.cos(p.burstAngle);
            const ny = dist > 0 ? dy / dist : Math.sin(p.burstAngle);
            p.vx += nx * force;
            p.vy += ny * force;
            // also add some spin/burst randomness
            p.vx += (Math.random() - 0.5) * 1.2;
            p.vy += (Math.random() - 0.5) * 1.2;
          }

          // drift: slight gravity + damping, NO return force
          p.vy += 0.08;
          p.vx *= 0.96;
          p.vy *= 0.96;
        } else {
          // reassemble — spring back to home
          p.vx += (p.hx - p.x) * RETURN_F;
          p.vy += (p.hy - p.y) * RETURN_F;
          p.vx *= FRICTION;
          p.vy *= FRICTION;
        }

        p.x += p.vx;
        p.y += p.vy;

        // displacement for visual feedback
        const disp  = Math.hypot(p.x - p.hx, p.y - p.hy);
        const boost = Math.min(disp / 30, 1);

        // particles brighten and grow when displaced
        const alpha  = Math.min(1, p.opacity + boost * 0.4);
        const sz     = p.size + boost * 1.5;

        // glow halo when displaced
        if (boost > 0.05) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 4);
          grd.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${(boost * 0.25).toFixed(3)})`);
          grd.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);

        // at rest: slightly muted; displaced: full color
        const rr = isDark ? p.r : Math.max(0, p.r - 30);
        const gg = isDark ? p.g : Math.max(0, p.g - 30);
        const bb = isDark ? p.b : Math.max(0, p.b - 30);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [ready]);

  // ── mouse tracking ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const s = stateRef.current;

    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      s.mx = e.clientX - r.left;
      s.my = e.clientY - r.top;
    };
    const onEnter = () => { s.hovering = true;  };
    const onLeave = () => { s.hovering = false; };

    container.addEventListener("mousemove",  onMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove",  onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", cursor: "none" }}
      data-cursor-hover
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ display: "block", width: "100%", pointerEvents: "none" }}
      />
    </div>
  );
}
