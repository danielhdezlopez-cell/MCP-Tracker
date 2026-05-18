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
    <div className={`score-panel panel clip-panel glow-${side}`}>
      <div className="score-panel__label label-hud">{label}</div>
      <div className="score-panel__value">{score}</div>
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
          disabled={score >= 20}
          aria-label="Increase score"
        >
          +
        </button>
      </div>
    </div>
  );
}
