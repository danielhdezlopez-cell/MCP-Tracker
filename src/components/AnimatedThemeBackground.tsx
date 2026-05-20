import { useEffect, useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import './AnimatedThemeBackground.css';

interface Props {
  theme: Theme;
}

const VIDEO_THEMES: Partial<Record<Theme, { src: string; modifier: string }>> = {
  hydra:  { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_HYDRA.mp4`,  modifier: 'anim-theme-bg--hydra'  },
  shield: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SHIELD.mp4`, modifier: 'anim-theme-bg--shield' },
  asgard: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Asgard.mp4`, modifier: 'anim-theme-bg--asgard' },
};

export function AnimatedThemeBackground({ theme }: Props) {
  const [videoError, setVideoError] = useState(false);
  const config = VIDEO_THEMES[theme];

  // Reset error state when theme switches so the new theme's video retries
  useEffect(() => { setVideoError(false); }, [theme]);

  if (!config) return null;

  return (
    <div className={`anim-theme-bg ${config.modifier}${videoError ? ' anim-theme-bg--fallback' : ''}`}>
      {!videoError && (
        <video
          src={config.src}
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
