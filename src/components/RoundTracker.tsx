import { useMcpStore } from '../store/useMcpStore';
import './RoundTracker.css';

export function RoundTracker() {
  const {
    round, setRound,
    kangLeftTimestreamRound,
    kangRightTimestreamRound,
  } = useMcpStore();

  return (
    <div className="round-tracker panel clip-panel-sm">
      <div className="round-tracker__pips">
        {Array.from({ length: 6 }, (_, i) => {
          const pipNum = i + 1;
          const hasLeft = kangLeftTimestreamRound === pipNum;
          const hasRight = kangRightTimestreamRound === pipNum;
          return (
            <button
              key={i}
              className={`round-tracker__pip ${pipNum <= round ? 'active' : ''} ${pipNum === round ? 'current' : ''}`}
              onClick={() => setRound(pipNum)}
              aria-label={`Round ${pipNum}`}
            >
              <span className="round-tracker__pip-num">{pipNum}</span>
              {(hasLeft || hasRight) && (
                <span className={`round-tracker__ts-badge ${hasLeft && hasRight ? 'round-tracker__ts-badge--both' : hasLeft ? 'round-tracker__ts-badge--left' : 'round-tracker__ts-badge--right'}`}>
                  TS
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
