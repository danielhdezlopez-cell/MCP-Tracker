import { useEffect, useRef, useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import './ScorePanel.css';

const MAX_SCORE = 20;
const VICTORY_THRESHOLD = 16;
const RING_SEGMENTS = 16;

function tierOf(score: number): 0 | 1 | 2 | 3 | 4 {
  if (score >= 16) return 4;
  if (score >= 12) return 3;
  if (score >= 8)  return 2;
  if (score >= 4)  return 1;
  return 0;
}

interface SegmentedRingProps {
  litCount: number;
  segments: number;
}

function SegmentedRing({ litCount, segments }: SegmentedRingProps) {
  const cx = 80, cy = 80, r = 70, gap = 3;
  const segAngle = (2 * Math.PI) / segments;
  const gapAngle = gap / r;

  return (
    <svg className="score-panel__ring-svg" viewBox="0 0 160 160" aria-hidden="true">
      {Array.from({ length: segments }, (_, i) => {
        const startAngle = -Math.PI / 2 + i * segAngle + gapAngle / 2;
        const endAngle   = -Math.PI / 2 + (i + 1) * segAngle - gapAngle / 2;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const d = `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`;
        const isLit = i < litCount;
        return (
          <path
            key={i}
            d={d}
            className={`score-panel__ring-seg${isLit ? ' score-panel__ring-seg--lit' : ''}`}
          />
        );
      })}
    </svg>
  );
}

interface ScorePanelProps {
  side: 'left' | 'right';
}

export function ScorePanel({ side }: ScorePanelProps) {
  const { scoreLeft, scoreRight, setScoreLeft, setScoreRight } = useMcpStore();

  const score    = side === 'left' ? scoreLeft  : scoreRight;
  const setScore = side === 'left' ? setScoreLeft : setScoreRight;
  const label    = side === 'left' ? 'PORONGA ARENOSA' : 'PLAYER 2';

  const increment = () => setScore(Math.min(score + 1, MAX_SCORE));
  const decrement = () => setScore(Math.max(score - 1, 0));

  const percentage = (score / MAX_SCORE) * 100;
  const tier       = tierOf(score);
  const isVictory  = score >= VICTORY_THRESHOLD;

  const [delta, setDelta] = useState<{ val: number; key: number } | null>(null);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      const d = score - prevScoreRef.current;
      prevScoreRef.current = score;
      setDelta({ val: d, key: Date.now() });
      const t = setTimeout(() => setDelta(null), 750);
      return () => clearTimeout(t);
    }
  }, [score]);

  return (
    <div
      className={`score-panel panel clip-panel glow-${side}`}
      data-tier={tier}
      data-victory={isVictory ? '1' : '0'}
    >
      <div className="score-panel__label label-hud">{label}</div>

      <div className="score-panel__value-wrap">
        <div className="score-panel__ring" aria-hidden="true">
          <SegmentedRing litCount={Math.min(score, RING_SEGMENTS)} segments={RING_SEGMENTS} />
        </div>
        <div
          className="score-panel__value"
          style={{
            '--score-scale': `${1 + (score / MAX_SCORE) * 0.12}`,
            '--glow-intensity': `${score / MAX_SCORE}`,
          } as React.CSSProperties}
        >{score}</div>
        {delta !== null && (
          <div key={delta.key} className={`score-panel__delta score-panel__delta--${side}`}>
            {delta.val > 0 ? `+${delta.val}` : delta.val}
          </div>
        )}
      </div>

      {isVictory && (
        <div className="score-panel__victory">VICTORY</div>
      )}

      <div className="score-panel__bar">
        <div
          className={`score-panel__bar-fill score-panel__bar-fill--${side}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="score-panel__controls">
        <button
          className={`btn-hud score-panel__btn score-panel__btn--minus btn-accent-${side}`}
          onClick={decrement}
          disabled={score <= 0}
          aria-label="Decrease score"
        >
          −
        </button>
        <button
          className={`btn-hud score-panel__btn score-panel__btn--plus btn-accent-${side}`}
          onClick={increment}
          disabled={score >= MAX_SCORE}
          aria-label="Increase score"
        >
          +
        </button>
      </div>
    </div>
  );
}
