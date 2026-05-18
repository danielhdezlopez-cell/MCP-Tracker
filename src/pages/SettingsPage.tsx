import { useState } from 'react';
import { useMcpStore, type Theme } from '../store/useMcpStore';
import './SettingsPage.css';

const BACKGROUNDS = [
  { id: '', label: 'None (Dark)' },
];

const THEMES: { value: Theme; label: string; desc: string }[] = [
  { value: 'neon-blue', label: 'Neon Blue / Orange', desc: 'Default HUD sci-fi' },
  { value: 'comic', label: 'Comic Superhero', desc: 'Warm yellow-red comics' },
  { value: 'hydra-green', label: 'Dark Hydra Green', desc: 'Dark ops terminal' },
  { value: 'wakanda', label: 'Wakanda Purple / Gold', desc: 'Vibranium royalty' },
];

export function SettingsPage() {
  const {
    timerDuration, setTimerDuration,
    brightness, setBrightness,
    wifiEnabled, setWifiEnabled,
    ledStripEnabled, setLedStripEnabled,
    theme, setTheme,
    selectedBackground, setSelectedBackground,
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
    <div className="settings-page">
      <div className="page-title-bar">
        <div className="page-title-bar__deco page-title-bar__deco--left">
          <div className="page-title-bar__deco-line" />
          <div className="page-title-bar__deco-dot" />
        </div>
        <span className="page-title-bar__text">Settings</span>
        <div className="page-title-bar__deco page-title-bar__deco--right">
          <div className="page-title-bar__deco-dot" />
          <div className="page-title-bar__deco-line" />
        </div>
      </div>
      <div className="settings-page__inner scroll-area">
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
          <div className="settings-item">
            <label className="settings-item__label">WI-FI</label>
            <button
              className={`settings-toggle ${wifiEnabled ? 'on' : 'off'}`}
              onClick={() => setWifiEnabled(!wifiEnabled)}
              aria-label={`Wi-Fi ${wifiEnabled ? 'on' : 'off'}`}
            >
              <span className="settings-toggle__knob" />
            </button>
          </div>
          <div className="settings-item">
            <label className="settings-item__label">LED STRIP</label>
            <button
              className={`settings-toggle ${ledStripEnabled ? 'on' : 'off'}`}
              onClick={() => setLedStripEnabled(!ledStripEnabled)}
              aria-label={`LED Strip ${ledStripEnabled ? 'on' : 'off'}`}
            >
              <span className="settings-toggle__knob" />
            </button>
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

        <div className="settings-section">
          <div className="settings-section__title">🖼 MAIN BACKGROUND</div>
          <div className="settings-backgrounds">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                className={`settings-bg-btn ${selectedBackground === bg.id ? 'active' : ''}`}
                onClick={() => setSelectedBackground(bg.id)}
              >
                <div className="settings-bg-btn__preview">
                  {bg.id ? (
                    <img src={bg.id} alt={bg.label} />
                  ) : (
                    <div className="settings-bg-btn__none">—</div>
                  )}
                </div>
                <span className="settings-bg-btn__label">{bg.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
