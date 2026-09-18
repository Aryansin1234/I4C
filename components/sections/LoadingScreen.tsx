"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

type Phase = "loading" | "exit";

const MIN_DURATION = 2800;

const MESSAGES = [
  "Initialising workspace",
  "Loading problem statements",
  "Connecting to partners",
  "Preparing your challenges",
  "Almost ready",
];

const EXPO = [0.76, 0, 0.24, 1] as const;
const SOFT = [0.16, 1, 0.3,  1] as const;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase,    setPhase]    = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const [counter,  setCounter]  = useState(0);
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [textIn,   setTextIn]   = useState(false);

  const fontsReadyRef = useRef(false);
  const timerDoneRef  = useRef(false);
  const rafRef        = useRef<number>(0);
  const startRef      = useRef<number>(0);

  const maybeExit = useCallback(() => {
    if (!fontsReadyRef.current || !timerDoneRef.current) return;
    setProgress(100);
    setCounter(100);
    // hold at 100% briefly, then curtain
    setTimeout(() => setPhase("exit"), 400);
    setTimeout(() => onComplete(), 400 + 700);
  }, [onComplete]);

  const tick = useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const t = Math.min((ts - startRef.current) / MIN_DURATION, 1);

    // fast start → visible crawl in middle → snap to end
    let e: number;
    if      (t < 0.3)  e = t * t * 3.3;
    else if (t < 0.75) e = 0.297 + (t - 0.3) * 0.6;
    else               e = 0.567 + (t - 0.75) * 1.73;
    e = Math.min(e, 0.99);

    const pct = Math.floor(e * 100);
    setProgress(pct);
    setCounter(pct);
    // each message occupies ~20% of progress range
    setMsgIdx(Math.min(Math.floor(e * MESSAGES.length), MESSAGES.length - 1));

    if (t < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      timerDoneRef.current = true;
      maybeExit();
    }
  }, [maybeExit]);

  useEffect(() => {
    const t0 = setTimeout(() => setTextIn(true), 250);
    const t1 = setTimeout(() => {
      startRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }, 400);

    document.fonts.ready.then(() => {
      fontsReadyRef.current = true;
      maybeExit();
    });

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick, maybeExit]);

  return (
    <AnimatePresence mode="wait">
      {phase === "loading" ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: "#0A0A0C" }}
          exit={{ opacity: 1 }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          {/* Top-left wordmark */}
          <motion.div
            className="absolute top-6 left-6 sm:top-12 sm:left-14 z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: SOFT }}
          >
            <span className="font-display font-bold" style={{ fontSize: "1.1rem", color: "#F0F0F2", letterSpacing: "-0.03em" }}>
              I4C<span style={{ color: "#0066FF" }}>.</span>
            </span>
          </motion.div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center relative">

            {/* Ambient glow circle — clamped for mobile */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "min(500px, 90vw)",
                height: "min(500px, 90vw)",
                background: "radial-gradient(circle, #0066FF0C 0%, transparent 65%)",
                border: "1px solid #0066FF12",
              }}
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.4, ease: SOFT }}
            />

            {/* Headline */}
            <div className="relative z-10 text-center" style={{ overflow: "visible" }}>
              <div style={{ overflow: "hidden", paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
                <motion.div
                  className="font-display font-bold"
                  style={{
                    fontSize: "clamp(2.8rem, 8vw, 7.5rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.04em",
                    color: "#F0F0F2",
                    paddingRight: "0.08em",
                  }}
                  initial={{ y: "105%" }}
                  animate={textIn ? { y: "0%" } : {}}
                  transition={{ duration: 1.0, ease: SOFT }}
                >
                  <span style={{
                    fontSize: "clamp(2rem, 10vw, 7.5rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.04em",
                    color: "#F0F0F2",
                    display: "block",
                    fontWeight: 700,
                  }}>
                    Invent for
                  </span>
                </motion.div>
              </div>
              <div style={{ overflowY: "hidden", overflowX: "visible", paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
                <motion.div
                  className="font-display font-bold"
                  style={{
                    fontSize: "clamp(2rem, 10vw, 7.5rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.04em",
                    color: "#0066FF",
                    paddingRight: "0.08em",
                  }}
                  initial={{ y: "105%" }}
                  animate={textIn ? { y: "0%" } : {}}
                  transition={{ delay: 0.1, duration: 1.0, ease: SOFT }}
                >
                  Customers
                </motion.div>
              </div>
            </div>

            {/* Cycling message — below headline, visible size */}
            <div className="relative z-10 mt-10 h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIdx}
                  className="font-mono tracking-[0.2em] uppercase text-center"
                  style={{ fontSize: "0.72rem", color: "#555568", letterSpacing: "0.18em" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: SOFT }}
                >
                  {MESSAGES[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 px-6 sm:px-14 pb-8 sm:pb-12">
            <div className="flex items-end justify-between mb-5">
              {/* Counter */}
              <motion.div
                className="font-display font-bold tabular-nums leading-none"
                style={{ fontSize: "clamp(2rem, 10vw, 6rem)", color: "#F0F0F2", letterSpacing: "-0.04em" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: SOFT }}
              >
                {String(counter).padStart(2, "0")}
                <span style={{ color: "#0066FF", fontSize: "35%", letterSpacing: 0 }}>%</span>
              </motion.div>

              {/* Right label */}
              <motion.span
                className="font-mono tracking-widest uppercase text-right hidden sm:block"
                style={{ fontSize: "0.6rem", color: "#2A2A38", maxWidth: 160 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Loading experience
              </motion.span>
            </div>

            {/* Progress track */}
            <div className="relative w-full" style={{ height: "1px", background: "#18181E" }}>
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  background: "linear-gradient(90deg, #003FCC, #0066FF 60%, #4499FF)",
                  boxShadow: "0 0 10px #0066FF55",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[10px] rounded-full"
                style={{ background: "#4499FF", boxShadow: "0 0 8px 2px #0066FF99" }}
                animate={{ left: `${progress}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        /* ── Curtain exit: top folds up, bottom folds down ── */
        <motion.div key="exit" className="fixed inset-0 z-[200] pointer-events-none flex flex-col">
          <motion.div
            className="w-full"
            style={{ flex: 1, background: "#0A0A0C", transformOrigin: "top" }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.85, ease: EXPO }}
          />
          <motion.div
            className="w-full"
            style={{ flex: 1, background: "#0A0A0C", transformOrigin: "bottom" }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.85, ease: EXPO, delay: 0.07 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
