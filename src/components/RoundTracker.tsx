import { useMcpStore } from '../store/useMcpStore';
import './RoundTracker.css';

export function RoundTracker() {
  const { round, setRound } = useMcpStore();

  return (
    <div className="round-tracker panel clip-panel-sm">
      <button
        className="btn-hud round-tracker__ctrl"
        onClick={() => setRound(round - 1)}
        disabled={round <= 1}
        aria-label="Previous round"
      >◀</button>

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

      <button
        className="btn-hud round-tracker__ctrl"
        onClick={() => setRound(round + 1)}
        disabled={round >= 6}
        aria-label="Next round"
      >▶</button>

      <div className="round-tracker__badge">
        <span className="round-tracker__badge-label">RND</span>
        <span className="round-tracker__badge-num">{round}</span>
      </div>
    </div>
  );
}
