import { useMcpStore } from '../store/useMcpStore';
import './RoundTracker.css';

export function RoundTracker() {
  const {
    round, setRound,
    kangLeftChronalRound, kangRightChronalRound,
    kangLeftTrustRound, kangRightTrustRound,
  } = useMcpStore();

  return (
    <div className="round-tracker panel clip-panel-sm">
      <div className="round-tracker__pips">
        {Array.from({ length: 6 }, (_, i) => {
          const pipNum = i + 1;

          // TS (Timestream / Chronal Manipulation) badges
          const tsLeft  = kangLeftChronalRound  === pipNum;
          const tsRight = kangRightChronalRound === pipNum;
          // TN (Trust No One But Yourself) badges
          const tnLeft  = kangLeftTrustRound  === pipNum;
          const tnRight = kangRightTrustRound === pipNum;

          const hasBadges = tsLeft || tsRight || tnLeft || tnRight;

          return (
            <button
              key={i}
              className={`round-tracker__pip ${pipNum <= round ? 'active' : ''} ${pipNum === round ? 'current' : ''} ${hasBadges ? 'round-tracker__pip--has-badges' : ''}`}
              onClick={() => setRound(pipNum)}
              aria-label={`Round ${pipNum}`}
            >
              <span className="round-tracker__pip-num">{pipNum}</span>

              {hasBadges && (
                <div className="round-tracker__badges">
                  {(tsLeft || tsRight) && (
                    <span
                      className={`round-tracker__badge round-tracker__badge--ts ${tsLeft && tsRight ? 'round-tracker__badge--both' : tsLeft ? 'round-tracker__badge--left' : 'round-tracker__badge--right'}`}
                      title="Timestream – Chronal Manipulation"
                    >
                      TS
                    </span>
                  )}
                  {(tnLeft || tnRight) && (
                    <span
                      className={`round-tracker__badge round-tracker__badge--tn ${tnLeft && tnRight ? 'round-tracker__badge--both' : tnLeft ? 'round-tracker__badge--left' : 'round-tracker__badge--right'}`}
                      title="Trust – Trust No One But Yourself"
                    >
                      TN
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
