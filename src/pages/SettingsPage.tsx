import { useState } from 'react';
import { useMcpStore, type Theme } from '../store/useMcpStore';
import { AnimatedBackground } from '../components/AnimatedBackground';
import './SettingsPage.css';

const THEMES: { value: Theme; label: string; desc: string }[] = [
  { value: 'neon-blue', label: 'Neon Blue / Orange', desc: 'Default HUD sci-fi' },
  { value: 'comic-ink', label: 'Comic Ink',          desc: 'Paper, halftone & ink panels' },
  { value: 'hydra',     label: 'Hydra',              desc: 'Dark tactical — animated video BG' },
  { value: 'shield',    label: 'S.H.I.E.L.D.',       desc: 'Elite tactical command interface' },
  { value: 'asgard',      label: 'Asgard',        desc: 'Mythic celestial command interface'     },
  { value: 'spider-man', label: 'Spider-Man',    desc: 'Urban hero comic-tech dark city HUD'    },
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
                <span className="settings-theme-btn__desc">{t.desc}</span>
                {theme === t.value && <span className="settings-theme-btn__check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
