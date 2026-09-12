"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Section config — side + action ────────────────────────── */
const SECTIONS: Record<string, {
  side: "left" | "right";
  action: "wave" | "think" | "point" | "cheer" | "read" | "dance" | "idle";
  speech: string;
  accent: string;
}> = {
  hero:      { side: "right", action: "wave",  speech: "Hello! I'm your AI guide 👋", accent: "#0066FF" },
  overview:  { side: "left",  action: "point", speech: "Let me show you around...",   accent: "#00AAFF" },
  timeline:  { side: "right", action: "read",  speech: "Five weeks of building!",     accent: "#00CC66" },
  problems:  { side: "left",  action: "think", speech: "Hmm, real hard problems...",  accent: "#FF8C00" },
  partners:  { side: "right", action: "cheer", speech: "Amazing partners! 🎉",        accent: "#AA44FF" },
  criteria:  { side: "left",  action: "think", speech: "Judging carefully...",        accent: "#FF4488" },
  prizes:    { side: "right", action: "cheer", speech: "Big prizes await! 🏆",        accent: "#FFCC00" },
  learnings: { side: "left",  action: "point", speech: "You'll gain so much!",        accent: "#00DDAA" },
  register:  { side: "right", action: "dance", speech: "Register now! Let's go!",    accent: "#0066FF" },
};

/* ─── Speech bubble ──────────────────────────────────────────── */
function Bubble({ text, show, isDark, side }: {
  text: string; show: boolean; isDark: boolean; side: "left" | "right";
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            bottom: "calc(100% + 12px)",
            [side === "right" ? "right" : "left"]: "0",
            zIndex: 10,
          }}
          initial={{ opacity: 0, y: 10, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.92 }}
          transition={{ duration: 0.32, ease: SOFT }}
        >
          <div
            className="px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap relative"
            style={{
              background: isDark ? "rgba(22,24,32,0.96)" : "rgba(255,255,255,0.97)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              color: isDark ? "#F0F0F2" : "#0D0D0F",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset"
                : "0 8px 24px rgba(0,0,0,0.12)",
              backdropFilter: "blur(12px)",
              letterSpacing: "0.01em",
            }}
          >
            {text}
            <div
              className="absolute -bottom-[7px]"
              style={{
                [side === "right" ? "right" : "left"]: "20px",
                width: 0, height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: `7px solid ${isDark ? "rgba(22,24,32,0.96)" : "rgba(255,255,255,0.97)"}`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Robot SVG ──────────────────────────────────────────────── */
function Robot({ action, isDark, accent, side }: {
  action: string; isDark: boolean; accent: string; side: "left" | "right";
}) {
  const dark = isDark;
  // Palette
  const C = {
    // Main body — layered gradients for 3D
    b1:  dark ? "#252830" : "#EAECF4",  // body face
    b2:  dark ? "#1a1d24" : "#D8DCE8",  // body shadow side
    b3:  dark ? "#2e3240" : "#F4F5FA",  // body highlight
    // Head
    h1:  dark ? "#2a2e38" : "#F0F2FA",
    h2:  dark ? "#1e2028" : "#E0E4F0",
    h3:  dark ? "#363c4a" : "#FAFBFF",
    // Metal parts
    m1:  dark ? "#3a3f50" : "#C8CCd8",
    m2:  dark ? "#282c38" : "#B8BCCC",
    m3:  dark ? "#4a5060" : "#E0E2EC",
    // Screen
    s1:  dark ? "#0a1020" : "#0D1830",
    s2:  dark ? "#1a2840" : "#1A2E50",
    // Joints
    j1:  dark ? "#30343e" : "#C0C4D0",
    j2:  dark ? "#404550" : "#D8DCE8",
    // Stroke
    st:  dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    // Shadow
    sh:  dark ? "rgba(0,0,0,0.55)"  : "rgba(60,70,100,0.18)",
    // Eye / accent glow
    acc: accent,
  };

  const dur = { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const };
  const fastDur = { duration: 0.45, repeat: Infinity, ease: "easeInOut" as const };

  // Right arm animation
  const rArm = action === "wave"  ? { rotate: [-15, 35, -15],  ...dur }
             : action === "cheer" ? { rotate: [ 10,-40,  10],  ...fastDur }
             : action === "point" ? { rotate: [-55,-55,-55], transition: { duration:0.1 } }
             : action === "dance" ? { rotate: [-20, 20,-20],  ...fastDur }
             : { rotate: [0,0,0] };

  // Left arm animation
  const lArm = action === "cheer" ? { rotate: [-10, 40,-10],  ...fastDur }
             : action === "read"  ? { rotate: [-35,-35,-35], transition: { duration:0.1 } }
             : action === "dance" ? { rotate: [ 20,-20, 20],  ...fastDur }
             : action === "wave"  ? { rotate: [0, 5, 0], ...dur }
             : { rotate: [0,0,0] };

  const bodyBob = action === "dance" || action === "cheer"
    ? { y: [-4,4,-4], ...fastDur }
    : { y: [0,-2,0], ...dur };

  const headAnim = action === "think" ? { rotate:[-10,-10,-10], transition:{duration:0.3} }
    : action === "wave" ? { rotate:[4,4,4], transition:{duration:0.3} }
    : { rotate:[0,2,0], ...dur };

  const flipX = side === "left" ? -1 : 1;

  return (
    <svg
      width="130" height="180"
      viewBox="0 0 130 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scaleX(${flipX})` }}
    >
      <defs>
        {/* Body radial gradient */}
        <radialGradient id="rg-body" cx="35%" cy="28%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={C.b3}/>
          <stop offset="50%"  stopColor={C.b1}/>
          <stop offset="100%" stopColor={C.b2}/>
        </radialGradient>
        {/* Head radial gradient */}
        <radialGradient id="rg-head" cx="38%" cy="25%" r="68%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={C.h3}/>
          <stop offset="50%"  stopColor={C.h1}/>
          <stop offset="100%" stopColor={C.h2}/>
        </radialGradient>
        {/* Eye gradient */}
        <radialGradient id="rg-eye" cx="32%" cy="30%" r="72%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.95"/>
          <stop offset="35%"  stopColor={C.acc}/>
          <stop offset="100%" stopColor={C.acc} stopOpacity="0.5"/>
        </radialGradient>
        {/* Screen gradient */}
        <radialGradient id="rg-screen" cx="25%" cy="22%" r="78%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor={C.s2}/>
          <stop offset="100%" stopColor={C.s1}/>
        </radialGradient>
        {/* Metal gradient for arms/legs */}
        <linearGradient id="rg-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.m3}/>
          <stop offset="50%"  stopColor={C.m1}/>
          <stop offset="100%" stopColor={C.m2}/>
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softdrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={C.sh}/>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="65" cy="175" rx="38" ry="6" fill={C.sh}/>

      {/* ── FEET ── */}
      <rect x="38" y="163" width="26" height="9" rx="5" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.8"/>
      <rect x="66" y="163" width="26" height="9" rx="5" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.8"/>
      {/* Foot highlight */}
      <rect x="40" y="164" width="16" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
      <rect x="68" y="164" width="16" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>

      {/* ── LEGS ── */}
      {/* Left */}
      <rect x="40" y="145" width="20" height="20" rx="6" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.8" filter="url(#softdrop)"/>
      <rect x="42" y="147" width="8"  height="10" rx="2" fill={C.j1}/>
      {/* Right */}
      <rect x="70" y="145" width="20" height="20" rx="6" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.8" filter="url(#softdrop)"/>
      <rect x="72" y="147" width="8"  height="10" rx="2" fill={C.j1}/>

      {/* ── BODY ── */}
      <motion.g animate={bodyBob}>
        {/* Left arm */}
        <motion.g style={{ transformOrigin: "38px 105px" }} animate={lArm}>
          {/* Shoulder cap */}
          <circle cx="38" cy="103" r="9" fill="url(#rg-body)" stroke={C.st} strokeWidth="1" filter="url(#softdrop)"/>
          <circle cx="38" cy="103" r="4" fill={C.j1}/>
          {/* Upper arm */}
          <rect x="27" y="102" width="14" height="26" rx="6" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.9" filter="url(#softdrop)"/>
          <rect x="29" y="104" width="5"  height="14" rx="2.5" fill="rgba(255,255,255,0.08)"/>
          {/* Elbow */}
          <circle cx="34" cy="130" r="7" fill={C.j2} stroke={C.st} strokeWidth="0.8"/>
          <circle cx="34" cy="130" r="3.5" fill={C.j1}/>
          {/* Lower arm */}
          <rect x="28" y="128" width="12" height="22" rx="5" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.8"/>
          {/* Hand */}
          <ellipse cx="34" cy="153" rx="8" ry="6.5" fill="url(#rg-body)" stroke={C.st} strokeWidth="0.9" filter="url(#softdrop)"/>
          <line x1="30" y1="150" x2="29" y2="157" stroke={C.st} strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="34" y1="149" x2="34" y2="158" stroke={C.st} strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="38" y1="150" x2="39" y2="157" stroke={C.st} strokeWidth="1.8" strokeLinecap="round"/>
        </motion.g>

        {/* Right arm */}
        <motion.g style={{ transformOrigin: "92px 105px" }} animate={rArm}>
          <circle cx="92" cy="103" r="9" fill="url(#rg-body)" stroke={C.st} strokeWidth="1" filter="url(#softdrop)"/>
          <circle cx="92" cy="103" r="4" fill={C.j1}/>
          <rect x="89" y="102" width="14" height="26" rx="6" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.9" filter="url(#softdrop)"/>
          <rect x="96" y="104" width="5"  height="14" rx="2.5" fill="rgba(255,255,255,0.08)"/>
          <circle cx="96" cy="130" r="7" fill={C.j2} stroke={C.st} strokeWidth="0.8"/>
          <circle cx="96" cy="130" r="3.5" fill={C.j1}/>
          <rect x="90" y="128" width="12" height="22" rx="5" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.8"/>
          <ellipse cx="96" cy="153" rx="8" ry="6.5" fill="url(#rg-body)" stroke={C.st} strokeWidth="0.9" filter="url(#softdrop)"/>
          <line x1="92" y1="150" x2="91" y2="157" stroke={C.st} strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="96" y1="149" x2="96" y2="158" stroke={C.st} strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="100" y1="150" x2="101" y2="157" stroke={C.st} strokeWidth="1.8" strokeLinecap="round"/>
        </motion.g>

        {/* Main torso */}
        <rect x="38" y="90" width="54" height="58" rx="12" fill="url(#rg-body)" stroke={C.st} strokeWidth="1.2" filter="url(#softdrop)"/>
        {/* Torso highlight bevel */}
        <rect x="40" y="91" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.11)"/>
        <rect x="39" y="91" width="3"  height="55" rx="1.5" fill="rgba(255,255,255,0.06)"/>

        {/* Chest screen */}
        <rect x="44" y="97" width="42" height="32" rx="8" fill="url(#rg-screen)" stroke={C.st} strokeWidth="0.8"/>
        {/* Screen inner glow */}
        <rect x="44" y="97" width="42" height="32" rx="8" fill={accent} fillOpacity="0.05"/>
        {/* Scanlines */}
        {[0,5,10,15,20,25].map(yy => (
          <line key={yy} x1="45" y1={99+yy} x2="85" y2={99+yy}
            stroke={accent} strokeOpacity="0.08" strokeWidth="0.6"/>
        ))}
        {/* Status bars */}
        <rect x="48" y="103" width="28" height="3.5" rx="1.75" fill={accent} fillOpacity="0.75"/>
        <rect x="48" y="109" width="18" height="3.5" rx="1.75" fill={accent} fillOpacity="0.5"/>
        <rect x="48" y="115" width="22" height="3.5" rx="1.75" fill={accent} fillOpacity="0.6"/>
        {/* Animated pulsing dot */}
        <motion.circle cx="80" cy="117" r="3" fill={accent} filter="url(#glow)"
          animate={{ opacity:[0.3,1,0.3], r:[2.5,3.5,2.5] }}
          transition={{ duration:1.4, repeat:Infinity }}/>

        {/* Side bolts */}
        <circle cx="42"  cy="110" r="3.5" fill={C.m1} stroke={C.st} strokeWidth="0.5"/>
        <circle cx="88"  cy="110" r="3.5" fill={C.m1} stroke={C.st} strokeWidth="0.5"/>
        <circle cx="42"  cy="110" r="1.5" fill={C.j2}/>
        <circle cx="88"  cy="110" r="1.5" fill={C.j2}/>

        {/* Lower body panels */}
        <rect x="44" y="133" width="12" height="14" rx="4" fill={C.j1} stroke={C.st} strokeWidth="0.7"/>
        <rect x="74" y="133" width="12" height="14" rx="4" fill={C.j1} stroke={C.st} strokeWidth="0.7"/>
        {/* Center belt */}
        <rect x="38" y="139" width="54" height="10" rx="5" fill={C.j2} stroke={C.st} strokeWidth="0.7"/>
        <rect x="56" y="141" width="18" height="6"  rx="3" fill={C.m1}/>
        <circle cx="65" cy="144" r="2.5" fill={accent} fillOpacity="0.6"/>

        {/* Neck */}
        <rect x="53" y="80" width="24" height="13" rx="5" fill={C.j2} stroke={C.st} strokeWidth="0.8"/>
        <rect x="55" y="82" width="20" height="3"  rx="1.5" fill="rgba(255,255,255,0.08)"/>
        <rect x="55" y="87" width="20" height="3"  rx="1.5" fill="rgba(255,255,255,0.05)"/>
      </motion.g>

      {/* ── HEAD ── */}
      <motion.g style={{ transformOrigin: "65px 50px" }} animate={headAnim}>
        {/* Head shape */}
        <rect x="28" y="22" width="74" height="60" rx="18" fill="url(#rg-head)" stroke={C.st} strokeWidth="1.2" filter="url(#softdrop)"/>
        {/* Head top highlight */}
        <rect x="32" y="23" width="66" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
        {/* Head left highlight */}
        <rect x="29" y="26" width="3" height="50" rx="1.5" fill="rgba(255,255,255,0.07)"/>

        {/* Forehead visor strip */}
        <rect x="34" y="28" width="62" height="14" rx="7" fill={C.j1} stroke={C.st} strokeWidth="0.7"/>
        <rect x="36" y="29" width="58" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
        {/* Visor LEDs */}
        {[42, 52, 62, 72, 82].map((xi, idx) => (
          <motion.circle key={idx} cx={xi} cy="35" r="2"
            fill={accent}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.18 }}/>
        ))}

        {/* Antenna */}
        <rect x="63" y="7"  width="4"  height="16" rx="2" fill="url(#rg-metal)" stroke={C.st} strokeWidth="0.5"/>
        <motion.circle cx="65" cy="5" r="5.5"
          fill={accent} filter="url(#glow)"
          animate={{ opacity:[0.5,1,0.5], r:[4.5,6,4.5] }}
          transition={{ duration:2, repeat:Infinity }}/>
        <circle cx="65" cy="5" r="2.5" fill="white" fillOpacity="0.7"/>

        {/* ── Eyes ── */}
        {/* Sockets */}
        <ellipse cx="50" cy="54" rx="13" ry="11" fill={C.s1} stroke={C.st} strokeWidth="0.8"/>
        <ellipse cx="80" cy="54" rx="13" ry="11" fill={C.s1} stroke={C.st} strokeWidth="0.8"/>
        {/* Socket rim highlight */}
        <path d="M 39 50 A 13 11 0 0 1 57 46" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M 69 50 A 13 11 0 0 1 87 46" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Eye orbs */}
        <motion.g
          animate={{ scaleX: action==="wave"||action==="cheer"?[1,1.1,1]:[1,1,1],
                     scaleY: action==="wave"||action==="cheer"?[1,1.15,1]:[1,0.9,1] }}
          style={{ transformOrigin:"65px 54px" }}
          transition={{ duration:0.7, repeat:Infinity, ease:"easeInOut" as const }}
        >
          <ellipse cx="50" cy="54" rx="9.5" ry="8.5" fill="url(#rg-eye)" filter="url(#glow)"/>
          <ellipse cx="80" cy="54" rx="9.5" ry="8.5" fill="url(#rg-eye)" filter="url(#glow)"/>
        </motion.g>
        {/* Pupils */}
        <circle cx="51" cy="53" r="4" fill={C.s1} fillOpacity="0.55"/>
        <circle cx="81" cy="53" r="4" fill={C.s1} fillOpacity="0.55"/>
        {/* Specular highlights */}
        <circle cx="47" cy="50" r="2.8" fill="white" fillOpacity="0.8"/>
        <circle cx="77" cy="50" r="2.8" fill="white" fillOpacity="0.8"/>
        <circle cx="55" cy="56" r="1.2" fill="white" fillOpacity="0.4"/>
        <circle cx="85" cy="56" r="1.2" fill="white" fillOpacity="0.4"/>

        {/* Nose */}
        <rect x="62" y="62" width="6" height="4" rx="2" fill={C.j1}/>

        {/* Mouth */}
        <motion.path
          d={
            action==="wave"||action==="cheer"||action==="dance"
              ? "M 46 70 Q 65 80 84 70"
              : action==="think"
              ? "M 50 72 Q 65 68 80 72"
              : "M 48 71 Q 65 78 82 71"
          }
          stroke={C.m3} strokeWidth="2.5" strokeLinecap="round" fill="none"
          animate={action==="wave"||action==="cheer"||action==="dance"
            ? { d:["M 46 70 Q 65 80 84 70","M 46 70 Q 65 83 84 70","M 46 70 Q 65 80 84 70"] }
            : undefined}
          transition={{ duration:0.7, repeat:Infinity, ease:"easeInOut" as const }}
        />
        {/* Cheek glow on happy */}
        {(action==="wave"||action==="cheer"||action==="dance") && (
          <>
            <ellipse cx="40" cy="62" rx="7" ry="5" fill={accent} fillOpacity="0.18"/>
            <ellipse cx="90" cy="62" rx="7" ry="5" fill={accent} fillOpacity="0.18"/>
          </>
        )}
        {/* Thinking dots */}
        {action==="think" && (
          <motion.g animate={{ opacity:[0,1,0] }} transition={{ duration:1.0, repeat:Infinity }}>
            <circle cx="92" cy="32" r="4.5" fill={accent} filter="url(#glow)"/>
            <circle cx="100" cy="24" r="3.2" fill={accent} filter="url(#glow)"/>
            <circle cx="106" cy="17" r="2" fill={accent} filter="url(#glow)"/>
          </motion.g>
        )}
        {/* Ear panels */}
        <rect x="28" y="46" width="7"  height="20" rx="3.5" fill={C.j1} stroke={C.st} strokeWidth="0.7"/>
        <rect x="95" y="46" width="7"  height="20" rx="3.5" fill={C.j1} stroke={C.st} strokeWidth="0.7"/>
        <motion.circle cx="31.5" cy="56" r="3" fill={accent} fillOpacity="0.7"
          animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.6, repeat:Infinity }}/>
        <motion.circle cx="98.5" cy="56" r="3" fill={accent} fillOpacity="0.7"
          animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.6, repeat:Infinity, delay:0.8 }}/>
      </motion.g>
    </svg>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
export default function RobotAgent() {
  const [isDark, setIsDark]         = useState(true);
  const [mounted, setMounted]       = useState(false);
  const [section, setSection]       = useState("hero");
  const [speech, setSpeech]         = useState("Hello! I'm your AI guide 👋");
  const [showSpeech, setShowSpeech] = useState(false);
  const [entered, setEntered]       = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cfg = SECTIONS[section] ?? SECTIONS.hero;

  // Spring-driven x position — slides smoothly across viewport
  const xRaw    = useMotionValue(typeof window !== "undefined" ? window.innerWidth - 180 : 900);
  const xSpring = useSpring(xRaw, { stiffness: 55, damping: 22, mass: 1.2 });

  // Compute target x based on side
  const getTargetX = useCallback((side: "left" | "right") => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    return side === "right" ? vw - 165 : 20;
  }, []);

  // When section changes — spring to new position
  useEffect(() => {
    xRaw.set(getTargetX(cfg.side));
  }, [cfg.side, xRaw, getTargetX]);

  // Update on resize
  useEffect(() => {
    const onResize = () => xRaw.set(getTargetX(cfg.side));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cfg.side, xRaw, getTargetX]);

  // Mount gate
  useEffect(() => { setMounted(true); }, []);

  // Theme
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Section observer
  const onSection = useCallback((id: string) => {
    const s = SECTIONS[id];
    if (!s) return;
    setSection(id);
    if (timer.current) clearTimeout(timer.current);
    setSpeech(s.speech);
    setShowSpeech(true);
    timer.current = setTimeout(() => setShowSpeech(false), 3200);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) onSection(e.target.id); }),
      { threshold: 0.35 }
    );
    Object.keys(SECTIONS).forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [onSection]);

  // Entry
  useEffect(() => {
    const t = setTimeout(() => {
      setEntered(true);
      setShowSpeech(true);
      timer.current = setTimeout(() => setShowSpeech(false), 3500);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;
  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <AnimatePresence>
      {entered && (
        <motion.div
          key="robot-root"
          className="fixed pointer-events-none z-[9990]"
          style={{
            // x spring drives horizontal position, y is fixed from bottom
            x: xSpring,
            bottom: "5%",
            left: 0,   // x is relative to left:0
          }}
          initial={{ y: 140, opacity: 0, scale: 0.65 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.9, ease: SOFT }}
        >
          {/* Float bob */}
          <motion.div
            className="relative"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" as const }}
          >
            <Bubble text={speech} show={showSpeech} isDark={isDark} side={cfg.side} />
            <Robot action={cfg.action} isDark={isDark} accent={cfg.accent} side={cfg.side} />
            {/* Ground glow */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: 90, height: 14,
                background: `radial-gradient(ellipse, ${cfg.accent}44 0%, transparent 70%)`,
              }}
              animate={{ opacity:[0.35,0.7,0.35], scaleX:[0.8,1.1,0.8] }}
              transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut" as const }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
