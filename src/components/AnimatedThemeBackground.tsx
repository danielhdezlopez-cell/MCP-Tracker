import { useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import './AnimatedThemeBackground.css';

interface Props {
  theme: Theme;
}

export function AnimatedThemeBackground({ theme }: Props) {
  const [videoError, setVideoError] = useState(false);

  if (theme !== 'hydra') return null;

  return (
    <div className={`anim-theme-bg anim-theme-bg--hydra${videoError ? ' anim-theme-bg--fallback' : ''}`}>
      {!videoError && (
        <video
          src={`${import.meta.env.BASE_URL}assets/backgrounds/BG_HYDRA.mp4`}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        />
      )}
      <div className="anim-theme-bg__overlay" />
    </div>
  );
}
