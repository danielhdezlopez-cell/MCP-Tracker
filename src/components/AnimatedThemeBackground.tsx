import { useEffect, useRef, useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import './AnimatedThemeBackground.css';

interface Props {
  theme: Theme;
}

const CROSSFADE_S = 0.8;

const VIDEO_THEMES: Partial<Record<Theme, { src: string; modifier: string; smoothLoop?: boolean }>> = {
  apocalypse:          { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Apocalypse.mp4`,                  modifier: 'anim-theme-bg--apocalypse'        },
  'cap-first-avenger': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_CaptainAmericaFirstAvenger.mp4`, modifier: 'anim-theme-bg--cap-first-avenger' },
  convocation:         { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Convocation.mp4`,                modifier: 'anim-theme-bg--convocation'       },
  cyclops:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Cyclops.mp4`,                    modifier: 'anim-theme-bg--cyclops', smoothLoop: true },
  'dark-dimension':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Dormammu.mp4`,                   modifier: 'anim-theme-bg--dark-dimension'    },
  dracula:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Dracula.mp4`,                    modifier: 'anim-theme-bg--dracula'           },
  'hellfire-club':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Hellfireclub.mp4`,              modifier: 'anim-theme-bg--hellfire-club'     },
  mephisto:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Mephisto.mp4`,                  modifier: 'anim-theme-bg--mephisto'          },
  'midnight-sons':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MidnightSons.mp4`,             modifier: 'anim-theme-bg--midnight-sons'     },
  hulkbuster: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Avengers_Hulkbuster.mp4`, modifier: 'anim-theme-bg--hulkbuster' },
  hydra:  { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_HYDRA.mp4`,       modifier: 'anim-theme-bg--hydra'      },
  shield: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SHIELD.mp4`,      modifier: 'anim-theme-bg--shield'     },
  asgard:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Asgard.mp4`,      modifier: 'anim-theme-bg--asgard'     },
  'spider-man': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WebWarriors.mp4`, modifier: 'anim-theme-bg--spider-man' },
  'miles-morales': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MilesMorales.mp4`, modifier: 'anim-theme-bg--miles-morales' },
  thanos:          { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thanos.mp4`,        modifier: 'anim-theme-bg--thanos'        },
  thunderbolts:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thunderbolts_RedHulk.mp4`, modifier: 'anim-theme-bg--thunderbolts' },
  ultron:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Ultron.mp4`,      modifier: 'anim-theme-bg--ultron'     },
  'weapon-x':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WeaponX.mp4`,    modifier: 'anim-theme-bg--weapon-x'   },
};

/* Crossfade between two video elements so the loop has no visible cut.
   Video A plays; ~CROSSFADE_S seconds before it ends, Video B starts and
   they fade through each other. Then roles swap and the cycle repeats. */
function SmoothLoopVideo({ src, onError }: { src: string; onError: () => void }) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const stateRef = useRef({ activeIsA: true, fading: false });

  useEffect(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;

    a.style.opacity = '1';
    b.style.opacity = '0';

    const crossfade = (from: HTMLVideoElement, to: HTMLVideoElement) => {
      stateRef.current.fading = true;
      to.currentTime = 0;
      to.play().catch(() => {});
      from.style.transition = `opacity ${CROSSFADE_S}s ease-in-out`;
      to.style.transition   = `opacity ${CROSSFADE_S}s ease-in-out`;
      from.style.opacity = '0';
      to.style.opacity   = '1';
      setTimeout(() => {
        from.pause();
        from.currentTime = 0;
        stateRef.current.activeIsA = !stateRef.current.activeIsA;
        stateRef.current.fading = false;
      }, (CROSSFADE_S + 0.2) * 1000);
    };

    const onTimeUpdateA = () => {
      if (!stateRef.current.activeIsA || stateRef.current.fading || !a.duration) return;
      if (a.duration - a.currentTime <= CROSSFADE_S) crossfade(a, b);
    };

    const onTimeUpdateB = () => {
      if (stateRef.current.activeIsA || stateRef.current.fading || !b.duration) return;
      if (b.duration - b.currentTime <= CROSSFADE_S) crossfade(b, a);
    };

    a.addEventListener('timeupdate', onTimeUpdateA);
    b.addEventListener('timeupdate', onTimeUpdateB);
    return () => {
      a.removeEventListener('timeupdate', onTimeUpdateA);
      b.removeEventListener('timeupdate', onTimeUpdateB);
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
      <video ref={refA} src={src} autoPlay muted playsInline style={vs} onError={onError} />
      <video ref={refB} src={src} muted playsInline style={vs} onError={onError} />
    </>
  );
}

export function AnimatedThemeBackground({ theme }: Props) {
  const [videoError, setVideoError] = useState(false);
  const config = VIDEO_THEMES[theme];

  // Reset error state when theme switches so the new theme's video retries
  useEffect(() => { setVideoError(false); }, [theme]);

  if (!config) return null;

  return (
    <div className={`anim-theme-bg ${config.modifier}${videoError ? ' anim-theme-bg--fallback' : ''}`}>
      {!videoError && (
        config.smoothLoop
          ? <SmoothLoopVideo src={config.src} onError={() => setVideoError(true)} />
          : <video src={config.src} autoPlay loop muted playsInline onError={() => setVideoError(true)} />
      )}
      <div className="anim-theme-bg__overlay" />
    </div>
  );
}
