"use client";

import { useEffect, useRef } from "react";

interface Dot {
  bx: number; by: number;
  x: number;  y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
}

const SPACING   = 36;
const REPEL_R   = 130;
const REPEL_STR = 6;
const FRICTION  = 0.82;
const RETURN    = 0.11;

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let dots: Dot[] = [];
    // Mouse pos relative to canvas — start off-screen
    let mx = -9999, my = -9999;
    let raf: number;

    const buildDots = () => {
      dots = [];
      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      const startX = (W - (cols - 1) * SPACING) / 2;
      const startY = (H - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + c * SPACING;
          const by = startY + r * SPACING;
          dots.push({
            bx, by, x: bx, y: by,
            vx: 0, vy: 0,
            size: Math.random() > 0.85 ? 1.8 : 1.2,
            opacity: Math.random() * 0.28 + 0.10,
          });
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      buildDots();
    };

    // Track mouse on WINDOW — so dots react even when cursor is over text/buttons
    const onWindowMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        const dx   = d.x - mx;
        const dy   = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_R && dist > 0) {
          const force = (1 - dist / REPEL_R) * REPEL_STR;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        d.vx += (d.bx - d.x) * RETURN;
        d.vy += (d.by - d.y) * RETURN;
        d.vx *= FRICTION;
        d.vy *= FRICTION;
        d.x  += d.vx;
        d.y  += d.vy;

        const disp      = Math.sqrt((d.x - d.bx) ** 2 + (d.y - d.by) ** 2);
        const dispBoost = Math.min(disp / 18, 1) * 0.5;
        const alpha     = d.opacity + dispBoost;

        // Grey at rest → blue when displaced
        const t = Math.min(disp / 28, 1);
        const r = Math.round(44  + t * (0   - 44));
        const g = Math.round(44  + t * (102 - 44));
        const b = Math.round(56  + t * (255 - 56));

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize",    resize);
    window.addEventListener("mousemove", onWindowMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onWindowMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
      // NO pointer-events — let all clicks/hovers pass through to content
      style={{ pointerEvents: "none" }}
    />
  );
}
