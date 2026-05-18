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

  const isWarn = timerRemaining < 15 * 60 && timerRemaining >= 5 * 60;
  const isCritical = timerRemaining < 5 * 60;

  const handleReset = () => {
    setTimerRunning(false);
    setTimerRemaining(timerDuration);
  };

  const stateClass = isCritical ? 'critical' : isWarn ? 'warn' : '';

  return (
    <div className={`timer-panel panel clip-panel-sm timer-panel--${stateClass}`}>
      <div className="label-hud timer-panel__label">GAME TIMER</div>
      <div className={`timer-panel__display ${stateClass}`}>
        {formatTime(timerRemaining)}
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
