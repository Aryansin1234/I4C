"use client";

/**
 * I4CLogo — shared logo component
 * props:
 *   size        — px size of the mark (default 32)
 *   variant     — "dark" | "light" | "auto"
 *                 "auto" reads CSS vars so it adapts to theme at runtime
 *   showText    — show "I4C" wordmark beside the mark (default true)
 *   className
 */

export function I4CLogo({
  size = 32,
  variant = "auto",
  showText = true,
  className,
}: {
  size?: number;
  variant?: "dark" | "light" | "auto";
  showText?: boolean;
  className?: string;
}) {
  // Fixed-palette variants (for loading screen / SSR where CSS vars aren't resolved)
  const isDark = variant === "dark";
  const isLight = variant === "light";

  // Colors
  const bg       = isLight ? "#F5F4F0" : isDark ? "#0D0D0F" : "var(--bg-surface)";
  const border   = isLight ? "rgba(0,0,0,0.1)" : isDark ? "rgba(255,255,255,0.1)" : "var(--border-color)";
  const fg       = isLight ? "#0D0D0F" : isDark ? "#F0F0F2" : "var(--text-primary)";
  const acc      = "#0066FF";
  const accLight = "#3388FF";
  const textCol  = isLight ? "#0D0D0F" : isDark ? "#F0F0F2" : "var(--text-primary)";

  /**
   * Mark concept:
   * 32×32 grid. The mark is a bold geometric monogram.
   *
   * The "I" = a single thick vertical bar, left zone (x 4–9)
   * The "4" = two lines meeting at a node:
   *           - vertical: x=19, y=8→24
   *           - horizontal crossbar: x=12→23, y=17 (accent color)
   *           - diagonal: x=19,y=8 → x=13,y=17
   * The "C" = a bold open arc, right zone
   *
   * All strokes are 2px, rounded. Accent fills the crossbar + node dot.
   * The mark has an inner grid of 4 dots in the background for a
   * technical/circuit board feel.
   */

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      {/* ── Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="I4C"
        style={{ display: "block", flexShrink: 0 }}
      >
        {/* Background square */}
        <rect width="32" height="32" rx="7" fill={bg} />
        <rect width="32" height="32" rx="7" fill="none" stroke={border} strokeWidth="0.75" />

        {/* ── Subtle grid dots — technical feel ── */}
        {[10, 17, 24].map(x =>
          [10, 17, 24].map(y => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7"
              fill={isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)"} />
          ))
        )}

        {/* ── I — bold vertical bar with top/bottom caps ── */}
        {/* Top cap */}
        <rect x="4.5" y="8" width="4" height="1.8" rx="0.9" fill={fg} />
        {/* Stem */}
        <rect x="5.9" y="8" width="1.2" height="16" rx="0.6" fill={fg} />
        {/* Bottom cap */}
        <rect x="4.5" y="22.2" width="4" height="1.8" rx="0.9" fill={fg} />

        {/* ── 4 ── */}
        {/* Vertical stroke */}
        <rect x="18.4" y="8" width="2" height="16" rx="1" fill={fg} />
        {/* Diagonal stroke (top of 4) — from (19.4, 8) down-left to (13, 17) */}
        <line
          x1="19.4" y1="8.5"
          x2="13.5" y2="17"
          stroke={fg}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Crossbar — accent color */}
        <rect x="11.5" y="16" width="10" height="2" rx="1" fill={acc} />

        {/* ── C — open arc, bold ── */}
        {/* Using a path for the C shape */}
        <path
          d="M 29 11.5 C 28.5 9.5 27 8 24.5 8 C 21.5 8 20 10.5 20 16 C 20 21.5 21.5 24 24.5 24 C 27 24 28.5 22.5 29 20.5"
          stroke={fg}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Accent node at crossbar-vertical junction ── */}
        <circle cx="19.4" cy="17" r="2.2" fill={acc} />
        {/* Small glow ring around node */}
        <circle cx="19.4" cy="17" r="3.2" fill="none"
          stroke={accLight} strokeWidth="0.6" opacity="0.5" />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-display, system-ui)",
            fontWeight: 700,
            fontSize: size * 0.5,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: textCol,
            userSelect: "none",
          }}
        >
          I4C
        </span>
      )}
    </span>
  );
}
