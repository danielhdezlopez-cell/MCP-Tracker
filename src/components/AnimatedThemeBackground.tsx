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
  apocalypse:          { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Apocalypse2.mp4`,                  modifier: 'anim-theme-bg--apocalypse', smoothLoop: true },
  'black-bolt':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_BlackBolt.mp4`,    modifier: 'anim-theme-bg--black-bolt',    smoothLoop: true },
  'black-panther': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_BlackPanther.mp4`, modifier: 'anim-theme-bg--black-panther', smoothLoop: true },
  cable:               { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Cable.mp4`,                    modifier: 'anim-theme-bg--cable', smoothLoop: true },
  'captain-america':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_CaptainAmerica.mp4`,            modifier: 'anim-theme-bg--captain-america' },
  'cap-first-avenger': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_CaptainAmericaFirstAvenger.mp4`, modifier: 'anim-theme-bg--cap-first-avenger' },
  convocation:         { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Convocation.mp4`,                modifier: 'anim-theme-bg--convocation'       },
  corbus:              { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Corbus.mp4`,                    modifier: 'anim-theme-bg--corbus',            smoothLoop: true },
  cyclops:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Cyclops.mp4`,                    modifier: 'anim-theme-bg--cyclops', smoothLoop: true },
  'dark-dimension':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Dormammu.mp4`,                   modifier: 'anim-theme-bg--dark-dimension'    },
  daredevil:           { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Daredevil.mp4`,                  modifier: 'anim-theme-bg--daredevil', smoothLoop: true },
  'doc-ock':           { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_DocOck.mp4`,                     modifier: 'anim-theme-bg--doc-ock'           },
  'dr-strange':        { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_DrStrange.mp4`,                  modifier: 'anim-theme-bg--dr-strange'        },
  dracula:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Dracula.mp4`,                    modifier: 'anim-theme-bg--dracula'           },
  'elsa-bloodstone':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_ElsaBloodstone.mp4`,           modifier: 'anim-theme-bg--elsa-bloodstone',   smoothLoop: true },
  'green-goblin':      { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_GreenGoblin.mp4`,              modifier: 'anim-theme-bg--green-goblin', smoothLoop: true },
  'hellfire-club':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Hellfireclub.mp4`,              modifier: 'anim-theme-bg--hellfire-club'     },
  mephisto:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Mephisto.mp4`,                  modifier: 'anim-theme-bg--mephisto'          },
  'midnight-sons':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MidnightSons.mp4`,             modifier: 'anim-theme-bg--midnight-sons'     },
  modok:               { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MODOK.mp4`,                    modifier: 'anim-theme-bg--modok', smoothLoop: true },
  mystique:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Mystique.mp4`,                 modifier: 'anim-theme-bg--mystique'          },
  namor:               { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Namor.mp4`,                   modifier: 'anim-theme-bg--namor',             smoothLoop: true },
  hulkbuster: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Avengers_Hulkbuster.mp4`, modifier: 'anim-theme-bg--hulkbuster' },
  hydra:  { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_HYDRA.mp4`,       modifier: 'anim-theme-bg--hydra'      },
  'invincible-ironman': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_InvincibleIronman.mp4`, modifier: 'anim-theme-bg--invincible-ironman', smoothLoop: true },
  kang:                 { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Kang.mp4`,              modifier: 'anim-theme-bg--kang',              smoothLoop: true },
  'kill-monger':  { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_KillMonger.mp4`,  modifier: 'anim-theme-bg--kill-monger',  smoothLoop: true },
  'king-tchalla': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_KingTChalla.mp4`, modifier: 'anim-theme-bg--king-tchalla', smoothLoop: true },
  kingpin: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Kingpin.mp4`,     modifier: 'anim-theme-bg--kingpin', smoothLoop: true },
  klaw:   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Klaw.mp4`,        modifier: 'anim-theme-bg--klaw', smoothLoop: true },
  loki:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Loki.mp4`,     modifier: 'anim-theme-bg--loki', smoothLoop: true },
  magik:   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Magik.mp4`,    modifier: 'anim-theme-bg--magik', smoothLoop: true },
  magneto: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Magneto.mp4`, modifier: 'anim-theme-bg--magneto', smoothLoop: true },
  'maximus-the-mad': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MaximusTheMad.mp4`, modifier: 'anim-theme-bg--maximus-the-mad', smoothLoop: true },
  mbaku:             { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MBaku.mp4`,          modifier: 'anim-theme-bg--mbaku',          smoothLoop: true },
  medusa:  { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Medusa.mp4`,  modifier: 'anim-theme-bg--medusa',  smoothLoop: true },
  shield: { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SHIELD.mp4`,      modifier: 'anim-theme-bg--shield'     },
  sin:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Sin.mp4`,          modifier: 'anim-theme-bg--sin',         smoothLoop: true },
  asgard:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Asgard.mp4`,      modifier: 'anim-theme-bg--asgard'     },
  'spider-man': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WebWarriors.mp4`, modifier: 'anim-theme-bg--spider-man' },
  starlord:     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Starlord.mp4`,   modifier: 'anim-theme-bg--starlord', smoothLoop: true },
  'she-hulk':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SheHulk.mp4`,   modifier: 'anim-theme-bg--she-hulk', smoothLoop: true },
  storm:        { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Storm.mp4`,      modifier: 'anim-theme-bg--storm', smoothLoop: true },
  'miles-morales': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_MilesMorales.mp4`, modifier: 'anim-theme-bg--miles-morales' },
  thanos:          { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thanos.mp4`,        modifier: 'anim-theme-bg--thanos', smoothLoop: true },
  thor:            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thor.mp4`,          modifier: 'anim-theme-bg--thor'          },
  onslaught:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Onslaught.mp4`,   modifier: 'anim-theme-bg--onslaught', smoothLoop: true  },
  'professor-x':   { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_ProfessorX2.mp4`, modifier: 'anim-theme-bg--professor-x', smoothLoop: true },
  'the-leader':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_TheLeader.mp4`,    modifier: 'anim-theme-bg--the-leader', smoothLoop: true },
  thunderbolts:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Thunderbolts_RedHulk.mp4`, modifier: 'anim-theme-bg--thunderbolts' },
  ultron:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Ultron.mp4`,      modifier: 'anim-theme-bg--ultron'     },
  'weapon-x':    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WeaponX.mp4`,      modifier: 'anim-theme-bg--weapon-x'    },
  'winter-guard': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_WinterGuard.mp4`, modifier: 'anim-theme-bg--winter-guard' },
  'adam-warlock': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_AdamWarlock.mp4`, modifier: 'anim-theme-bg--adam-warlock', smoothLoop: true },
  'red-skull':                     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_RedSkull.mp4`,                    modifier: 'anim-theme-bg--red-skull',                    smoothLoop: true },
  'red-skull-master-of-hydra':     { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_RedSkullMasterOfHydra.mp4`,     modifier: 'anim-theme-bg--red-skull-master-of-hydra',     smoothLoop: true },
  'red-skull-master-of-the-world': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_RedSkullMasterOfTheWorld.mp4`, modifier: 'anim-theme-bg--red-skull-master-of-the-world', smoothLoop: true },
  'sam-wilson': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_SamWilson.mp4`, modifier: 'anim-theme-bg--sam-wilson' },
  sentinels:    { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Sentinels.mp4`,  modifier: 'anim-theme-bg--sentinels'  },
  'baron-strucker':       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_BaronStrucker.mp4`,      modifier: 'anim-theme-bg--baron-strucker', smoothLoop: true },
  'baron-zemo':           { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_BaronZemo.mp4`,           modifier: 'anim-theme-bg--baron-zemo', smoothLoop: true },
  'bastion':              { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Bastion.mp4`,             modifier: 'anim-theme-bg--bastion' },
  'blade':                { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Blade.mp4`,               modifier: 'anim-theme-bg--blade', smoothLoop: true },
  'nick-fury':            { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_NickFury.mp4`,            modifier: 'anim-theme-bg--nick-fury', smoothLoop: true },
  'shadowland-daredevil': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_ShadowlandDaredevil.mp4`, modifier: 'anim-theme-bg--shadowland-daredevil', smoothLoop: true },
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
