import { useEffect, useRef, useState } from 'react';
import './IntroSplash.css';

interface IntroSplashProps {
  onDone: () => void;
}

const SHOW_MS = 2000;
const FADE_MS = 500;

export function IntroSplash({ onDone }: IntroSplashProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const startFade = () => {
      setFading(true);
      timer = setTimeout(onDone, FADE_MS);
    };

    // Start fade after SHOW_MS regardless of video state
    const showTimer = setTimeout(startFade, SHOW_MS);

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
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
