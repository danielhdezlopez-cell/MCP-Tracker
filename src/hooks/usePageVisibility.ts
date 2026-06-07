import { useEffect, useRef } from 'react';
import { useMcpStore } from '../store/useMcpStore';

/**
 * Pauses the game timer when the page becomes hidden (tab switch / screen lock).
 * On return, calculates elapsed real time and deducts it from timerRemaining,
 * then restores timerRunning so the interval resumes from the correct value.
 *
 * Also sets `mcp-page-hidden` on body to let CSS pause decorative animations.
 */
export function usePageVisibility() {
  const pausedByHiddenRef = useRef(false);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        document.body.classList.add('mcp-page-hidden');
        hiddenAtRef.current = Date.now();
        const { timerRunning, setTimerRunning } = useMcpStore.getState();
        if (timerRunning) {
          pausedByHiddenRef.current = true;
          setTimerRunning(false);
        }
      } else {
        document.body.classList.remove('mcp-page-hidden');
        if (pausedByHiddenRef.current && hiddenAtRef.current !== null) {
          const elapsed = Math.floor((Date.now() - hiddenAtRef.current) / 1000);
          const { timerRemaining, setTimerRemaining, setTimerRunning } = useMcpStore.getState();
          const adjusted = Math.max(0, timerRemaining - elapsed);
          setTimerRemaining(adjusted);
          if (adjusted > 0) setTimerRunning(true);
          pausedByHiddenRef.current = false;
        }
        hiddenAtRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.body.classList.remove('mcp-page-hidden');
    };
  }, []);
}
