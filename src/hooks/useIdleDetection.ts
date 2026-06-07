import { useEffect } from 'react';

const IDLE_MS = 5000;
const EVENTS: (keyof DocumentEventMap)[] = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'];

/**
 * Adds `mcp-idle` to document.body after IDLE_MS of no user interaction.
 * Removed immediately on any interaction event.
 * CSS uses this class to pause or slow decorative animations.
 */
export function useIdleDetection() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const goIdle = () => { document.body.classList.add('mcp-idle'); };
    const onActivity = () => {
      document.body.classList.remove('mcp-idle');
      if (timer) clearTimeout(timer);
      timer = setTimeout(goIdle, IDLE_MS);
    };

    EVENTS.forEach(ev => document.addEventListener(ev, onActivity, { passive: true }));
    timer = setTimeout(goIdle, IDLE_MS);

    return () => {
      EVENTS.forEach(ev => document.removeEventListener(ev, onActivity));
      if (timer) clearTimeout(timer);
      document.body.classList.remove('mcp-idle');
    };
  }, []);
}
