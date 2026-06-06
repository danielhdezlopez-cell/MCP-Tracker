import { useEffect, useRef, useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import { VIDEO_THEMES } from '../data/themeVideoMap';
import { getPosterUrl, preloadTheme } from '../utils/themeAssetCache';
import './AnimatedThemeBackground.css';

interface Props {
  theme: Theme;
}

const CROSSFADE_S = 0.8;

const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE as string | undefined) ?? 'https://danielhdezlopez-cell.github.io/MCP-Tracker/';

const IMAGE_THEMES: Partial<Record<Theme, { src: string; modifier: string }>> = {
  'new-mutants': { src: `${ASSETS_BASE}assets/backgrounds/BG_NewMutants.jpg`, modifier: 'anim-theme-bg--new-mutants' },
};

/* Crossfade between two video elements so the loop has no visible cut.
   Video A plays; ~CROSSFADE_S seconds before it ends, Video B starts and
   they fade through each other. Then roles swap and the cycle repeats. */
function SmoothLoopVideo({ src, poster, onError, onReady }: { src: string; poster: string; onError: () => void; onReady: () => void }) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;

    let dead = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const setOp = (el: HTMLVideoElement, op: number, animated: boolean) => {
      el.style.transition = animated ? `opacity ${CROSSFADE_S}s ease-in-out` : 'none';
      el.style.opacity = String(op);
    };

    setOp(a, 1, false);
    setOp(b, 0, false);

    const schedule = (from: HTMLVideoElement, to: HTMLVideoElement) => {
      if (dead) return;
      if (timer) clearTimeout(timer);
      const delay = Math.max(0, (from.duration - from.currentTime - CROSSFADE_S) * 1000);
      timer = setTimeout(() => {
        if (dead) return;
        to.currentTime = 0;
        to.play().catch(() => {});
        setOp(from, 0, true);
        setOp(to, 1, true);
        timer = setTimeout(() => {
          if (dead) return;
          from.pause();
          from.currentTime = 0;
          if (to.duration) {
            schedule(to, from);
          } else {
            to.addEventListener('loadedmetadata', () => { if (!dead) schedule(to, from); }, { once: true });
          }
        }, (CROSSFADE_S + 0.1) * 1000);
      }, delay);
    };

    const start = () => { if (!dead && !isNaN(a.duration)) schedule(a, b); };
    a.addEventListener('loadedmetadata', start, { once: true });
    if (a.readyState >= 1 && !isNaN(a.duration)) start();

    return () => {
      dead = true;
      if (timer) clearTimeout(timer);
      a.removeEventListener('loadedmetadata', start);
    };
  }, [src]);

  const vs: React.CSSProperties = {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const [ready, setReady] = useState(false);
  const handleReady = () => { setReady(true); onReady(); };

  const wrapStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: ready ? 1 : 0,
    transition: ready ? 'opacity 0.6s ease-in' : 'none',
  };

  return (
    <div style={wrapStyle}>
      <video ref={refA} src={src} poster={poster} autoPlay muted playsInline preload="auto" style={vs} onError={onError} onCanPlay={handleReady} />
      <video ref={refB} src={src} muted playsInline preload="auto" style={{ ...vs, opacity: 0 }} onError={onError} />
    </div>
  );
}

export function AnimatedThemeBackground({ theme }: Props) {
  const [bgError, setBgError] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const videoConfig = VIDEO_THEMES[theme];
  const imageConfig = IMAGE_THEMES[theme];

  // Reset states when theme switches so the new theme retries
  useEffect(() => {
    setBgError(false);       // eslint-disable-line react-hooks/set-state-in-effect
    setVideoVisible(false);
  }, [theme]);

  // Preload assets for this theme
  useEffect(() => {
    preloadTheme(theme, true);
  }, [theme]);

  if (imageConfig) {
    const imgStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      pointerEvents: 'none',
    };
    return (
      <div className={`anim-theme-bg ${imageConfig.modifier}${bgError ? ' anim-theme-bg--fallback' : ''}`}>
        {!bgError && (
          <img src={imageConfig.src} alt="" aria-hidden="true" style={imgStyle} onError={() => setBgError(true)} />
        )}
        <div className="anim-theme-bg__overlay" />
      </div>
    );
  }

  if (!videoConfig) return null;

  const poster = getPosterUrl(videoConfig.src);

  return (
    <div className={`anim-theme-bg ${videoConfig.modifier}${bgError ? ' anim-theme-bg--fallback' : ''}`}>
      {/* Gradient fallback always rendered — visible while video loads */}
      <div className="anim-theme-bg__gradient-fallback" />
      {!bgError && (
        videoConfig.smoothLoop
          ? (
            <SmoothLoopVideo
              src={videoConfig.src}
              poster={poster}
              onError={() => setBgError(true)}
              onReady={() => setVideoVisible(true)}
            />
          )
          : (
            <video
              key={videoConfig.src}
              src={videoConfig.src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: videoVisible ? 1 : 0,
                transition: videoVisible ? 'opacity 0.6s ease-in' : 'none',
              }}
              onCanPlay={() => setVideoVisible(true)}
              onLoadedData={() => setVideoVisible(true)}
              onError={() => setBgError(true)}
            />
          )
      )}
      <div className="anim-theme-bg__overlay" />
    </div>
  );
}
