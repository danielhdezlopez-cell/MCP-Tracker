import { useCallback, useEffect, useRef, useState } from 'react';
import './IntroSplash.css';

interface IntroSplashProps {
  duration?: number;
  src?: string;
  onDone: () => void;
}

const FADE_MS = 500;

export function IntroSplash({ duration = 5000, src = 'intro.mp4', onDone }: IntroSplashProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const fadingRef = useRef(false);

  const startFade = useCallback(() => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    setFading(true);
    setTimeout(onDone, FADE_MS);
  }, [onDone]);

  useEffect(() => {
    const showTimer = setTimeout(startFade, duration);
    const vid = videoRef.current;
    if (vid) vid.play().catch(() => {});
    return () => clearTimeout(showTimer);
  }, [startFade, duration]);

  return (
    <div
      className={`intro-splash${fading ? ' intro-splash--fading' : ''}`}
      onClick={startFade}
      onPointerDown={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        className="intro-splash__video"
        src={`${import.meta.env.BASE_URL}${src}`}
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
