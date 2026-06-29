import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { type Theme } from '../store/useMcpStore';
import { getThemeVideoConfig } from '../data/themeVideoMap';
import { preloadTheme } from '../utils/themeAssetCache';
import { LEADER_BACKGROUNDS } from '../data/leaderBackgroundsMap';
import { IDLE_EVENT, type IdleLevel } from '../hooks/useIdleDetection';
import './VSBackground.css';

const FADE_MS = 400; // keep in sync with the opacity transition below

/** After this many ms in Round 1, switch the video to a static image. */
const ROUND1_VIDEO_MAX_MS = 10 * 60 * 1000; // 10 minutes

const BACKGROUNDS_BASE = `${import.meta.env.BASE_URL}backgrounds/`;

interface VSBackgroundProps {
  themeLeft: Theme | null;
  themeRight: Theme | null;
  leaderIdLeft?: string | null;
  leaderIdRight?: string | null;
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

/** Resolve a real static image URL for a leader, using leaderBackgroundsMap.
 *  Falls back to null if no images are available for that leader. */
function getLeaderStaticImageUrl(leaderId?: string | null): string | null {
  if (!leaderId) return null;
  const images = LEADER_BACKGROUNDS[leaderId];
  if (images && images.length > 0) {
    return `${BACKGROUNDS_BASE}${images[0]}`;
  }
  return null;
}

/**
 * True while background videos should be suspended:
 *  - deep idle (no interaction for DEEP_IDLE_MS), or
 *  - page hidden (app switched away / screen locked).
 */
function useVideoSuspended(): boolean {
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    const onIdleChange = (e: Event) => {
      setSuspended((e as CustomEvent<IdleLevel>).detail === 'deep');
    };
    const onVisibility = () => {
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
  leaderId?: string | null;
  side: 'left' | 'right';
  suspended: boolean;
  round: number;
}

function HalfVideo({ themeId, leaderId, side, suspended, round }: HalfVideoProps) {
  const config = getThemeVideoConfig(themeId);
  const [visible, setVisible] = useState(false);
  const [staticFallback, setStaticFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const round1TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackActiveRef = useRef(false);

  const staticImageUrl = getLeaderStaticImageUrl(leaderId);

  const activateStaticFallback = useCallback(() => {
    if (fallbackActiveRef.current) return;
    fallbackActiveRef.current = true;
    setStaticFallback(true);
    const v = videoRef.current;
    if (v) {
      v.pause();
      // Remove src to release decoder memory on iPadOS
      v.removeAttribute('src');
      v.load();
    }
    if (round1TimerRef.current) {
      clearTimeout(round1TimerRef.current);
      round1TimerRef.current = null;
    }
  }, []);

  // Preload this theme's video assets as soon as we know we need them
  useEffect(() => {
    preloadTheme(themeId, true);
  }, [themeId]);

  // Reset state whenever theme changes (leader change)
  useEffect(() => {
    setVisible(false); // eslint-disable-line react-hooks/set-state-in-effect
    setStaticFallback(false); // eslint-disable-line react-hooks/set-state-in-effect
    fallbackActiveRef.current = false;
    if (round1TimerRef.current) {
      clearTimeout(round1TimerRef.current);
      round1TimerRef.current = null;
    }
  }, [themeId]);

  // Reset video state when entering Round 1 so the video plays again after
  // manual round navigation back to Round 1 or game reset.
  useEffect(() => {
    if (round === 1) {
      setVisible(false); // eslint-disable-line react-hooks/set-state-in-effect
      setStaticFallback(false); // eslint-disable-line react-hooks/set-state-in-effect
      fallbackActiveRef.current = false;
    } else {
      // Leaving Round 1: clear the timer; video is removed from DOM by the render gate below.
      if (round1TimerRef.current) {
        clearTimeout(round1TimerRef.current);
        round1TimerRef.current = null;
      }
    }
  }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  // 10-minute Round 1 timer: switch to static image after the limit
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
    if (staticFallback || round !== 1) return;
    const v = videoRef.current;
    if (!v) return;
    if (suspended) {
      const t = setTimeout(() => v.pause(), FADE_MS);
      return () => clearTimeout(t);
    }
    void v.play().catch(() => {});
  }, [suspended, staticFallback, round]);

  // Only listen for hard failures (error) — not stalled/emptied/pause which fire
  // during normal buffering and cause premature fallback activation.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || staticFallback || round !== 1) return;

    const onFail = () => activateStaticFallback();
    v.addEventListener('error', onFail);
    return () => {
      v.removeEventListener('error', onFail);
    };
  }, [staticFallback, round, activateStaticFallback]);

  if (!config) {
    return (
      <>
        <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />
        {staticImageUrl && (
          <img className="vs-bg__poster" src={staticImageUrl} alt="" aria-hidden="true" draggable={false} />
        )}
      </>
    );
  }

  const mediaStyle = buildVideoStyle(config.objectPositionY, config.scale);
  const videoOpaque = visible && !suspended && !staticFallback;

  return (
    <>
      {/* Gradient colour wash — always visible */}
      <div className={`vs-bg__fallback vs-bg__fallback--${side}`} />

      {/* Static leader background image — always in DOM so it's immediately
          visible if the video can't play (autoplay blocked, iPad, etc.) and
          permanently visible after the 10-minute Round 1 limit. */}
      {staticImageUrl && (
        <img
          className="vs-bg__poster"
          src={staticImageUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={mediaStyle}
        />
      )}

      {/* Video — only in Round 1, fades in once it can play, removed after 10-minute timer */}
      {round === 1 && !staticFallback && (
        <video
          ref={videoRef}
          key={config.src}
          src={config.src}
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

export function VSBackground({
  themeLeft,
  themeRight,
  leaderIdLeft,
  leaderIdRight,
  round = 1,
}: VSBackgroundProps) {
  const suspended = useVideoSuspended();

  return (
    <div className="vs-bg" aria-hidden="true">
      <div className="vs-bg__half vs-bg__half--left">
        {themeLeft ? (
          <HalfVideo themeId={themeLeft} leaderId={leaderIdLeft} side="left" suspended={suspended} round={round} />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--left" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--left" />
      </div>

      <div className="vs-bg__half vs-bg__half--right">
        {themeRight ? (
          <HalfVideo themeId={themeRight} leaderId={leaderIdRight} side="right" suspended={suspended} round={round} />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--right" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--right" />
      </div>

      <div className="vs-bg__global-overlay" />
    </div>
  );
}
