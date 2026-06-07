import './ScoreHalo.css';
import type { ReactNode } from 'react';

/**
 * ScoreHalo — a thin progress ring that frames the score numeral.
 *
 * Purely additive: it wraps the existing score number and draws an SVG ring
 * BEHIND it. The number stays the dominant element and is untouched.
 *
 * Scale rule (matches the app's constants):
 *   - The ring maps progress toward the victory threshold (default 16).
 *   - Fraction = min(score, goal) / goal  →  the ring is full at `goal`
 *     and STAYS full for scores above it (e.g. 17–20 with MAX_SCORE = 20).
 *   - At score >= goal the ring turns gold (#ffd700) to echo the existing
 *     VICTORY state, with a very contained "breathing" glow.
 *
 * The ring auto-sizes to the numeral (height:148% of the number box via CSS),
 * so it tracks the responsive font-size with no extra config.
 */

interface ScoreHaloProps {
  /** Current score (0..MAX_SCORE). The number itself is rendered via children. */
  score: number;
  /** Which player side — drives the ring colour (left = crimson, right = cobalt). */
  side: 'left' | 'right';
  /** Victory threshold the ring fills toward. Defaults to 16 (VICTORY_THRESHOLD). */
  goal?: number;
  /** The score numeral element to frame (kept exactly as-is). */
  children: ReactNode;
}

const RADIUS = 54;
const CIRC = 2 * Math.PI * RADIUS;

export function ScoreHalo({ score, side, goal = 16, children }: ScoreHaloProps) {
  const frac = Math.min(Math.max(score, 0), goal) / goal; // 0..1, capped at the goal
  const isWin = score >= goal;

  return (
    <span className="hud-score__halo-cell">
      <svg
        className={`score-halo score-halo--${side}${isWin ? ' is-win' : ''}`}
        viewBox="0 0 118 118"
        aria-hidden="true"
      >
        <circle className="score-halo__track" cx="59" cy="59" r={RADIUS} />
        <circle
          className="score-halo__prog"
          cx="59"
          cy="59"
          r={RADIUS}
          transform="rotate(-90 59 59)"
          style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC * (1 - frac) }}
        />
      </svg>
      {children}
    </span>
  );
}
