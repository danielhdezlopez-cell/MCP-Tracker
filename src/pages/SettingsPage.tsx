import { useState } from 'react';
import { useMcpStore, type Theme } from '../store/useMcpStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import './SettingsPage.css';

const THEMES: { value: Theme; label: string; desc: string }[] = [
  { value: 'apocalypse',       label: 'Apocalypse',      desc: 'Ancient cosmic dominion — blue & gold HUD'      },
  { value: 'asgard',           label: 'Asgard',          desc: 'Mythic celestial command interface'              },
  { value: 'cap-first-avenger', label: 'First Avenger',  desc: 'Military retro-futuristic war room HUD'          },
  { value: 'convocation',      label: 'Convocation',     desc: 'Arcane sorcerer dimension — violet & cyan HUD'   },
  { value: 'cyclops',          label: 'Cyclops',         desc: 'X-Men tactical visor — red optic & blue HUD'     },
  { value: 'dark-dimension',   label: 'Dark Dimension',  desc: 'Dormammu hostile void — purple fire & red chaos' },
  { value: 'dracula',          label: 'Dracula',         desc: 'Gothic vampire castle — blood red & aged silver'  },
  { value: 'hellfire-club',    label: 'Hellfire Club',   desc: 'Secret aristocratic society — velvet red & gold'  },
  { value: 'hulkbuster',       label: 'Hulkbuster',      desc: 'Heavy armor power interface — red & gold'        },
  { value: 'hydra',       label: 'Hydra',         desc: 'Dark tactical — animated video BG'                },
  { value: 'mephisto',    label: 'Mephisto',      desc: 'Infernal demon lord — fire red & ember amber'     },
  { value: 'midnight-sons', label: 'Midnight Sons', desc: 'Occultist hunters — spectral cyan & blood fire'  },
  { value: 'miles-morales', label: 'Miles Morales', desc: 'Urban electric superhero comic-tech HUD'        },
  { value: 'sentinels',     label: 'Sentinels',    desc: 'Robotic exterminator surveillance HUD — purple & scanner blue' },
  { value: 'shield',        label: 'S.H.I.E.L.D.', desc: 'Elite tactical command interface'           },
  { value: 'spider-man', label: 'Spider-Man',   desc: 'Urban hero comic-tech dark city HUD'    },
  { value: 'thanos',       label: 'Thanos',       desc: 'Cosmic conqueror dark command interface'     },
  { value: 'thunderbolts', label: 'Thunderbolts', desc: 'Black-ops antihero tactical combat HUD'     },
  { value: 'ultron',       label: 'Ultron',       desc: 'Hostile machine empire command system'       },
  { value: 'weapon-x',    label: 'Weapon X',     desc: 'Black-site lab — cold cyan & alarm red HUD'  },
];


export function SettingsPage() {
  const {
    timerDuration, setTimerDuration,
    brightness, setBrightness,
    theme, setTheme,
    interactiveBg,
  } = useMcpStore();

  const [customMins, setCustomMins] = useState(Math.floor(timerDuration / 60));
  const [isCustom, setIsCustom] = useState(timerDuration !== 90 * 60 && timerDuration !== 120 * 60);

  const selectPreset = (mins: number) => {
    setCustomMins(mins);
    setIsCustom(false);
    setTimerDuration(mins * 60);
  };

  const selectCustom = () => {
    setIsCustom(true);
    setTimerDuration(customMins * 60);
  };

  const adjustCustom = (delta: number) => {
    const next = Math.max(5, Math.min(240, customMins + delta));
    setCustomMins(next);
    setTimerDuration(next * 60);
  };

  return (
    <div className="settings-page scroll-area">
      <AnimatedBackground mode={interactiveBg} />
      <div className="settings-page__inner">
        <div className="settings-section">
          <div className="settings-section__title">⏱ TIMER OPTIONS</div>
          <div className="settings-row">
            <button
              className={`btn-hud settings-preset-btn ${!isCustom && timerDuration === 90 * 60 ? 'active' : ''}`}
              onClick={() => selectPreset(90)}
            >
              90 MIN
            </button>
            <button
              className={`btn-hud settings-preset-btn ${!isCustom && timerDuration === 120 * 60 ? 'active' : ''}`}
              onClick={() => selectPreset(120)}
            >
              120 MIN
            </button>
            <button
              className={`btn-hud settings-preset-btn ${isCustom ? 'active' : ''}`}
              onClick={selectCustom}
            >
              CUSTOM
            </button>
          </div>
          {isCustom && (
            <div className="settings-row settings-custom-timer">
              <button className="btn-hud settings-adj-btn" onClick={() => adjustCustom(-5)}>−5 MIN</button>
              <span className="settings-custom-val">{customMins} MIN</span>
              <button className="btn-hud settings-adj-btn" onClick={() => adjustCustom(5)}>+5 MIN</button>
            </div>
          )}
        </div>

        <div className="settings-section">
          <div className="settings-section__title">⚙ GENERAL</div>
          <div className="settings-item">
            <label className="settings-item__label">BRIGHTNESS</label>
            <div className="settings-item__control">
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onChange={e => setBrightness(Number(e.target.value))}
                className="settings-slider"
              />
              <span className="settings-item__val">{brightness}%</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__title">🎨 THEMES</div>
          <div className="settings-themes">
            {THEMES.map(t => (
              <button
                key={t.value}
                className={`settings-theme-btn ${theme === t.value ? 'active' : ''}`}
                onClick={() => setTheme(t.value)}
                data-theme-preview={t.value}
              >
                <span className="settings-theme-btn__swatch" />
                <span className="settings-theme-btn__label">{t.label}</span>
                {theme === t.value && <span className="settings-theme-btn__check">✓</span>}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
