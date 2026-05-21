import { useEffect, useRef, useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import './TimerPanel.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TimerPanel() {
  const { timerRemaining, timerRunning, timerDuration, setTimerRemaining, setTimerRunning } = useMcpStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerRemaining(useMcpStore.getState().timerRemaining - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRemaining <= 0 && timerRunning) {
        setTimerRunning(false);
        setExpired(true);
        if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning, timerRemaining]);

  const isCritical = timerRemaining <= 15 * 60;
  const isPaused = !timerRunning && timerRemaining > 0 && timerRemaining < timerDuration;
  const stateClass = isCritical ? 'critical' : '';

  useEffect(() => {
    if (isCritical && timerRunning) {
      document.body.dataset.timerState = 'critical';
    } else {
      delete document.body.dataset.timerState;
    }
    return () => { delete document.body.dataset.timerState; };
  }, [isCritical, timerRunning]);

  const handleToggle = () => {
    if (timerRemaining > 0) setTimerRunning(!timerRunning);
  };

  return (
    <>
      <div
        className={[
          'timer-panel panel clip-panel-sm',
          isCritical ? 'timer-panel--critical' : '',
          isPaused ? 'timer-panel--paused' : '',
        ].filter(Boolean).join(' ')}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
        role="button"
        tabIndex={0}
        aria-label={timerRunning ? 'Pause timer' : 'Start or pause timer'}
        aria-pressed={timerRunning}
      >
        <div className="timer-panel__deco" />
        <div className="timer-panel__display-wrap">
          <div className={`timer-panel__display ${stateClass}`}>
            {formatTime(timerRemaining)}
          </div>
        </div>
        {isPaused && <div className="timer-panel__paused-label">PAUSED</div>}
      </div>

      {expired && (
        <div className="timer-expired-overlay" onClick={() => setExpired(false)}>
          <div className="timer-expired-box panel clip-panel" onClick={e => e.stopPropagation()}>
            <div className="timer-expired-title">TIME'S UP!</div>
            <div className="timer-expired-body">The game clock has expired.</div>
            <button
              className="btn-hud btn-accent-right timer-expired-dismiss"
              onClick={() => setExpired(false)}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}
    </>
  );
}
