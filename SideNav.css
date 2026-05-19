import { useMcpStore } from '../store/useMcpStore';
import './RoundTracker.css';

export function RoundTracker() {
  const { round, setRound } = useMcpStore();

  return (
    <div className="round-tracker panel clip-panel-sm">
      <div className="round-tracker__pips">
        {Array.from({ length: 6 }, (_, i) => (
          <button
            key={i}
            className={`round-tracker__pip ${i + 1 <= round ? 'active' : ''} ${i + 1 === round ? 'current' : ''}`}
            onClick={() => setRound(i + 1)}
            aria-label={`Round ${i + 1}`}
          >
            <span className="round-tracker__pip-num">{i + 1}</span>
          </button>
        ))}
      </div>
      <div className="round-tracker__controls">
        <button
          className="btn-hud round-tracker__ctrl"
          onClick={() => setRound(round - 1)}
          disabled={round <= 1}
          aria-label="Previous round"
        >
          ◀
        </button>
        <span className="round-tracker__current">{round} / 6</span>
        <button
          className="btn-hud round-tracker__ctrl"
          onClick={() => setRound(round + 1)}
          disabled={round >= 6}
          aria-label="Next round"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
