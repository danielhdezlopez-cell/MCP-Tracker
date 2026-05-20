import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { getAffiliationFx, type AffiliationFx } from '../data/affiliationsFx';
import './AffiliationBackdrop.css';

/**
 * AffiliationBackdrop — renders a faction sigil halo (option A) +
 * directional color beam + corner stamp (option C) in each player's
 * half of the MAIN page.
 *
 * Only active under the 'neon-blue' theme. Composes with the Tech Hex
 * Grid via `mix-blend-mode: screen` so it never fights the HUD.
 *
 * Interactivity:
 *   - Sigil fades in when a leader is assigned.
 *   - Score change triggers a 1.5s flash on that half.
 *   - Timer entering critical (≤15 min) keeps the beam slightly brighter
 *     on both halves until reset/restart.
 */
export function AffiliationBackdrop() {
  const {
    theme,
    leaderLeft,
    leaderRight,
    scoreLeft,
    scoreRight,
    timerRemaining,
    timerRunning,
  } = useMcpStore();

  const [flashLeft, setFlashLeft] = useState(false);
  const [flashRight, setFlashRight] = useState(false);
  const prevScoreLeft = useRef(scoreLeft);
  const prevScoreRight = useRef(scoreRight);

  useEffect(() => {
    if (scoreLeft !== prevScoreLeft.current) {
      prevScoreLeft.current = scoreLeft;
      setFlashLeft(true);
      const t = setTimeout(() => setFlashLeft(false), 1500);
      return () => clearTimeout(t);
    }
  }, [scoreLeft]);

  useEffect(() => {
    if (scoreRight !== prevScoreRight.current) {
      prevScoreRight.current = scoreRight;
      setFlashRight(true);
      const t = setTimeout(() => setFlashRight(false), 1500);
      return () => clearTimeout(t);
    }
  }, [scoreRight]);

  if (theme !== 'neon-blue') return null;
  if (!leaderLeft && !leaderRight) return null;

  const critical = timerRunning && timerRemaining <= 15 * 60;
  const fxLeft = leaderLeft ? getAffiliationFx(leaderLeft.affiliations) : null;
  const fxRight = leaderRight ? getAffiliationFx(leaderRight.affiliations) : null;

  const halfClasses = (flashing: boolean) =>
    `affiliation-backdrop__half ${flashing ? 'is-flashing' : ''} ${critical ? 'is-critical' : ''}`;

  return (
    <div className="affiliation-backdrop" aria-hidden="true">
      <div className={`${halfClasses(flashLeft)} affiliation-backdrop__half--left`}>
        {fxLeft && (
          <Half fx={fxLeft} affiliation={leaderLeft!.affiliations[0]} side="left" />
        )}
      </div>
      <div className={`${halfClasses(flashRight)} affiliation-backdrop__half--right`}>
        {fxRight && (
          <Half fx={fxRight} affiliation={leaderRight!.affiliations[0]} side="right" />
        )}
      </div>
    </div>
  );
}

function Half({ fx, side }: { fx: AffiliationFx; affiliation?: string; side: 'left' | 'right' }) {
  const style = { '--fx-color': fx.color } as CSSProperties;
  return (
    <>
      <div className="affiliation-backdrop__beam" style={style} />
      <div className="affiliation-backdrop__sigil" style={style}>
        <SigilSvg fx={fx} />
      </div>
      <div className={`affiliation-backdrop__stamp affiliation-backdrop__stamp--${side}`} style={{ color: fx.color, borderColor: fx.color }}>
        <span className="affiliation-backdrop__stamp-label">AFFIL · {side === 'left' ? 'P1' : 'P2'}</span>
        <span className="affiliation-backdrop__stamp-val">{fx.name}</span>
      </div>
    </>
  );
}

function SigilSvg({ fx }: { fx: AffiliationFx }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" style={{ color: fx.color }}>
      <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 5" opacity="0.6" />
      <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
      {fx.customGlyph ? (
        <g dangerouslySetInnerHTML={{ __html: fx.customGlyph }} />
      ) : (
        <text
          x="100"
          y="120"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="Orbitron, system-ui, sans-serif"
          fontSize="62"
          fontWeight={900}
          letterSpacing="-2"
        >
          {fx.glyph}
        </text>
      )}
      <text
        x="100"
        y="178"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Orbitron, system-ui, sans-serif"
        fontSize="10"
        letterSpacing="2.5"
        fontWeight={700}
        opacity="0.9"
      >
        {fx.name}
      </text>
    </svg>
  );
}
