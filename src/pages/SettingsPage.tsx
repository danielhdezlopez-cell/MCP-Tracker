import { useState } from 'react';
import { useMcpStore, type Theme } from '../store/useMcpStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import './SettingsPage.css';

const THEMES: { value: Theme; label: string; desc: string }[] = [
  { value: 'adam-warlock',     label: 'Adam Warlock',    desc: 'Cosmic Soul Gem guardian — golden divine & astral cyan HUD' },
  { value: 'apocalypse',       label: 'Apocalypse',      desc: 'Ancient cosmic dominion — blue & gold HUD'      },
  { value: 'asgard',           label: 'Asgard',          desc: 'Mythic celestial command interface'              },
  { value: 'baron-strucker',   label: 'Baron Strucker',  desc: 'Dark science paramilitary command — tactical green, carbon black & steel grey HUD' },
  { value: 'baron-zemo',       label: 'Baron Zemo',      desc: 'Aristocratic villain command — imperial purple, aged gold & dark tactical HUD' },
  { value: 'bastion',          label: 'Bastion',         desc: 'Anti-mutant techno-lab surveillance — hot magenta, cold steel & corrupted control HUD' },
  { value: 'blade',            label: 'Blade',           desc: 'Techno-gothic vampire hunter — carbon black, blood red & cold silver HUD' },
  { value: 'black-bolt',       label: 'Black Bolt',      desc: 'Inhuman silent king — electric cyan energy, royal blue & white-glow cosmic HUD' },
  { value: 'black-panther',    label: 'Black Panther',   desc: 'Wakandan vibranium tech — purple energy, cyan & royal gold HUD' },
  { value: 'cable',            label: 'Cable',           desc: 'Future soldier tactical HUD — blue & orange'    },
  { value: 'captain-america', label: 'Captain America', desc: 'Shield tactical command — blue, red & star white' },
  { value: 'cap-first-avenger', label: 'First Avenger',  desc: 'Military retro-futuristic war room HUD'          },
  { value: 'convocation',      label: 'Convocation',     desc: 'Arcane sorcerer dimension — violet & cyan HUD'   },
  { value: 'corbus',           label: 'Corbus',          desc: 'Dark cosmic warlord — necro-tech battlefield, teal energy & bone-white HUD' },
  { value: 'cyclops',          label: 'Cyclops',         desc: 'X-Men tactical visor — red optic & blue HUD'     },
  { value: 'daredevil',        label: 'Daredevil',       desc: "Hell's Kitchen vigilante — blood red, urban black & radar white HUD" },
  { value: 'dark-dimension',   label: 'Dark Dimension',  desc: 'Dormammu hostile void — purple fire & red chaos' },
  { value: 'doc-ock',          label: 'Doc Ock',         desc: 'Mechanical tentacle lab — reactor green & steel'  },
  { value: 'dr-strange',       label: 'Dr. Strange',     desc: 'Sorcerer Supreme — arcane gold & dimensional violet' },
  { value: 'dracula',          label: 'Dracula',         desc: 'Gothic vampire castle — blood red & aged silver'  },
  { value: 'elsa-bloodstone',  label: 'Elsa Bloodstone', desc: 'Supernatural hunter — blood orange, cold blue & dark leather HUD' },
  { value: 'green-goblin',     label: 'Green Goblin',   desc: 'Glider villain — toxic green & explosion orange'  },
  { value: 'hellfire-club',    label: 'Hellfire Club',   desc: 'Secret aristocratic society — velvet red & gold'  },
  { value: 'hulkbuster',       label: 'Hulkbuster',      desc: 'Heavy armor power interface — red & gold'        },
  { value: 'hydra',       label: 'Hydra',         desc: 'Dark tactical — animated video BG'                },
  { value: 'invincible-ironman', label: 'Invincible Ironman', desc: 'Stark tech HUD — arc reactor blue, armor red & gold interface' },
  { value: 'kang',              label: 'Kang',               desc: 'Temporal conqueror command interface — green-cyan temporal energy, violet power & dark space HUD' },
  { value: 'king-tchalla', label: "King T'Challa",   desc: "Wakandan warrior king — royal purple vibranium, cyan energy & gold HUD" },
  { value: 'kingpin',      label: 'Kingpin',         desc: 'Criminal empire — black marble, dark gold & blood red HUD' },
  { value: 'klaw',         label: 'Klaw',            desc: 'Sonic energy weapon — blood red, psionic magenta & vibranium cyan HUD' },
  { value: 'loki',         label: 'Loki',            desc: 'God of Mischief — arcane green magic, asgardian gold & shadow purple HUD' },
  { value: 'magik',       label: 'Magik',          desc: 'Limbo sorcerer — Soulsword yellow & void purple'  },
  { value: 'magneto',          label: 'Magneto',          desc: 'Magnetic supremacy — purple field & armour red'   },
  { value: 'maximus-the-mad',  label: 'Maximus The Mad',  desc: 'Mad genius Inhuman mastermind — cold silver, crimson menace & dark graphite HUD' },
  { value: 'medusa',           label: 'Medusa',         desc: 'Inhuman queen — regal violet, copper rose-gold & dark throne-room HUD' },
  { value: 'mephisto',    label: 'Mephisto',      desc: 'Infernal demon lord — fire red & ember amber'     },
  { value: 'midnight-sons', label: 'Midnight Sons', desc: 'Occultist hunters — spectral cyan & blood fire'  },
  { value: 'miles-morales', label: 'Miles Morales', desc: 'Urban electric superhero comic-tech HUD'        },
  { value: 'modok',         label: 'M.O.D.O.K.',   desc: 'AIM laboratory mind supremacy — yellow scientific, psionic purple & cyan data HUD' },
  { value: 'mystique',     label: 'Mystique',      desc: 'Shapeshifting infiltrator — tactical blue, fire orange & stealth' },
  { value: 'new-mutants',  label: 'New Mutants',   desc: 'Mutant academy squad — yellow uniform, psychic purple & cyan energy HUD' },
  { value: 'nick-fury',    label: 'Nick Fury',     desc: 'S.H.I.E.L.D. director tactical command — steel blue, carbon black & red alert HUD' },
  { value: 'onslaught',    label: 'Onslaught',     desc: 'Psionic doom — magenta mental energy & void HUD' },
  { value: 'professor-x',  label: 'Professor X',   desc: 'Cerebro telepathic interface — blue & violet HUD'  },
  { value: 'red-skull',                     label: 'Red Skull',                   desc: 'Classic villain command — blood red, carbon black & cosmic cyan HUD' },
  { value: 'red-skull-master-of-hydra',     label: 'Red Skull, Master of Hydra',     desc: 'Hydra dark science command — blood red, carbon black & cosmic cyan HUD' },
  { value: 'red-skull-master-of-the-world', label: 'Red Skull, Master of the World', desc: 'Global domination command — deep black, blood red & cosmic cube cyan HUD' },
  { value: 'sam-wilson',   label: 'Sam Wilson',    desc: 'Aerial combat HUD — tactical blue, red wings & cyan' },
  { value: 'sentinels',          label: 'Sentinels',           desc: 'Robotic exterminator surveillance HUD — purple & scanner blue' },
  { value: 'shadowland-daredevil', label: 'Shadowland Daredevil', desc: 'Rooftop noir vigilante — black leather, neon red & storm-lit city HUD' },
  { value: 'she-hulk',           label: 'She-Hulk',            desc: 'Gamma-powered attorney — neon green & purple suit HUD' },
  { value: 'shield',        label: 'S.H.I.E.L.D.', desc: 'Elite tactical command interface'           },
  { value: 'starlord',     label: 'Starlord',      desc: 'Space outlaw retro-futurist HUD — cosmic orange, neon blue & galaxy purple' },
  { value: 'storm',        label: 'Storm',         desc: 'Elemental storm goddess HUD — electric cyan, white lightning & violet energy' },
  { value: 'spider-man', label: 'Spider-Man',   desc: 'Urban hero comic-tech dark city HUD'    },
  { value: 'thanos',       label: 'Thanos',       desc: 'Cosmic conqueror dark command interface'     },
  { value: 'thor',         label: 'Thor',         desc: 'Asgardian storm god — lightning blue, cape red & golden rune HUD' },
  { value: 'the-leader',  label: 'Leader',        desc: 'Gamma lab intelligence — toxic green & cyan HUD' },
  { value: 'thunderbolts', label: 'Thunderbolts', desc: 'Black-ops antihero tactical combat HUD'     },
  { value: 'ultron',       label: 'Ultron',       desc: 'Hostile machine empire command system'       },
  { value: 'weapon-x',    label: 'Weapon X',     desc: 'Black-site lab — cold cyan & alarm red HUD'  },
  { value: 'winter-guard', label: 'Winter Guard', desc: 'Arctic military ops — Soviet red, ice blue & snow white HUD' },
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
