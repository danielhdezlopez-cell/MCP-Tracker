import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { type Theme } from '../store/useMcpStore';
import { getThemeVideoConfig } from '../data/themeVideoMap';
import { getPosterUrl, preloadTheme } from '../utils/themeAssetCache';
import { IDLE_EVENT, type IdleLevel } from '../hooks/useIdleDetection';
import './VSBackground.css';

const FADE_MS = 400; // keep in sync with the opacity transition below

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

/**
 * True while background videos should be suspended:
 *  - deep idle (no interaction for DEEP_IDLE_MS), or
 *  - page hidden (app switched away / screen locked).
 * Continuous video decode is the single biggest battery cost of the app, so
 * during dead time we fade to the static poster and pause the <video>.
 */
function useVideoSuspended(): boolean {
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    const onIdleChange = (e: Event) => {
      setSuspended((e as CustomEvent<IdleLevel>).detail === 'deep');
    };
    const onVisibility = () => {
      // Hidden → suspend immediately. Visible → resume; the idle detector
      // will re-suspend after DEEP_IDLE_MS if the table stays untouched.
      setSuspended(document.hidden);
    };
    window.addEventListener(IDLE_EVENT, onIdleChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener(IDLE_EVENT, onIdleChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return suspended;
}

interface HalfVideoProps {
  themeId: Theme;
  side: 'left' | 'right';
  suspended: boolean;
}

function HalfVideo({ themeId, side, suspended }: HalfVideoProps) {
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

  // Pause after the fade-out completes; resume playback when active again.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (suspended) {
      const t = setTimeout(() => v.pause(), FADE_MS);
      return () => clearTimeout(t);
    }
    void v.play().catch(() => {});
  }, [suspended]);

  if (!config) {
    return <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />;
  }

  const poster = getPosterUrl(config.src);
  const mediaStyle = buildVideoStyle(config.objectPositionY, config.scale);

  return (
    <>
      {/* Gradient fallback always present — visible through transparent video */}
      <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />
      {/* Static poster underneath — what you see while the video is suspended */}
      <img
        className="vs-bg__poster"
        src={poster}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={mediaStyle}
      />
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
          ...mediaStyle,
          opacity: visible && !suspended ? 1 : 0,
          transition: visible ? `opacity ${FADE_MS}ms ease` : 'none',
        }}
        onCanPlay={() => setVisible(true)}
        onLoadedData={() => setVisible(true)}
      />
    </>
  );
}

export function VSBackground({ themeLeft, themeRight }: VSBackgroundProps) {
  const suspended = useVideoSuspended();

  return (
    <div className="vs-bg" aria-hidden="true">
      <div className="vs-bg__half vs-bg__half--left">
        {themeLeft ? (
          <HalfVideo themeId={themeLeft} side="left" suspended={suspended} />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--left" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--left" />
      </div>

      <div className="vs-bg__half vs-bg__half--right">
        {themeRight ? (
          <HalfVideo themeId={themeRight} side="right" suspended={suspended} />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--right" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--right" />
      </div>

      <div className="vs-bg__global-overlay" />
    </div>
  );
}
