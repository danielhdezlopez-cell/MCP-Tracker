import { useEffect, useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { ScorePanel } from '../components/ScorePanel';
import { LeaderHex } from '../components/LeaderHex';
import { RoundTracker } from '../components/RoundTracker';
import { MissionSlot } from '../components/MissionSlot';
import { TimerPanel } from '../components/TimerPanel';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AffiliationBackdrop } from '../components/AffiliationBackdrop';
import './MainPage.css';

export function MainPage() {
  const { selectedBackground, resetGame, interactiveBg } = useMcpStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const handleReset = () => {
    resetGame();
    setShowConfirm(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // fullscreen not supported or denied — silent fallback
    }
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
      <AnimatedBackground mode={interactiveBg} />
      <AffiliationBackdrop />

      {/* TOP ROW: spacer | Timer | reset + fullscreen */}
      <div className="main-page__top">
        <div className="main-page__top-spacer" />
        <TimerPanel />
        <div className="main-page__top-right">
          <button
            className="btn-hud main-page__reset-btn"
            onClick={() => setShowConfirm(true)}
            title="Reset Game"
          >
            ↺
          </button>
          <button
            className="btn-hud main-page__fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MAIN ROW: [banner | score-left] + leaders + [score-right | banner] */}
      <div className="main-page__middle">
        <div className="main-page__side-area main-page__side-area--left">
          <div className="main-page__banner main-page__banner--left">BANNER</div>
          <ScorePanel side="left" />
        </div>

        <div className="main-page__center">
          <LeaderHex side="left" />
          <LeaderHex side="right" />
        </div>

        <div className="main-page__side-area main-page__side-area--right">
          <ScorePanel side="right" />
          <div className="main-page__banner main-page__banner--right">BANNER</div>
        </div>
      </div>

      {/* ROUND TRACKER — centered above missions */}
      <div className="main-page__round">
        <RoundTracker />
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
