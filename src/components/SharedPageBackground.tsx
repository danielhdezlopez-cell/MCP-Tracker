import { useEffect, useRef } from 'react';
import './SharedPageBackground.css';

const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE as string | undefined) ?? 'https://danielhdezlopez-cell.github.io/MCP-Tracker/';
const VIDEO_SRC = `${ASSETS_BASE}assets/backgrounds/BG_SharedPanels.mp4`;

export function SharedPageBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div className="shared-page-bg" aria-hidden>
      <video
        ref={videoRef}
        className="shared-page-bg__video"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="shared-page-bg__overlay" />
    </div>
  );
}
