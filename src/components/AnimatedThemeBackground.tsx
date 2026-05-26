import { useEffect, useRef, useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import './AnimatedThemeBackground.css';

interface Props {
  theme: Theme;
}

const CROSSFADE_S = 0.8;

const IMAGE_THEMES: Partial<Record<Theme, { src: string; modifier: string }>> = {
  'new-mutants': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_NewMutants.jpg`, modifier: 'anim-theme-bg--new-mutants' },
};

const VIDEO_THEMES: Partial<Record<Theme, { src: string; modifier: string; smoothLoop?: boolean }>> = {
  apocalypse:          { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Apocalypse.mp4`,                  modifier: 'anim-theme-bg--apocalypse'        },
  cable:               { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Cable.mp4`,                    modifier: 'anim-theme-bg--cable', smoothLoop: true },
  'captain-america':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_CaptainAmerica.mp4`,            modifier: 'anim-theme-bg--captain-america' },
  'cap-first-avenger': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_CaptainAmericaFirstAvenger.mp4`, modifier: 'anim-theme-bg--cap-first-avenger' },
  convocation:         { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Convocation.mp4`,                modifier: 'anim-theme-bg--convocation'       },
  cyclops:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Cyclops.mp4`,                    modifier: 'anim-theme-bg--cyclops', smoothLoop: true },
  'dark-dimension':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Dormammu.mp4`,                   modifier: 'anim-theme-bg--dark-dimension'    },
  daredevil:           { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Daredevil.mp4`,                  modifier: 'anim-theme-bg--daredevil', smoothLoop: true },
  'doc-ock':           { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_DocOck.mp4`,                     modifier: 'anim-theme-bg--doc-ock'           },
  'dr-strange':        { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_DrStrange.mp4`,                  modifier: 'anim-theme-bg--dr-strange'        },
  dracula:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Dracula.mp4`,                    modifier: 'anim-theme-bg--dracula'           },
  'green-goblin':      { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_GreenGoblin.mp4`,              modifier: 'anim-theme-bg--green-goblin', smoothLoop: true },
  'hellfire-club':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Hellfireclub.mp4`,              modifier: 'anim-theme-bg--hellfire-club'     },
  mephisto:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Mephisto.mp4`,                  modifier: 'anim-theme-bg--mephisto'          },
  'midnight-sons':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MidnightSons.mp4`,             modifier: 'anim-theme-bg--midnight-sons'     },
  modok:               { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MODOK.mp4`,                    modifier: 'anim-theme-bg--modok', smoothLoop: true },
  mystique:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Mystique.mp4`,                 modifier: 'anim-theme-bg--mystique'          },
  hulkbuster: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Avengers_Hulkbuster.mp4`, modifier: 'anim-theme-bg--hulkbuster' },
  hydra:  { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_HYDRA.mp4`,       modifier: 'anim-theme-bg--hydra'      },
  kingpin: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Kingpin.mp4`,     modifier: 'anim-theme-bg--kingpin', smoothLoop: true },
  klaw:   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Klaw.mp4`,        modifier: 'anim-theme-bg--klaw', smoothLoop: true },
  magik:   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Magik.mp4`,    modifier: 'anim-theme-bg--magik', smoothLoop: true },
  magneto: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Magneto.mp4`, modifier: 'anim-theme-bg--magneto', smoothLoop: true },
  shield: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SHIELD.mp4`,      modifier: 'anim-theme-bg--shield'     },
  asgard:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Asgard.mp4`,      modifier: 'anim-theme-bg--asgard'     },
  'spider-man': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WebWarriors.mp4`, modifier: 'anim-theme-bg--spider-man' },
  starlord:     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Starlord.mp4`,   modifier: 'anim-theme-bg--starlord', smoothLoop: true },
  storm:        { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Storm.mp4`,      modifier: 'anim-theme-bg--storm', smoothLoop: true },
  'miles-morales': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MilesMorales.mp4`, modifier: 'anim-theme-bg--miles-morales' },
  thanos:          { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thanos.mp4`,        modifier: 'anim-theme-bg--thanos'        },
  thor:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thor.mp4`,          modifier: 'anim-theme-bg--thor'          },
  onslaught:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Onslaught.mp4`,   modifier: 'anim-theme-bg--onslaught', smoothLoop: true  },
  'professor-x':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_ProfessorX2.mp4`, modifier: 'anim-theme-bg--professor-x', smoothLoop: true },
  'the-leader':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_TheLeader.mp4`,    modifier: 'anim-theme-bg--the-leader', smoothLoop: true },
  thunderbolts:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thunderbolts_RedHulk.mp4`, modifier: 'anim-theme-bg--thunderbolts' },
  ultron:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Ultron.mp4`,      modifier: 'anim-theme-bg--ultron'     },
  'weapon-x':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WeaponX.mp4`,      modifier: 'anim-theme-bg--weapon-x'    },
  'winter-guard': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WinterGuard.mp4`, modifier: 'anim-theme-bg--winter-guard' },
  'adam-warlock': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_AdamWarlock.mp4`, modifier: 'anim-theme-bg--adam-warlock', smoothLoop: true },
  'sam-wilson': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SamWilson.mp4`, modifier: 'anim-theme-bg--sam-wilson' },
  sentinels:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Sentinels.mp4`,  modifier: 'anim-theme-bg--sentinels'  },
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
