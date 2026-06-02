import { useEffect, useRef, useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import { VIDEO_THEMES } from '../data/themeVideoMap';
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
function SmoothLoopVideo({ src, onError }: { src: string; onError: () => void }) {
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

    // Schedule the crossfade CROSSFADE_S seconds before `from` reaches its end.
    // Using setTimeout avoids the ~250 ms polling gap of timeupdate.
    const schedule = (from: HTMLVideoElement, to: HTMLVideoElement) => {
      if (dead) return;
      if (timer) clearTimeout(timer);
      const delay = Math.max(0, (from.duration - from.currentTime - CROSSFADE_S) * 1000);
      timer = setTimeout(() => {
        if (dead) return;
        // Kick off standby video — preload="auto" means it buffers immediately
        to.currentTime = 0;
        to.play().catch(() => {});
        setOp(from, 0, true);
        setOp(to, 1, true);
        // After fade completes, retire the old active and schedule next cycle
        timer = setTimeout(() => {
          if (dead) return;
          from.pause();
          from.currentTime = 0;
          // `to` has been playing for ~(CROSSFADE_S + 0.1)s from its start
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

  return (
    <>
      <video ref={refA} src={src} autoPlay muted playsInline preload="auto" style={vs} onError={onError} />
      <video ref={refB} src={src} muted playsInline preload="auto" style={vs} onError={onError} />
    </>
  );
}

export function AnimatedThemeBackground({ theme }: Props) {
  const [bgError, setBgError] = useState(false);
  const videoConfig = VIDEO_THEMES[theme];
  const imageConfig = IMAGE_THEMES[theme];

  // Reset error state when theme switches so the new theme's bg retries
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setBgError(false); }, [theme]);

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

  return (
    <div className={`anim-theme-bg ${videoConfig.modifier}${bgError ? ' anim-theme-bg--fallback' : ''}`}>
      {!bgError && (
        videoConfig.smoothLoop
          ? <SmoothLoopVideo src={videoConfig.src} onError={() => setBgError(true)} />
          : <video src={videoConfig.src} autoPlay loop muted playsInline onError={() => setBgError(true)} />
      )}
      <div className="anim-theme-bg__overlay" />
    </div>
  );
}
