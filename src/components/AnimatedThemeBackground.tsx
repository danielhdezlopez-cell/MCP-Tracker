import { useEffect, useState } from 'react';
import { type Theme } from '../store/useMcpStore';
import './AnimatedThemeBackground.css';

interface Props {
  theme: Theme;
}

const VIDEO_THEMES: Partial<Record<Theme, { src: string; modifier: string }>> = {
  'cap-first-avenger': { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_CaptainAmericaFirstAvenger.mp4`, modifier: 'anim-theme-bg--cap-first-avenger' },
  convocation:         { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Convocation.mp4`,                modifier: 'anim-theme-bg--convocation'       },
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
  ultron:       { src: `${import.meta.env.BASE_URL}assets/backgrounds/BG_Ultron.mp4`,      modifier: 'anim-theme-bg--ultron'     },
};

export function AnimatedThemeBackground({ theme }: Props) {
  const [videoError, setVideoError] = useState(false);
  const config = VIDEO_THEMES[theme];

  // Reset error state when theme switches so the new theme's video retries
  useEffect(() => { setVideoError(false); }, [theme]);

  if (!config) return null;

  return (
    <div className={`anim-theme-bg ${config.modifier}${videoError ? ' anim-theme-bg--fallback' : ''}`}>
      {!videoError && (
        <video
          src={config.src}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        />
      )}
      <div className="anim-theme-bg__overlay" />
    </div>
  );
}
