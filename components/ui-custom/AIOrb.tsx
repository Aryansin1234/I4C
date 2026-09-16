"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SECTIONS: Record<string, { r: number; g: number; b: number; label: string }> = {
  hero:      { r:   0, g: 102, b: 255, label: "Hello"      },
  overview:  { r:   0, g: 170, b: 255, label: "Exploring"  },
  timeline:  { r:   0, g: 204, b: 102, label: "Planning"   },
  problems:  { r: 255, g: 140, b:   0, label: "Thinking"   },
  partners:  { r: 170, g:  68, b: 255, label: "Connecting" },
  criteria:  { r: 255, g:  68, b: 136, label: "Evaluating" },
  prizes:    { r: 255, g: 204, b:   0, label: "Winning"    },
  learnings: { r:   0, g: 220, b: 170, label: "Growing"    },
  register:  { r:   0, g: 102, b: 255, label: "Ready?"     },
  footer:    { r:  85, g:  85, b: 119, label: "See you"    },
};

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${Math.min(1, Math.max(0, a)).toFixed(3)})`;
}

export default function AIOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const st = useRef<{
    sx: number; sy: number; vx: number; vy: number; mx: number; my: number;
    cr: number; cg: number; cb: number; tr: number; tg: number; tb: number;
    visible: boolean; hovering: boolean; clicking: boolean;
    idleTimer: number; idle: boolean; idleAngle: number; idleCx: number; idleCy: number;
    pulse: number; pulseV: number; stretchX: number; stretchY: number; angle: number;
    ring1: number; ring2: number; ring3: number; noiseT: number;
    trail: Array<{ x: number; y: number; a: number }>;
    ripples: Array<{ r: number; maxR: number; a: number }>;
    label: string; labelAlpha: number;
  }>({
    sx: -400, sy: -400, vx: 0, vy: 0, mx: -400, my: -400,
    cr: 0, cg: 102, cb: 255, tr: 0, tg: 102, tb: 255,
    visible: false, hovering: false, clicking: false,
    idleTimer: 0, idle: false, idleAngle: 0, idleCx: 0, idleCy: 0,
    pulse: 0, pulseV: 0.012, stretchX: 1, stretchY: 1, angle: 0,
    ring1: 0, ring2: 0, ring3: 0, noiseT: 0,
    trail: [],
    ripples: [],
    label: "Hello", labelAlpha: 0,
  });

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
    const ids = Object.keys(SECTIONS);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) onSection(e.target.id); }),
      { threshold: 0.3 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [onSection]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const c = st.current;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      c.mx = e.clientX; c.my = e.clientY;
      c.idle = false; c.idleTimer = 0;
      if (!c.visible) { c.visible = true; c.sx = e.clientX; c.sy = e.clientY; }
    };
    const onDown = () => {
      c.clicking = true;
      if (!Array.isArray(c.ripples)) c.ripples = [];
      c.ripples.push({ r: 0, maxR: 60, a: 1 });
    };
    const onUp   = () => { c.clicking = false; };

    const onHoverIn  = () => { c.hovering = true; };
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

    // simple 2D noise helper
    const noise = (x: number, y: number, t: number) => {
      return Math.sin(x * 2.3 + t) * Math.cos(y * 1.7 + t * 0.8) * 0.5 +
             Math.sin(x * 1.1 - t * 1.3) * Math.cos(y * 2.9 + t * 0.6) * 0.5;
    };

    const tick = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (!c.visible) { raf = requestAnimationFrame(tick); return; }

      // color lerp
      c.cr += (c.tr - c.cr) * 0.03;
      c.cg += (c.tg - c.cg) * 0.03;
      c.cb += (c.tb - c.cb) * 0.03;
      const R = Math.round(c.cr), G = Math.round(c.cg), B = Math.round(c.cb);

      // idle
      c.idleTimer++;
      if (c.idleTimer > 150 && !c.idle) {
        c.idle = true;
        c.idleCx = c.sx; c.idleCy = c.sy; c.idleAngle = 0;
      }

      // target
      let tx: number, ty: number;
      if (c.idle) {
        c.idleAngle += 0.007;
        tx = c.idleCx + Math.sin(c.idleAngle) * 55;
        ty = c.idleCy + Math.sin(c.idleAngle * 2) * 30;
      } else {
        tx = c.mx; ty = c.my;
      }
      if (c.hovering) { tx -= 4; ty -= 8; }

      // spring physics
      const STIFF = 0.065, DAMP = 0.78;
      c.vx = c.vx * DAMP + (tx - c.sx) * STIFF;
      c.vy = c.vy * DAMP + (ty - c.sy) * STIFF;
      c.sx += c.vx; c.sy += c.vy;

      // stretch
      const speed = Math.hypot(c.vx, c.vy);
      const sa    = Math.min(speed * 0.028, 0.28);
      c.angle   = Math.atan2(c.vy, c.vx);
      c.stretchX += (1 + sa       - c.stretchX) * 0.2;
      c.stretchY += (1 - sa * 0.5 - c.stretchY) * 0.2;

      // pulse
      c.pulse += c.pulseV;
      if (c.pulse > 1 || c.pulse < 0) c.pulseV *= -1;
      const baseR  = 10 + c.pulse * 2 + (c.hovering ? 3 : 0) + (c.clicking ? -2 : 0);

      // rotate rings
      c.ring1 += 0.018;
      c.ring2 -= 0.012;
      c.ring3 += 0.009;
      c.noiseT += 0.022;

      // label fade
      if (c.labelAlpha > 0) c.labelAlpha = Math.max(0, c.labelAlpha - 0.007);

      // trail
      if (!Array.isArray(c.trail)) c.trail = [];
      c.trail.push({ x: c.sx, y: c.sy, a: 0.8 });
      if (c.trail.length > 28) c.trail.shift();

      const cx = c.sx, cy = c.sy;

      /* ── DRAW ── */

      // 1. Trail — tapered segments with glow
      c.trail.forEach((p, i) => {
        const pct  = i / c.trail.length;
        const tAlpha = pct * 0.12;
        const tSize  = pct * 5;
        if (tAlpha < 0.005 || tSize < 0.5) return;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, tSize * 2);
        grd.addColorStop(0, rgba(R, G, B, tAlpha));
        grd.addColorStop(1, rgba(R, G, B, 0));
        ctx.beginPath();
        ctx.arc(p.x, p.y, tSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // 2. Click ripples
      if (!Array.isArray(c.ripples)) c.ripples = [];
      if (!Array.isArray(c.trail))   c.trail   = [];
      c.ripples = c.ripples.filter(rip => rip.a > 0.01);
      c.ripples.forEach(rip => {
        rip.r  += 2.5;
        rip.a  *= 0.88;
        ctx.beginPath();
        ctx.arc(cx, cy, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(R, G, B, rip.a * 0.6);
        ctx.lineWidth   = 1.5;
        ctx.stroke();
        // second ripple — slightly offset
        ctx.beginPath();
        ctx.arc(cx, cy, rip.r * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(R, G, B, rip.a * 0.3);
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      });

      // 3. Outer ambient glow
      const glowR  = baseR * 5.5;
      const glow   = ctx.createRadialGradient(cx, cy, baseR * 0.5, cx, cy, glowR);
      glow.addColorStop(0,   rgba(R, G, B, 0.10));
      glow.addColorStop(0.5, rgba(R, G, B, 0.04));
      glow.addColorStop(1,   rgba(R, G, B, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // 4. Ring 1 — dashed outer ring (slow, clockwise)
      {
        const ringR = baseR * 2.6;
        const segs  = 8;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(c.ring1);
        ctx.strokeStyle = rgba(R, G, B, 0.35);
        ctx.lineWidth   = 0.8;
        for (let s = 0; s < segs; s++) {
          const a0 = (s / segs) * Math.PI * 2;
          const a1 = ((s + 0.55) / segs) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(0, 0, ringR, a0, a1);
          ctx.stroke();
        }
        // small node dots on ring
        for (let s = 0; s < segs; s++) {
          const a = (s / segs) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * ringR, Math.sin(a) * ringR, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = rgba(R, G, B, 0.7);
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Ring 2 — solid thin ring (counter-clockwise)
      {
        const ringR = baseR * 1.85;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(c.ring2);
        const segs = 5;
        for (let s = 0; s < segs; s++) {
          const a0 = (s / segs) * Math.PI * 2;
          const a1 = ((s + 0.35) / segs) * Math.PI * 2;
          const grad = ctx.createLinearGradient(
            Math.cos(a0) * ringR, Math.sin(a0) * ringR,
            Math.cos(a1) * ringR, Math.sin(a1) * ringR
          );
          grad.addColorStop(0, rgba(R, G, B, 0));
          grad.addColorStop(0.5, rgba(R, G, B, 0.55));
          grad.addColorStop(1, rgba(R, G, B, 0));
          ctx.beginPath();
          ctx.arc(0, 0, ringR, a0, a1);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Ring 3 — innermost dotted ring
      {
        const ringR = baseR * 1.45;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(c.ring3);
        const dots = 12;
        for (let d = 0; d < dots; d++) {
          const a    = (d / dots) * Math.PI * 2;
          const fade = (Math.sin(a * 3 + c.ring3 * 2) * 0.5 + 0.5);
          ctx.beginPath();
          ctx.arc(Math.cos(a) * ringR, Math.sin(a) * ringR, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = rgba(R, G, B, 0.3 + fade * 0.4);
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. Core — plasma fluid effect with noise
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(c.angle);
      ctx.scale(c.stretchX, c.stretchY);
      ctx.rotate(-c.angle);

      // plasma glow halo
      const plasmaR = baseR * 1.1;
      const plasma  = ctx.createRadialGradient(0, 0, 0, 0, 0, plasmaR * 1.6);
      plasma.addColorStop(0,    rgba(R, G, B, 0.5));
      plasma.addColorStop(0.6,  rgba(R, G, B, 0.15));
      plasma.addColorStop(1,    rgba(R, G, B, 0));
      ctx.beginPath();
      ctx.arc(0, 0, plasmaR * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = plasma;
      ctx.fill();

      // noisy core boundary — draw as polygon of perturbed points
      ctx.beginPath();
      const pts = 48;
      for (let p = 0; p <= pts; p++) {
        const a    = (p / pts) * Math.PI * 2;
        const nx   = Math.cos(a);
        const ny   = Math.sin(a);
        const n    = noise(nx, ny, c.noiseT) * 0.28;
        const r    = baseR * (1 + n);
        const px   = Math.cos(a) * r;
        const py   = Math.sin(a) * r;
        if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // core fill — radial gradient
      const coreFill = ctx.createRadialGradient(
        -baseR * 0.25, -baseR * 0.28, 0,
        0, 0, baseR * 1.05
      );
      const alpha = c.clicking ? 0.95 : c.hovering ? 1.0 : 0.88;
      coreFill.addColorStop(0,   `rgba(255,255,255,${alpha * 0.9})`);
      coreFill.addColorStop(0.25, rgba(R, G, B, alpha));
      coreFill.addColorStop(0.7,  rgba(Math.max(0, R - 20), Math.max(0, G - 15), Math.max(0, B - 10), alpha * 0.8));
      coreFill.addColorStop(1,    rgba(Math.max(0, R - 40), Math.max(0, G - 30), Math.max(0, B - 20), alpha * 0.5));
      ctx.fillStyle = coreFill;
      ctx.fill();

      // specular highlight
      ctx.beginPath();
      ctx.ellipse(-baseR * 0.28, -baseR * 0.3, baseR * 0.28, baseR * 0.18, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.55})`;
      ctx.fill();

      // secondary micro-highlight
      ctx.beginPath();
      ctx.ellipse(baseR * 0.18, baseR * 0.22, baseR * 0.1, baseR * 0.07, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.2})`;
      ctx.fill();

      ctx.restore();

      // 8. Label
      if (c.labelAlpha > 0.02) {
        const isDark = document.documentElement.classList.contains("dark");
        ctx.save();
        ctx.font = `700 13px -apple-system,"SF Pro Text",system-ui,sans-serif`;
        const text = c.label.toUpperCase();
        const lx   = cx + baseR * 2.8 + 6;
        const ly   = cy + 4.5;

        // background pill
        const tw = ctx.measureText(text).width;
        const ph = 18, pw = tw + 14, pr = 5;
        const px2 = lx - 6, py2 = ly - 13;
        ctx.beginPath();
        ctx.roundRect(px2, py2, pw, ph, pr);
        ctx.fillStyle = isDark
          ? rgba(R, G, B, c.labelAlpha * 0.18)
          : rgba(R, G, B, c.labelAlpha * 0.1);
        ctx.fill();
        ctx.strokeStyle = rgba(R, G, B, c.labelAlpha * 0.4);
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // text
        ctx.fillStyle = isDark
          ? `rgba(255,255,255,${c.labelAlpha})`
          : `rgba(0,0,0,${c.labelAlpha})`;
        ctx.shadowColor = rgba(R, G, B, c.labelAlpha * 0.6);
        ctx.shadowBlur  = 8;
        ctx.fillText(text, lx, ly);
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
      aria-hidden
    />
  );
}
