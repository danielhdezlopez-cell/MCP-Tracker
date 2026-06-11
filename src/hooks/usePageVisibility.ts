import { useEffect } from 'react';

/**
 * Sets `mcp-page-hidden` on <body> while the page is hidden so CSS can pause
 * decorative animations.
 *
 * The game timer needs no handling here anymore: it is timestamp-based
 * (`timerEndsAt`), so real time keeps flowing while the app is hidden and the
 * correct remaining value is derived automatically on return.
 */
export function usePageVisibility() {
  useEffect(() => {
    const onVisibility = () => {
      document.body.classList.toggle('mcp-page-hidden', document.hidden);
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.body.classList.remove('mcp-page-hidden');
    };
  }, []);
}
