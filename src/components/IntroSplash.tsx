import { useEffect, useRef, useState } from 'react';
import './IntroSplash.css';

interface IntroSplashProps {
  duration?: number;
  onDone: () => void;
}

const FADE_MS = 500;

export function IntroSplash({ duration = 5000, onDone }: IntroSplashProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const startFade = () => {
      setFading(true);
      timer = setTimeout(onDone, FADE_MS);
    };

    // Start fade after duration regardless of video state
    const showTimer = setTimeout(startFade, duration);

    const vid = videoRef.current;
    if (vid) {
      vid.play().catch(() => {});
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <div className={`intro-splash${fading ? ' intro-splash--fading' : ''}`}>
      <video
        ref={videoRef}
        className="intro-splash__video"
        src={`${import.meta.env.BASE_URL}intro.mp4`}
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
