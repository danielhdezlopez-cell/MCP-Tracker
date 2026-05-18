import { useMcpStore } from '../store/useMcpStore';
import './ScorePanel.css';

interface ScorePanelProps {
  side: 'left' | 'right';
}

export function ScorePanel({ side }: ScorePanelProps) {
  const { scoreLeft, scoreRight, setScoreLeft, setScoreRight } = useMcpStore();

  const score = side === 'left' ? scoreLeft : scoreRight;
  const setScore = side === 'left' ? setScoreLeft : setScoreRight;
  const label = side === 'left' ? 'PLAYER 1' : 'PLAYER 2';

  const increment = () => setScore(score + 1);
  const decrement = () => setScore(score - 1);

  const percentage = (score / 20) * 100;

  return (
    <div className={`score-panel glow-${side}`}>
      {/* Top: header */}
      <div className={`score-panel__header score-panel__header--${side}`}>
        <span className="score-panel__label label-hud">{label}</span>
      </div>

      {/* Score display */}
      <div className="score-panel__body">
        <div className={`score-panel__value text-accent-${side}`}>
          {String(score).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div className="score-panel__bar-wrap">
          <div className="score-panel__bar">
            <div
              className={`score-panel__bar-fill score-panel__bar-fill--${side}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="score-panel__bar-labels">
            <span className="score-panel__bar-min label-hud">0</span>
            <span className="score-panel__bar-max label-hud">20</span>
          </div>
        </div>

        {/* Score pips row */}
        <div className="score-panel__pips">
          {Array.from({ length: 20 }, (_, i) => (
            <button
              key={i}
              className={`score-panel__pip score-panel__pip--${side} ${i < score ? 'filled' : ''} ${i + 1 === score ? 'current' : ''}`}
              onClick={() => setScore(i + 1 === score ? 0 : i + 1)}
              aria-label={`Set score to ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="score-panel__controls">
        <button
          className={`btn-hud score-panel__btn btn-accent-${side}`}
          onClick={decrement}
          disabled={score <= 0}
          aria-label="Decrease score"
        >
          −
        </button>
        <button
          className={`btn-hud score-panel__btn btn-accent-${side}`}
          onClick={increment}
          disabled={score >= 20}
          aria-label="Increase score"
        >
          +
        </button>
      </div>
    </div>
  );
}
