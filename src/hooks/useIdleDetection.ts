import { useEffect } from 'react';

const IDLE_MS = 5000;        // stage 1 — pause decorative CSS animations
const DEEP_IDLE_MS = 45000;  // stage 2 — suspend background videos (biggest battery win)

const EVENTS: (keyof DocumentEventMap)[] = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'];

export type IdleLevel = 'active' | 'idle' | 'deep';
export const IDLE_EVENT = 'mcp:idlechange';

function emit(level: IdleLevel) {
  window.dispatchEvent(new CustomEvent<IdleLevel>(IDLE_EVENT, { detail: level }));
}

/**
 * Two-stage idle detection:
 *  - After IDLE_MS without interaction: adds `mcp-idle` to <body>
 *    (CSS pauses/slows decorative animations).
 *  - After DEEP_IDLE_MS: adds `mcp-idle-deep` and emits a `mcp:idlechange`
 *    window event with detail 'deep' — VSBackground listens and pauses the
 *    looping theme videos, fading to their static posters.
 *  - Any interaction removes both classes, emits 'active' and restarts timers.
 */
export function useIdleDetection() {
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let deepTimer: ReturnType<typeof setTimeout> | null = null;
    let level: IdleLevel = 'active';

    const goIdle = () => {
      level = 'idle';
      document.body.classList.add('mcp-idle');
      emit('idle');
    };
    const goDeep = () => {
      level = 'deep';
      document.body.classList.add('mcp-idle-deep');
      emit('deep');
    };

    const armTimers = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (deepTimer) clearTimeout(deepTimer);
      idleTimer = setTimeout(goIdle, IDLE_MS);
      deepTimer = setTimeout(goDeep, DEEP_IDLE_MS);
    };

    const onActivity = () => {
      if (level !== 'active') {
        level = 'active';
        document.body.classList.remove('mcp-idle', 'mcp-idle-deep');
        emit('active');
      }
      armTimers();
    };

    EVENTS.forEach(ev => document.addEventListener(ev, onActivity, { passive: true }));
    armTimers();

    return () => {
      EVENTS.forEach(ev => document.removeEventListener(ev, onActivity));
      if (idleTimer) clearTimeout(idleTimer);
      if (deepTimer) clearTimeout(deepTimer);
      document.body.classList.remove('mcp-idle', 'mcp-idle-deep');
    };
  }, []);
}
