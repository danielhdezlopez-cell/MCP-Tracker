import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMcpStore, getThemeFromLeader } from '../store/useMcpStore';
import { RoundMedallion } from '../components/RoundMedallion';
import { MissionSlot } from '../components/MissionSlot';
import { TimerPanel } from '../components/TimerPanel';
import { VSBackground } from '../components/VSBackground';
import { KangChronalModal } from '../components/KangChronalModal';
import { NavIconSettings } from '../components/icons';
import { AffiliationBanner } from '../components/AffiliationBanner';
import { useIdleDetection } from '../hooks/useIdleDetection';
import { usePageVisibility } from '../hooks/usePageVisibility';
import { useWakeLock } from '../hooks/useWakeLock';
import { ScoreProgressIndicator } from '../components/ScoreProgressIndicator';
import RoundBackground from '../components/RoundBackground';
import './MainPage.css';

const MAX_SCORE = 20;
const VICTORY_THRESHOLD = 16;

function tierOf(s: number): 0 | 1 | 2 | 3 | 4 {
  if (s >= 16) return 4;
  if (s >= 12) return 3;
  if (s >= 8)  return 2;
  if (s >= 4)  return 1;
  return 0;
}

const HudScore = memo(function HudScore({ side }: { side: 'left' | 'right' }) {
  const score    = useMcpStore(s => side === 'left' ? s.scoreLeft  : s.scoreRight);
  const setScore = useMcpStore(s => side === 'left' ? s.setScoreLeft : s.setScoreRight);
  const leader   = useMcpStore(s => side === 'left' ? s.leaderLeft  : s.leaderRight);
  const isVictory = score >= VICTORY_THRESHOLD;
  const tier      = tierOf(score);
  const [delta, setDelta] = useState<{ val: number; key: number } | null>(null);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      const d = score - prevScore.current;
      prevScore.current = score;
      setDelta({ val: d, key: Date.now() });
      const t = setTimeout(() => setDelta(null), 750);
      return () => clearTimeout(t);
    }
  }, [score]);

  const playerLabel = leader ? leader.name.toUpperCase() : (side === 'left' ? 'PLAYER 1' : 'PLAYER 2');
  const inc = () => setScore(Math.min(score + 1, MAX_SCORE));
  const dec = () => setScore(Math.max(score - 1, 0));

  return (
    <div className={`hud-score hud-score--${side}`} data-tier={tier} data-victory={isVictory ? '1' : '0'}>
      {side === 'left' && (
        <div className="hud-score__name hud-score__name--left" title={playerLabel}>{playerLabel}</div>
      )}
      <div className="hud-score__controls">
        <button className={`hud-score__btn hud-score__btn--dec hud-score__btn--${side}`} onClick={dec} disabled={score <= 0} aria-label="Decrease score">−</button>
        <div className="hud-score__val-wrap">
          <span className={`hud-score__val hud-score__val--${side}`}>{score}</span>
          {delta !== null && (
            <span key={delta.key} className={`hud-score__delta hud-score__delta--${side}`}>
              {delta.val > 0 ? `+${delta.val}` : delta.val}
            </span>
          )}
          {isVictory && <div className="hud-score__victory">VICTORY</div>}
        </div>
        <button className={`hud-score__btn hud-score__btn--inc hud-score__btn--${side}`} onClick={inc} disabled={score >= MAX_SCORE} aria-label="Increase score">+</button>
      </div>
      {side === 'right' && (
        <div className="hud-score__name hud-score__name--right" title={playerLabel}>{playerLabel}</div>
      )}
    </div>
  );
});

const VSPortrait = memo(function VSPortrait({ side, showPortrait }: { side: 'left' | 'right'; showPortrait: boolean }) {
  const leader                 = useMcpStore(s => side === 'left' ? s.leaderLeft : s.leaderRight);
  const setCurrentPage         = useMcpStore(s => s.setCurrentPage);
  const setPendingLeaderAssign = useMcpStore(s => s.setPendingLeaderAssign);

  const handleClick = () => {
    setPendingLeaderAssign(side);
    setCurrentPage('leaders');
  };

  if (!showPortrait) {
    return (
      <div
        className={`vs-portrait vs-portrait--${side} vs-portrait--hidden`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
        aria-label={leader ? `Change leader: ${leader.name}` : `Assign ${side === 'left' ? 'Player 1' : 'Player 2'} leader`}
      />
    );
  }

  return (
    <div
      className={`vs-portrait vs-portrait--${side}${!leader ? ' vs-portrait--empty' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      aria-label={leader ? `Change leader: ${leader.name}` : `Assign ${side === 'left' ? 'Player 1' : 'Player 2'} leader`}
    >
      {leader ? (
        <>
          <img src={leader.image ?? ''} alt={leader.name} className="vs-portrait__img" draggable={false} />
          <div className={`vs-portrait__name vs-portrait__name--${side}`}>{leader.name.toUpperCase()}</div>
        </>
      ) : (
        <div className="vs-portrait__empty">
          <div className="vs-portrait__plus">+</div>
          <div className="vs-portrait__hint">TAP · ASSIGN</div>
        </div>
      )}
    </div>
  );
});

export function MainPage() {
  const scoreLeft     = useMcpStore(s => s.scoreLeft);
  const scoreRight    = useMcpStore(s => s.scoreRight);
  const leaderLeft    = useMcpStore(s => s.leaderLeft);
  const leaderRight   = useMcpStore(s => s.leaderRight);
  const resetGame     = useMcpStore(s => s.resetGame);
  const setCurrentPage = useMcpStore(s => s.setCurrentPage);
  const showMainLeaderPortraits    = useMcpStore(s => s.showMainLeaderPortraits);
  const setShowMainLeaderPortraits = useMcpStore(s => s.setShowMainLeaderPortraits);
  const round = useMcpStore(s => s.round);
  const [showReset, setShowReset] = useState(false);

  useIdleDetection();
  usePageVisibility();
  useWakeLock();

  const themeLeft  = leaderLeft  ? getThemeFromLeader(leaderLeft)  : null;
  const themeRight = leaderRight ? getThemeFromLeader(leaderRight) : null;

  return (
    <div className="vs-main">
      {/* ── TOP HUD ── */}
      <div className="vs-hud">
        <div className="vs-hud__side vs-hud__side--left">
          <div className="vs-hud__edge vs-hud__edge--left" />
          <HudScore side="left" />
        </div>
        <div className="vs-hud__center">
          <ScoreProgressIndicator player1Score={scoreLeft} player2Score={scoreRight} />
        </div>
        <div className="vs-hud__side vs-hud__side--right">
          <HudScore side="right" />
          <div className="vs-hud__edge vs-hud__edge--right" />
        </div>
        <div className="vs-hud__ctrl-strip">
          <button
            className={`vs-ctrl${showMainLeaderPortraits ? '' : ' vs-ctrl--inactive'}`}
            onClick={() => setShowMainLeaderPortraits(!showMainLeaderPortraits)}
            title={showMainLeaderPortraits ? 'Hide portraits' : 'Show portraits'}
            aria-label={showMainLeaderPortraits ? 'Hide leader portraits' : 'Show leader portraits'}
          >
            {showMainLeaderPortraits ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
          <button className="vs-ctrl" onClick={() => setCurrentPage('settings')} title="Settings" aria-label="Settings">
            <NavIconSettings width="15" height="15" />
          </button>
        </div>
      </div>

      {/* ── BATTLE AREA ── */}
      <div className="vs-battle">
        <VSBackground themeLeft={themeLeft} themeRight={themeRight} />
        <RoundBackground round={round} />
        <div className="vs-battle__timer">
          <TimerPanel onResetRequest={() => setShowReset(true)} />
        </div>
        <div className="vs-battle__side vs-battle__side--left">
          <VSPortrait side="left" showPortrait={showMainLeaderPortraits} />
          <AffiliationBanner side="left" />
        </div>
        <div className="vs-battle__side vs-battle__side--right">
          <VSPortrait side="right" showPortrait={showMainLeaderPortraits} />
          <AffiliationBanner side="right" />
        </div>
        <RoundMedallion />
      </div>

      {/* ── MISSION BAR ── */}
      <div className="vs-missions">
        <MissionSlot type="Secure" />
        <MissionSlot type="Extract" />
      </div>

      <KangChronalModal />

      {showReset && createPortal(
        <div className="vs-modal-overlay" onClick={() => setShowReset(false)}>
          <div className="vs-modal panel clip-panel" onClick={e => e.stopPropagation()}>
            <div className="vs-modal__title">RESET GAME?</div>
            <div className="vs-modal__body">All scores, leaders, missions and the timer will be cleared.</div>
            <div className="vs-modal__actions">
              <button className="btn-hud btn-accent-right" onClick={() => { resetGame(); setShowReset(false); }}>CONFIRM RESET</button>
              <button className="btn-hud" onClick={() => setShowReset(false)}>CANCEL</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
