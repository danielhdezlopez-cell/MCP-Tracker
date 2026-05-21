import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMcpStore } from '../store/useMcpStore';
import { ScorePanel } from '../components/ScorePanel';
import { LeaderHex } from '../components/LeaderHex';
import { RoundTracker } from '../components/RoundTracker';
import { MissionSlot } from '../components/MissionSlot';
import { TimerPanel } from '../components/TimerPanel';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { AffiliationBackdrop } from '../components/AffiliationBackdrop';
import { NavIconSettings } from '../components/icons';
import { McpLogo } from '../components/McpLogo';
import './MainPage.css';

export function MainPage() {
  const { selectedBackground, interactiveBg, videoBg, resetGame, setCurrentPage } = useMcpStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

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

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(false);
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
      {videoBg === 'hydra' && (
        <video
          className="main-page__video-bg"
          src="/assets/videos/hydra.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      {(selectedBackground || videoBg !== 'none') && <div className="main-page__bg-overlay" />}
      <AnimatedBackground mode={interactiveBg} />
      <AffiliationBackdrop />

      {/* TOP ROW: spacer | Timer | fullscreen */}
      <div className="main-page__top">
        <div className="main-page__top-left">
          <McpLogo />
        </div>
        <div className="main-page__timer-wrap">
          <TimerPanel />
        </div>
        <div className="main-page__top-right">
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

      {/* BOTTOM ROW: [Reset] Mission Slots [Config] */}
      <div className="main-page__bottom">
        <button
          className="main-page__corner-btn main-page__corner-btn--reset"
          onClick={() => setShowResetConfirm(true)}
          title="Reset Game"
          aria-label="Reset Game"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
            <path d="M18.5 8.25 A7.5 7.5 0 1 1 12 4.5"/>
            <path d="M9 2.5 L12 4.5 L9 6.5"/>
          </svg>
        </button>

        <MissionSlot type="Secure" />
        <MissionSlot type="Extract" />

        <button
          className="main-page__corner-btn main-page__corner-btn--config"
          onClick={() => setCurrentPage('settings')}
          title="Config"
          aria-label="Config"
        >
          <NavIconSettings width="20" height="20" />
        </button>
      </div>

      {showResetConfirm && createPortal(
        <div className="side-nav__modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="side-nav__modal panel clip-panel" onClick={e => e.stopPropagation()}>
            <div className="side-nav__modal-title">RESET GAME?</div>
            <div className="side-nav__modal-body">
              This will reset all scores, leaders, missions and timer.
            </div>
            <div className="side-nav__modal-actions">
              <button className="btn-hud btn-accent-right" onClick={handleReset}>
                CONFIRM RESET
              </button>
              <button className="btn-hud" onClick={() => setShowResetConfirm(false)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
