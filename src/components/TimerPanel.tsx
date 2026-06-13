import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useMcpStore, getTimerRemaining } from '../store/useMcpStore';
import './TimerPanel.css';

const LONG_PRESS_MS = 500;
const CRITICAL_S = 15 * 60;
const TICK_MS = 250; // sampling rate; re-render only happens when the displayed second changes

function formatTime(seconds: number): { m: string; s: string } {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return { m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') };
}

/**
 * Remaining seconds, derived from the store's deadline timestamp.
 * While running, an interval samples the clock every TICK_MS; React only
 * re-renders when the integer second actually changes. The store itself is
 * only written on start/pause/expire — never per second.
 */
function useTimerRemaining(running: boolean): number {
  const subscribe = useCallback((onTick: () => void) => {
    if (!running) return () => {};
    const id = setInterval(onTick, TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  return useSyncExternalStore(
    subscribe,
    () => getTimerRemaining(useMcpStore.getState()),
  );
}

export function TimerPanel({ onResetRequest }: { onResetRequest?: () => void }) {
  const timerEndsAt      = useMcpStore(s => s.timerEndsAt);
  const timerDuration    = useMcpStore(s => s.timerDuration);
  const toggleTimer      = useMcpStore(s => s.toggleTimer);
  const pauseTimer       = useMcpStore(s => s.pauseTimer);
  const setTimerCritical = useMcpStore(s => s.setTimerCritical);

  const timerRunning = timerEndsAt !== null;
  const remaining = useTimerRemaining(timerRunning);

  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFiredRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pressStartRef = useRef<number>(0);
  const [resetProgress, setResetProgress] = useState(0); // 0..1

  // Deadline reached → settle the store into "expired, paused at 0"
  useEffect(() => {
    if (timerRunning && remaining <= 0) pauseTimer(0);
  }, [timerRunning, remaining, pauseTimer]);

  const isExpired = remaining <= 0;
  const isCritical = remaining <= CRITICAL_S;
  const isPaused = !timerRunning && remaining > 0 && remaining < timerDuration;
  const stateClass = isExpired ? 'expired' : isCritical ? 'critical' : '';

  useEffect(() => {
    const critical = isCritical && timerRunning;
    setTimerCritical(critical);
    if (critical) {
      document.body.dataset.timerState = 'critical';
    } else {
      delete document.body.dataset.timerState;
    }
    return () => { delete document.body.dataset.timerState; };
  }, [isCritical, timerRunning, setTimerCritical]);

  const cancelLongPress = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    longFiredRef.current = false;
    setResetProgress(0);
  };

  const tickProgress = () => {
    const elapsed = Date.now() - pressStartRef.current; // eslint-disable-line react-hooks/purity
    const p = Math.min(elapsed / LONG_PRESS_MS, 1);
    setResetProgress(p);
    if (p < 1) {
      rafRef.current = requestAnimationFrame(tickProgress);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Only left button / primary touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    longFiredRef.current = false;
    pressStartRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tickProgress);
    longPressRef.current = setTimeout(() => {
      longFiredRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setResetProgress(0);
      onResetRequest?.();
      if ('vibrate' in navigator) navigator.vibrate(40);
    }, LONG_PRESS_MS);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasFired = longFiredRef.current;
    cancelLongPress();
    if (!wasFired) {
      // Short tap — toggle timer
      if (remaining > 0) toggleTimer();
    }
    e.preventDefault();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (remaining > 0) toggleTimer();
    }
  };

  const { m, s } = formatTime(remaining);

  // SVG ring progress
  const R = 46;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC * resetProgress;

  return (
    <>
      <div
        className={[
          'timer-panel panel clip-panel-sm',
          isCritical ? 'timer-panel--critical' : '',
          isPaused ? 'timer-panel--paused' : '',
          resetProgress > 0 ? 'timer-panel--pressing' : '',
        ].filter(Boolean).join(' ')}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label={timerRunning ? 'Pause timer' : 'Start or pause timer'}
        aria-pressed={timerRunning}
      >
        <div className="timer-panel__deco" />
        {resetProgress > 0 && (
          <svg className="timer-panel__reset-ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke="rgba(255,80,60,0.25)"
              strokeWidth="4"
            />
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke="#ff4c3b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              strokeDashoffset={CIRC / 4}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,70,50,0.9))' }}
            />
          </svg>
        )}
        <div className="timer-panel__display-wrap">
          <div className={`timer-panel__display ${stateClass}${isPaused ? ' timer-panel__display--paused' : ''}`} aria-label={`${m}:${s}`}>
            <span className="timer-panel__digits">
              <span className="timer-panel__min">{m}</span>
              <span className="timer-panel__colon">:</span>
              <span className="timer-panel__sec">{s}</span>
            </span>
            {isPaused && (
              <span className="timer-panel__pause-icon" aria-hidden="true">⏸</span>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
