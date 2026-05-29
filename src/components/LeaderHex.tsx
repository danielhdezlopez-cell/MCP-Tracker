import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { HexPortrait } from './HexPortrait';
import { getAffiliationFx, type AffiliationFx } from '../data/affiliationsFx';
import './LeaderHex.css';

interface LeaderHexProps {
  side: 'left' | 'right';
}

export function LeaderHex({ side }: LeaderHexProps) {
  const {
    leaderLeft, leaderRight,
    setCurrentPage, setPendingLeaderAssign,
    theme, scoreLeft, scoreRight,
  } = useMcpStore();

  const leader = side === 'left' ? leaderLeft : leaderRight;
  const score  = side === 'left' ? scoreLeft  : scoreRight;

  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      prevScore.current = score;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [score]);

  const handleClick = () => {
    setPendingLeaderAssign(side);
    setCurrentPage('leaders');
  };

  const fx = theme === 'neon-blue' && leader
    ? getAffiliationFx(leader.affiliations)
    : null;

  return (
    <div className={`leader-hex leader-hex--${side}${!leader ? ' leader-hex--empty' : ''}`} onClick={handleClick}>
      <div className="leader-hex__portrait-wrap">
        {fx && <LeaderSigil fx={fx} flash={flash} />}
        {theme === 'comic-ink' && leader && (
          <div className={`leader-hex__comic-burst leader-hex__comic-burst--${side}`} />
        )}
        <div className="leader-hex__corner leader-hex__corner--tl" />
        <div className="leader-hex__corner leader-hex__corner--tr" />
        <div className="leader-hex__corner leader-hex__corner--bl" />
        <div className="leader-hex__corner leader-hex__corner--br" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HexPortrait
            image={leader?.image ?? null}
            name={leader?.name ?? ''}
            variant={side}
            cssSize="clamp(130px, 18.2vw, 208px)"
            empty={!leader}
          />
        </div>
      </div>
      {!leader && (
        <div className={`leader-hex__assign-hint leader-hex__assign-hint--${side}`}>TAP · ASSIGN</div>
      )}
    </div>
  );
}

function LeaderSigil({ fx, flash }: { fx: AffiliationFx; flash: boolean }) {
  const style = { '--fx-color': fx.color } as CSSProperties;
  return (
    <div className={`leader-hex__sigil${flash ? ' is-flashing' : ''}`} style={style}>
      <svg viewBox="0 0 200 200" fill="none" style={{ color: fx.color }}>
        <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="2" opacity="0.9" />
        <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 5" opacity="0.6" />
        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
        {fx.customGlyph ? (
          <g dangerouslySetInnerHTML={{ __html: fx.customGlyph }} />
        ) : (
          <text
            x="100" y="120"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="Orbitron, system-ui, sans-serif"
            fontSize="62" fontWeight={900} letterSpacing="-2"
          >
            {fx.glyph}
          </text>
        )}
        <text
          x="100" y="178"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="Orbitron, system-ui, sans-serif"
          fontSize="10" letterSpacing="2.5" fontWeight={700} opacity="0.9"
        >
          {fx.name}
        </text>
      </svg>
    </div>
  );
}
