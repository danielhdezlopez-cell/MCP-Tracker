import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMcpStore, getThemeFromLeader } from '../store/useMcpStore';
import { RoundTracker } from '../components/RoundTracker';
import { MissionSlot } from '../components/MissionSlot';
import { TimerPanel } from '../components/TimerPanel';
import { VSBackground } from '../components/VSBackground';
import { KangChronalModal } from '../components/KangChronalModal';
import { NavIconSettings } from '../components/icons';
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

function HudScore({ side }: { side: 'left' | 'right' }) {
  const { scoreLeft, scoreRight, setScoreLeft, setScoreRight, leaderLeft, leaderRight } = useMcpStore();
  const score    = side === 'left' ? scoreLeft  : scoreRight;
  const setScore = side === 'left' ? setScoreLeft : setScoreRight;
  const leader   = side === 'left' ? leaderLeft  : leaderRight;
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
}

function VSPortrait({ side }: { side: 'left' | 'right' }) {
  const { leaderLeft, leaderRight, setCurrentPage, setPendingLeaderAssign } = useMcpStore();
  const leader = side === 'left' ? leaderLeft : leaderRight;

  const handleClick = () => {
    setPendingLeaderAssign(side);
    setCurrentPage('leaders');
  };

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
}

interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
}
interface WebkitElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
}

export function MainPage() {
  const { leaderLeft, leaderRight, resetGame, setCurrentPage } = useMcpStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const wkDoc = document as WebkitDocument;
    const onChange = () => setIsFullscreen(
      !!(document.fullscreenElement || wkDoc.webkitFullscreenElement)
    );
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const el = document.documentElement as WebkitElement;
      const wkDoc = document as WebkitDocument;
      const isFs = !!(document.fullscreenElement || wkDoc.webkitFullscreenElement);
      if (!isFs) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (wkDoc.webkitExitFullscreen) wkDoc.webkitExitFullscreen();
      }
    } catch { /* silent */ }
  };

  const handleReset = () => { resetGame(); setShowReset(false); };

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
          <RoundTracker />
        </div>
        <div className="vs-hud__side vs-hud__side--right">
          <HudScore side="right" />
          <div className="vs-hud__edge vs-hud__edge--right" />
        </div>
        <div className="vs-hud__ctrl-strip">
          <button className="vs-ctrl vs-ctrl--fullscreen" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            {isFullscreen ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
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
        <div className="vs-battle__timer">
          <TimerPanel />
        </div>
        <div className="vs-battle__side vs-battle__side--left">
          <VSPortrait side="left" />
        </div>
        <div className="vs-battle__sep">
          <div className="vs-sep__vbeam vs-sep__vbeam--top" aria-hidden="true" />
          <button
            className="vs-sep__circle"
            onClick={() => setShowReset(true)}
            title="Reset match"
            aria-label="Reset match"
          >
            <span className="vs-sep__text" aria-hidden="true">VS</span>
          </button>
          <div className="vs-sep__vbeam vs-sep__vbeam--bot" aria-hidden="true" />
        </div>
        <div className="vs-battle__side vs-battle__side--right">
          <VSPortrait side="right" />
        </div>
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
              <button className="btn-hud btn-accent-right" onClick={handleReset}>CONFIRM RESET</button>
              <button className="btn-hud" onClick={() => setShowReset(false)}>CANCEL</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
