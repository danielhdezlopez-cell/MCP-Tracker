import { useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { ScorePanel } from '../components/ScorePanel';
import { LeaderHex } from '../components/LeaderHex';
import { RoundTracker } from '../components/RoundTracker';
import { MissionSlot } from '../components/MissionSlot';
import { TimerPanel } from '../components/TimerPanel';
import './MainPage.css';

export function MainPage() {
  const { selectedBackground, resetGame } = useMcpStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetGame();
    setShowConfirm(false);
  };

  return (
    <div
      className="main-page"
      style={selectedBackground ? {
        backgroundImage: `url(${selectedBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {selectedBackground && <div className="main-page__bg-overlay" />}

      {/* TOP ROW: Timer + Reset */}
      <div className="main-page__top">
        <div className="main-page__top-left" />
        <TimerPanel />
        <div className="main-page__top-right">
          <button
            className="btn-hud main-page__reset-btn"
            onClick={() => setShowConfirm(true)}
          >
            ↺ RESET
          </button>
        </div>
      </div>

      {/* MAIN ROW: Score + Leaders + Score */}
      <div className="main-page__middle">
        <ScorePanel side="left" />

        <div className="main-page__center">
          <LeaderHex side="left" />
          <RoundTracker />
          <LeaderHex side="right" />
        </div>

        <ScorePanel side="right" />
      </div>

      {/* BOTTOM ROW: Mission Slots */}
      <div className="main-page__bottom">
        <MissionSlot type="Secure" />
        <MissionSlot type="Extract" />
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirm && (
        <div className="main-page__modal-overlay">
          <div className="main-page__modal panel clip-panel">
            <div className="main-page__modal-title">RESET GAME?</div>
            <div className="main-page__modal-body">
              This will reset all scores, leaders, missions and timer.
            </div>
            <div className="main-page__modal-actions">
              <button className="btn-hud btn-accent-right" onClick={handleReset}>
                CONFIRM RESET
              </button>
              <button className="btn-hud" onClick={() => setShowConfirm(false)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
