"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let dotX = window.innerWidth  / 2;
    let dotY = window.innerHeight / 2;
    let ringX = dotX, ringY = dotY;
    let animId: number;
    let visible = false;

    // Show cursor on first move
    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity  = "1";
      ring.style.opacity = "";   // let CSS handle opacity
    };

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      show();
    };

    // Click: add class → CSS handles transition
    const onDown = () => {
      dot.classList.add("clicking");
      ring.classList.add("clicking");
    };
    const onUp = () => {
      dot.classList.remove("clicking");
      ring.classList.remove("clicking");
    };

    // Hover on interactive elements
    const onEnter = () => ring.classList.add("hovering");
    const onLeave = () => ring.classList.remove("hovering");

    // Hide when cursor leaves window
    const onLeaveWindow = () => {
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
      visible = false;
    };
    const onEnterWindow = () => show();

    // rAF loop — dot snaps, ring lerps with good speed
    const tick = () => {
      // Dot: direct position (instant)
      dot.style.left = `${dotX}px`;
      dot.style.top  = `${dotY}px`;

      // Ring: smooth lerp — 0.18 is responsive but not floaty
      const ease = 0.18;
      ringX += (dotX - ringX) * ease;
      ringY += (dotY - ringY) * ease;
      ring.style.left = `${ringX.toFixed(2)}px`;
      ring.style.top  = `${ringY.toFixed(2)}px`;

      animId = requestAnimationFrame(tick);
    };

    // Attach hover listeners to interactive elements
    const attachHover = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    // Hide initially until first move
    dot.style.opacity  = "0";
    ring.style.opacity = "0";

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    window.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("mouseenter", onEnterWindow);

    attachHover();
    animId = requestAnimationFrame(tick);

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("mouseenter", onEnterWindow);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
