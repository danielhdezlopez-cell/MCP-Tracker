import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerRemaining(useMcpStore.getState().timerRemaining - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRemaining <= 0 && timerRunning) {
        setTimerRunning(false);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning, timerRemaining]);

  const isCritical = timerRemaining <= 15 * 60;
  const stateClass = isCritical ? 'critical' : '';

  // Sync body flag so other components (score-bar shimmer, scan-line) can
  // pause their animations while the timer is in critical state (audit P2-02).
  useEffect(() => {
    if (isCritical && timerRunning) {
      document.body.dataset.timerState = 'critical';
    } else {
      delete document.body.dataset.timerState;
    }
    return () => { delete document.body.dataset.timerState; };
  }, [isCritical, timerRunning]);

  const handleReset = () => {
    setTimerRunning(false);
    setTimerRemaining(timerDuration);
  };

  return (
    <div className={`timer-panel panel clip-panel-sm${isCritical ? ' timer-panel--critical' : ''}`}>
      <div className="timer-panel__deco" />
      <div className="timer-panel__display-wrap">
        <div className={`timer-panel__display ${stateClass}`}>
          {formatTime(timerRemaining)}
        </div>
      </div>
      <div className="timer-panel__controls">
        <button
          className={`btn-hud timer-panel__btn ${timerRunning ? 'timer-panel__btn--pause' : 'timer-panel__btn--play'}`}
          onClick={() => setTimerRunning(!timerRunning)}
        >
          {timerRunning ? '⏸ PAUSE' : '▶ START'}
        </button>
        <button
          className="btn-hud timer-panel__btn timer-panel__btn--reset"
          onClick={handleReset}
        >
          ↺ RESET
        </button>
      </div>
    </div>
  );
}
