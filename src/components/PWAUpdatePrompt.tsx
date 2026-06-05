import { useRegisterSW } from 'virtual:pwa-register/react';
import './PWAUpdatePrompt.css';

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="pwa-update" role="alert" aria-live="polite">
      <span className="pwa-update__label">Update available</span>
      <button
        className="pwa-update__reload"
        onClick={() => updateServiceWorker(true)}
      >
        RELOAD
      </button>
      <button
        className="pwa-update__dismiss"
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss update notification"
      >
        ✕
      </button>
    </div>
  );
}
