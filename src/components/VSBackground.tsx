import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { type Theme } from '../store/useMcpStore';
import { getThemeVideoConfig } from '../data/themeVideoMap';
import { getPosterUrl, preloadTheme } from '../utils/themeAssetCache';
import { IDLE_EVENT, type IdleLevel } from '../hooks/useIdleDetection';
import './VSBackground.css';

const FADE_MS = 400; // keep in sync with the opacity transition below

/** After this many ms in Round 1, switch the video to a static poster. */
const ROUND1_VIDEO_MAX_MS = 10 * 60 * 1000; // 10 minutes

interface VSBackgroundProps {
  themeLeft: Theme | null;
  themeRight: Theme | null;
  round?: number;
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
  round: number;
}

function HalfVideo({ themeId, side, suspended, round }: HalfVideoProps) {
  const config = getThemeVideoConfig(themeId);
  const [visible, setVisible] = useState(false);
  const [staticFallback, setStaticFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const round1TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackActiveRef = useRef(false);

  const activateStaticFallback = useCallback(() => {
    if (fallbackActiveRef.current) return;
    fallbackActiveRef.current = true;
    setStaticFallback(true);
    const v = videoRef.current;
    if (v) {
      v.pause();
      // Remove src to release memory/decoder on iPadOS
      v.removeAttribute('src');
      v.load();
    }
    if (round1TimerRef.current) {
      clearTimeout(round1TimerRef.current);
      round1TimerRef.current = null;
    }
  }, []);

  // Preload this theme's assets as soon as we know we need them
  useEffect(() => {
    preloadTheme(themeId, true);
  }, [themeId]);

  // Reset state whenever theme changes (leader change)
  useEffect(() => {
    setVisible(false); // eslint-disable-line react-hooks/set-state-in-effect
    setStaticFallback(false);
    fallbackActiveRef.current = false;
    if (round1TimerRef.current) {
      clearTimeout(round1TimerRef.current);
      round1TimerRef.current = null;
    }
  }, [themeId]);

  // Manage the 10-minute Round 1 timer
  useEffect(() => {
    if (round1TimerRef.current) {
      clearTimeout(round1TimerRef.current);
      round1TimerRef.current = null;
    }
    if (round === 1 && !fallbackActiveRef.current) {
      round1TimerRef.current = setTimeout(activateStaticFallback, ROUND1_VIDEO_MAX_MS);
    }
    return () => {
      if (round1TimerRef.current) {
        clearTimeout(round1TimerRef.current);
        round1TimerRef.current = null;
      }
    };
  }, [round, activateStaticFallback]);

  // Pause after the fade-out completes; resume playback when active again.
  useEffect(() => {
    if (staticFallback) return; // already switched to static, do not touch video
    const v = videoRef.current;
    if (!v) return;
    if (suspended) {
      const t = setTimeout(() => v.pause(), FADE_MS);
      return () => clearTimeout(t);
    }
    void v.play().catch(() => {});
  }, [suspended, staticFallback]);

  // Video failure listeners — switch to static immediately on any problem
  useEffect(() => {
    const v = videoRef.current;
    if (!v || staticFallback) return;

    const onFail = () => activateStaticFallback();

    // 'pause' can fire legitimately (idle suspend), only treat it as failure
    // when it is unexpected (not already suspended and not already switching).
    const onPause = () => {
      if (!suspended && !fallbackActiveRef.current) {
        // Give the browser 3 seconds to recover / re-play before bailing out
        const t = setTimeout(() => {
          const vid = videoRef.current;
          if (vid && vid.paused && !fallbackActiveRef.current) {
            activateStaticFallback();
          }
        }, 3000);
        return () => clearTimeout(t);
      }
    };

    v.addEventListener('error', onFail);
    v.addEventListener('stalled', onFail);
    v.addEventListener('emptied', onFail);
    v.addEventListener('pause', onPause as EventListener);

    return () => {
      v.removeEventListener('error', onFail);
      v.removeEventListener('stalled', onFail);
      v.removeEventListener('emptied', onFail);
      v.removeEventListener('pause', onPause as EventListener);
    };
  }, [suspended, staticFallback, activateStaticFallback]);

  if (!config) {
    return <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />;
  }

  const poster = getPosterUrl(config.src);
  const mediaStyle = buildVideoStyle(config.objectPositionY, config.scale);

  // When static fallback is active, show only the poster — no video element
  const videoOpaque = visible && !suspended && !staticFallback;

  return (
    <>
      {/* Gradient fallback always present — visible through transparent video */}
      <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />
      {/* Static poster underneath — what you see while the video is suspended
          or after the 10-minute Round 1 limit is reached on iPadOS */}
      <img
        className="vs-bg__poster"
        src={poster}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={mediaStyle}
      />
      {!staticFallback && (
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
            opacity: videoOpaque ? 1 : 0,
            transition: visible ? `opacity ${FADE_MS}ms ease` : 'none',
          }}
          onCanPlay={() => setVisible(true)}
          onLoadedData={() => setVisible(true)}
        />
      )}
    </>
  );
}

export function VSBackground({ themeLeft, themeRight, round = 1 }: VSBackgroundProps) {
  const suspended = useVideoSuspended();

  return (
    <div className="vs-bg" aria-hidden="true">
      <div className="vs-bg__half vs-bg__half--left">
        {themeLeft ? (
          <HalfVideo themeId={themeLeft} side="left" suspended={suspended} round={round} />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--left" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--left" />
      </div>

      <div className="vs-bg__half vs-bg__half--right">
        {themeRight ? (
          <HalfVideo themeId={themeRight} side="right" suspended={suspended} round={round} />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--right" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--right" />
      </div>

      <div className="vs-bg__global-overlay" />
    </div>
  );
}
