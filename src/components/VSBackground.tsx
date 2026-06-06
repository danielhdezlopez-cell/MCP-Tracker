import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { type Theme } from '../store/useMcpStore';
import { getThemeVideoConfig } from '../data/themeVideoMap';
import { getPosterUrl, preloadTheme } from '../utils/themeAssetCache';
import './VSBackground.css';

interface VSBackgroundProps {
  themeLeft: Theme | null;
  themeRight: Theme | null;
}

function buildVideoStyle(objectPositionY?: string, scale?: number): CSSProperties {
  const style: CSSProperties = {
    objectPosition: `center ${objectPositionY ?? 'top'}`,
  };
  if (scale != null) {
    style.transform = `scale(${scale})`;
    style.transformOrigin = 'center center';
  }
  return style;
}

interface HalfVideoProps {
  themeId: Theme;
  side: 'left' | 'right';
}

function HalfVideo({ themeId, side }: HalfVideoProps) {
  const config = getThemeVideoConfig(themeId);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload this theme's assets as soon as we know we need them
  useEffect(() => {
    preloadTheme(themeId, true);
  }, [themeId]);

  // Reset visibility on theme change
  useEffect(() => {
    setVisible(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [themeId]);

  if (!config) {
    return <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />;
  }

  const poster = getPosterUrl(config.src);

  return (
    <>
      {/* Gradient fallback always present — visible through transparent video */}
      <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />
      <video
        ref={videoRef}
        key={config.src}
        src={config.src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="vs-bg__video"
        style={{
          ...buildVideoStyle(config.objectPositionY, config.scale),
          opacity: visible ? 1 : 0,
          transition: visible ? 'opacity 0.5s ease-in' : 'none',
        }}
        onCanPlay={() => setVisible(true)}
        onLoadedData={() => setVisible(true)}
      />
    </>
  );
}

export function VSBackground({ themeLeft, themeRight }: VSBackgroundProps) {
  return (
    <div className="vs-bg" aria-hidden="true">
      <div className="vs-bg__half vs-bg__half--left">
        {themeLeft ? (
          <HalfVideo themeId={themeLeft} side="left" />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--left" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--left" />
      </div>

      <div className="vs-bg__half vs-bg__half--right">
        {themeRight ? (
          <HalfVideo themeId={themeRight} side="right" />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--right" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--right" />
      </div>
    </div>
  );
}
