import { useEffect } from 'react';
import { useMcpStore } from '../store/useMcpStore';

/**
 * Keeps the screen awake while the game timer is running.
 *
 * Uses the Screen Wake Lock API (Safari ≥ 16.4, Chrome, Edge). iOS releases
 * the lock automatically whenever the app is hidden, so we re-request it on
 * every return to visibility. Failures (Low Power Mode, unsupported browser)
 * are silently ignored — the app simply behaves as before.
 */
export function useWakeLock() {
  const timerRunning = useMcpStore(s => s.timerEndsAt !== null);

  useEffect(() => {
    if (!timerRunning || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let disposed = false;

    const request = async () => {
      try {
        const s = await navigator.wakeLock.request('screen');
        if (disposed) {
          void s.release().catch(() => {});
          return;
        }
        sentinel = s;
      } catch {
        // Denied (Low Power Mode, battery saver…) — nothing to do.
      }
    };

    const onVisibility = () => {
      // iOS/Chrome release the lock when the page hides; re-acquire on return.
      if (!document.hidden) void request();
    };

    void request();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void sentinel?.release().catch(() => {});
      sentinel = null;
    };
  }, [timerRunning]);
}
