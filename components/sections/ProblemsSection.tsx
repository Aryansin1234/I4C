"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const SOFT = [0.16, 1, 0.3, 1] as const;
const EXPO = [0.76, 0, 0.24, 1] as const;

const PROBLEMS = [
  {
    id: "p1",
    index: "01",
    partner: "Apple",
    track: "Accessibility",
    title: "Accessibility at Scale",
    teaser: "Build tools that make enterprise software fully accessible without developer overhead.",
    full: "Apple is looking for solutions that bring WCAG 2.2 AA compliance to large-scale enterprise UIs automatically — linting, runtime analysis, and guided remediation — without requiring developers to be accessibility experts. Solutions must support React, SwiftUI, and web components.",
    constraints: ["Must integrate with existing CI/CD pipelines", "No proprietary Apple SDK usage", "Results must be auditable by a11y experts"],
    resources: ["WCAG 2.2 specification", "Axe-core library", "Apple Human Interface Guidelines"],
  },
  {
    id: "p2",
    index: "02",
    partner: "Apple",
    track: "On-Device ML",
    title: "On-Device ML Inference",
    teaser: "Push large model inference to the edge using Apple Silicon's Neural Engine.",
    full: "Leverage Apple's Neural Engine and Core ML to run inference tasks that traditionally require cloud compute — fully offline, privacy-preserving, and under 100ms latency. The challenge includes model compression, quantization, and a developer-friendly Swift API layer.",
    constraints: ["Target: M-series chips (M1–M4)", "Latency ≤ 100ms p95", "Model must run fully offline"],
    resources: ["Core ML Tools", "Create ML framework", "Apple Neural Engine docs"],
  },
  {
    id: "p3",
    index: "03",
    partner: "Apple",
    track: "Spatial Computing",
    title: "Spatial Computing Workflows",
    teaser: "Reimagine enterprise workflows for Apple Vision Pro.",
    full: "Design and prototype a spatial computing experience that makes a core enterprise workflow — data review, code collaboration, or documentation — dramatically more effective in visionOS. Focus on human experience, not just porting 2D interfaces into 3D.",
    constraints: ["Must work in visionOS Simulator", "Use SwiftUI + RealityKit", "UX tested with at least 3 users"],
    resources: ["visionOS developer docs", "RealityComposer Pro", "Apple Design Patterns for Spatial"],
  },
  {
    id: "p4",
    index: "04",
    partner: "Internal",
    track: "Customer Intelligence",
    title: "Customer 360 Intelligence",
    teaser: "Surface actionable insights from fragmented data sources in real time.",
    full: "Our customer data lives across 12+ systems. Build a unified intelligence layer that aggregates, normalises, and surfaces proactive alerts — giving account teams a single, trustworthy view of customer health without manual correlation.",
    constraints: ["Must use the provided synthetic dataset", "No PII stored in plain text", "P95 query latency < 500ms"],
    resources: ["Synthetic dataset (provided)", "Internal data schema docs", "Grafana for dashboarding"],
  },
  {
    id: "p5",
    index: "05",
    partner: "Internal",
    track: "Dev Tooling",
    title: "Dev Experience Automation",
    teaser: "Cut toil from developer workflows — automate the boring parts of shipping software.",
    full: "Internal developer productivity is constrained by manual, repetitive tasks in the release lifecycle. Identify the highest-toil touchpoints and build automation that saves measurable engineer-hours per sprint.",
    constraints: ["Scope confirmed at kickoff", "Must integrate with GitHub Actions", "Measurable time savings required"],
    resources: ["Internal engineering metrics", "GitHub Actions docs", "DORA metrics framework"],
  },
  {
    id: "p6",
    index: "06",
    partner: "Apple",
    track: "Privacy",
    title: "Privacy-Preserving Analytics",
    teaser: "Build product analytics that respects user privacy by design.",
    full: "Create an analytics pipeline that delivers actionable product insights without collecting personally identifiable information. Leverage differential privacy, on-device aggregation, and Apple's privacy frameworks to make privacy a competitive advantage rather than a constraint.",
    constraints: ["No raw user data leaves the device", "Differential privacy ε ≤ 1.0", "Dashboard latency < 2s"],
    resources: ["Apple Privacy docs", "Differential Privacy library", "CKRecord framework"],
  },
  {
    id: "p7",
    index: "07",
    partner: "Internal",
    track: "AI Assistant",
    title: "Enterprise AI Copilot",
    teaser: "Build an AI assistant that understands your company's internal knowledge.",
    full: "Design and build an enterprise-grade AI copilot that can answer questions, draft documents, and surface relevant information from internal knowledge bases — without leaking confidential data or hallucinating company-specific facts.",
    constraints: ["No external API calls with internal data", "Response time < 3s p95", "Must cite sources"],
    resources: ["Internal knowledge base API", "LlamaIndex docs", "RAGAS evaluation framework"],
  },
  {
    id: "p8",
    index: "08",
    partner: "Internal",
    track: "Observability",
    title: "Intelligent Incident Response",
    teaser: "Reduce MTTR by automatically diagnosing and triaging production incidents.",
    full: "Production incidents cost hours of engineer time on triage and root-cause analysis. Build a system that automatically correlates logs, metrics, and traces to suggest root causes and remediation steps — reducing mean time to resolution by at least 50%.",
    constraints: ["Must integrate with existing Datadog setup", "Alert noise reduction ≥ 40%", "No false-negative suppression"],
    resources: ["Datadog API docs", "OpenTelemetry spec", "Synthetic incident dataset"],
  },
  {
    id: "p9",
    index: "09",
    partner: "Apple",
    track: "SwiftUI",
    title: "Adaptive UI Framework",
    teaser: "Build a UI framework that automatically adapts to any screen, device, and context.",
    full: "Modern apps run on iPhone, iPad, Mac, Apple Watch, and Vision Pro. Build a framework or set of SwiftUI components that intelligently adapts layout, density, and interaction model based on device context — reducing per-platform implementation work by 60%+.",
    constraints: ["Pure SwiftUI", "Supports all Apple platforms", "Zero performance regression"],
    resources: ["SwiftUI documentation", "Human Interface Guidelines", "Swift Charts framework"],
  },
  {
    id: "p10",
    index: "10",
    partner: "Internal",
    track: "Supply Chain",
    title: "Supply Chain Risk Intelligence",
    teaser: "Predict and mitigate supply chain disruptions before they impact customers.",
    full: "Build a risk intelligence layer that monitors external signals — geopolitical events, weather, market conditions — and correlates them with our supply chain dependencies to surface proactive alerts and recommended actions before disruptions hit.",
    constraints: ["Use provided supplier dependency graph", "Alert lead time ≥ 48 hours", "False positive rate < 15%"],
    resources: ["Supplier graph dataset", "News API access", "Risk scoring rubric"],
  },
];

type Problem = typeof PROBLEMS[0];

function IconArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

/* ─── Detail panel content (animates on problem change) ─────── */
/* ─── Detail panel — premium layered card ───────────────────── */
function DetailContent({ p }: { p: Problem }) {
  return (
    <motion.div
      key={p.id}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.35, ease: SOFT }}
      className="flex flex-col h-full"
    >
      {/* ── Top accent strip with gradient ── */}
      <div className="relative h-1 mb-8 rounded-full overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, var(--brand-accent) 0%, #33AAFF 60%, transparent 100%)",
          boxShadow: "0 0 12px var(--accent-glow)",
        }} />
      </div>

      {/* ── Header block ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] font-mono tracking-[0.24em] uppercase px-2.5 py-1 rounded-full"
              style={{ color: "var(--brand-accent)", background: "var(--accent-subtle)", border: "1px solid var(--border-accent)" }}
            >
              {p.partner}
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
              {p.track}
            </span>
          </div>
          {/* Watermark index */}
          <span
            className="font-display font-bold leading-none select-none flex-shrink-0"
            style={{ fontSize: "4rem", letterSpacing: "-0.07em", color: "var(--bg-base)" }}
          >
            {p.index}
          </span>
        </div>

        <h3
          className="font-display font-bold"
          style={{
            fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: "var(--text-primary)",
          }}
        >
          {p.title}
        </h3>
      </div>

      {/* ── Divider ── */}
      <div className="h-px mb-6" style={{ background: "var(--border-color)" }} />

      {/* ── Description ── */}
      <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
        {p.full}
      </p>

      {/* ── Constraints — surface cards ── */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-1 rounded-full" style={{ background: "var(--brand-accent)" }} />
          <p className="text-[10px] font-mono tracking-[0.24em] uppercase" style={{ color: "var(--text-muted)" }}>
            Constraints
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {p.constraints.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl px-4 py-3 relative overflow-hidden"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border-color)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {/* subtle left accent */}
              <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-40"
                style={{ background: "var(--brand-accent)" }} />
              <span className="font-mono text-xs font-bold mt-0.5 flex-shrink-0 pl-1" style={{ color: "var(--brand-accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Resources — pill chips ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-1 rounded-full" style={{ background: "var(--brand-accent)" }} />
          <p className="text-[10px] font-mono tracking-[0.24em] uppercase" style={{ color: "var(--text-muted)" }}>
            Resources
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {p.resources.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-mono"
              style={{
                background: "var(--bg-base)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <span style={{ color: "var(--brand-accent)" }}>↗</span>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <motion.a
        href="#register"
        className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold relative overflow-hidden"
        style={{
          background: "var(--brand-accent)",
          color: "#fff",
          boxShadow: "0 4px 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
        whileHover={{ scale: 1.02, boxShadow: "0 8px 40px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)" }}
        whileTap={{ scale: 0.97 }}
      >
        {/* shimmer */}
        <motion.span
          className="absolute inset-0 -skew-x-12 pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)" }}
          initial={{ x: "-150%" }}
          whileHover={{ x: "150%" }}
          transition={{ duration: 0.5 }}
        />
        <span className="relative z-10">Register for this track</span>
        <IconArrow />
      </motion.a>
    </motion.div>
  );
}

/* ─── Stair item ─────────────────────────────────────────────── */
function StairItem({
  p, i, isActive, inView, onClick,
}: {
  p: Problem; i: number; isActive: boolean; inView: boolean; onClick: () => void;
}) {
  const maxIndent  = 56;
  // Stair: inactive items shift right by i*6px, active snaps back to 0
  const stairX     = isActive ? 0 : Math.min(i * 6, maxIndent);

  const enterDelay = i * 0.07;
  const exitDelay  = (PROBLEMS.length - 1 - i) * 0.05;

  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
    onClick();
  };

  return (
    // Outer: entry/exit slide from left — no stair offset here
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : { x: -80, opacity: 0 }}
      transition={{
        x:       { delay: inView ? enterDelay : exitDelay, duration: 0.6, ease: SOFT },
        opacity: { delay: inView ? enterDelay : exitDelay, duration: 0.5 },
      }}
    >
      {/* Inner: stair offset via translateX — button stays full-width, just shifts right */}
      <motion.button
        onClick={handleClick}
        className="relative w-full text-left overflow-hidden focus:outline-none block"
        animate={{
          x: stairX,
          borderColor: isActive ? "var(--border-accent)" : "var(--border-color)",
          boxShadow: isActive
            ? "0 0 0 1px var(--border-accent), 0 8px 32px rgba(0,102,255,0.14), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "none",
        }}
        whileHover={{
          borderColor: "var(--border-accent)",
          y: isActive ? 0 : -1,
        }}
        transition={{ x: { duration: 0.3, ease: SOFT }, duration: 0.18 }}
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: "0.875rem",
          background: "var(--bg-surface)",
        }}
      >
        {/* Active background sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "linear-gradient(105deg, rgba(0,102,255,0.10) 0%, rgba(0,102,255,0.04) 50%, transparent 100%)",
            borderRadius: "inherit",
          }}
        />

        {/* Active left accent bar */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-l-[0.875rem]"
          animate={{ width: isActive ? "3px" : "0px", opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.25, ease: EXPO }}
          style={{ background: "var(--brand-accent)", boxShadow: "2px 0 12px var(--accent-glow)" }}
        />

        {/* Ripple on click */}
        <AnimatePresence>
          {ripple && (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x, top: ripple.y,
                transform: "translate(-50%, -50%)",
                background: "var(--brand-accent)",
              }}
              initial={{ width: 0, height: 0, opacity: 0.2 }}
              animate={{ width: 340, height: 340, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </AnimatePresence>

        {/* Content row */}
        <div className="relative flex items-center gap-4 px-5 py-3.5">
          {/* Index */}
          <span
            className="font-mono text-xs tabular-nums flex-shrink-0 w-5 font-bold"
            style={{ color: isActive ? "var(--brand-accent)" : "var(--text-muted)" }}
          >
            {p.index}
          </span>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <motion.span
              className="font-display font-semibold text-sm block truncate"
              animate={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
              transition={{ duration: 0.2 }}
            >
              {p.title}
            </motion.span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono tracking-[0.14em] uppercase" style={{ color: "var(--text-muted)" }}>
                {p.partner}
              </span>
              <span style={{ color: "var(--border-color)", fontSize: "0.6rem" }}>·</span>
              <span className="text-[10px] font-mono tracking-[0.14em] uppercase" style={{ color: "var(--text-muted)" }}>
                {p.track}
              </span>
            </div>
          </div>

          {/* Active pill / arrow */}
          <div className="flex-shrink-0 w-14 flex justify-end">
            <AnimatePresence mode="wait" initial={false}>
              {isActive ? (
                <motion.span
                  key="tag"
                  className="text-[9px] font-mono tracking-[0.18em] uppercase px-2 py-1 rounded-full whitespace-nowrap"
                  style={{ color: "var(--brand-accent)", background: "var(--accent-subtle)", border: "1px solid var(--border-accent)" }}
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.18 }}
                >
                  Active
                </motion.span>
              ) : (
                <motion.span
                  key="arrow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: "var(--text-muted)" }}
                >
                  <IconArrow />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────── */
export default function ProblemsSection() {
  const [active, setActive] = useState<Problem>(PROBLEMS[0]);
  const sectionRef  = useRef<HTMLDivElement>(null);
  const listRef     = useRef<HTMLDivElement>(null);
  // sectionRef for header + right panel (enters early)
  const inView      = useInView(sectionRef, { once: false, amount: 0.1 });
  // listRef for stair items — fires when list itself is well in view
  const listInView  = useInView(listRef, { once: false, amount: 0.3, margin: "0px 0px -80px 0px" });

  return (
    <section id="problems" className="py-28 lg:py-36" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-20">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6, ease: SOFT }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: "var(--brand-accent)" }}>
              Challenges
            </span>
            <span className="w-8 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--text-muted)" }}>
              {PROBLEMS.length} open tracks
            </span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--text-primary)" }}
              initial={{ y: "105%" }}
              animate={{ y: inView ? "0%" : "105%" }}
              transition={{ delay: 0.1, duration: 0.9, ease: SOFT }}
            >
              What you&apos;ll solve.
            </motion.h2>
          </div>
        </motion.div>

        {/* Two-column layout — list LEFT, detail RIGHT */}
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-10 items-start">

          {/* LEFT — staircase list */}
          {/* pr-16 reserves 64px on the right so stair steps don't get clipped */}
          <div ref={listRef} className="flex flex-col gap-2 pr-16">
            {PROBLEMS.map((p, i) => (
              <StairItem
                key={p.id}
                p={p}
                i={i}
                isActive={active.id === p.id}
                inView={listInView}
                onClick={() => setActive(p)}
              />
            ))}
          </div>

          {/* RIGHT — detail panel */}
          <motion.div
            className="rounded-2xl overflow-y-auto sticky top-24 relative"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              maxHeight: "calc(100vh - 8rem)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)",
            }}
            initial={{ opacity: 0, x: 56 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 56 }}
            transition={{ duration: 0.7, ease: SOFT, delay: 0.12 }}
          >
            <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)" }} />
            <div className="absolute bottom-0 left-6 right-6 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.3),transparent)" }} />
            <div className="p-8">
              <AnimatePresence mode="wait" initial={false}>
                <DetailContent key={active.id} p={active} />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
