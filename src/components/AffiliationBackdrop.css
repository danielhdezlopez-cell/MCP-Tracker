/* ════════════════════════════════════════════════════════════════════
   Affiliation Backdrop — option A (sigil halo) + option C (color beam
   + corner stamp), combined. Sits BETWEEN the AnimatedBackground
   (Tech Hex Grid) and the MAIN page content, with mix-blend-mode
   screen so it composes with the grid instead of fighting it.

   Active only under [data-theme='neon-blue'] — the component checks
   this in the store and returns null otherwise.
   ════════════════════════════════════════════════════════════════════ */

.affiliation-backdrop {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  animation: aff-backdrop-fade-in 0.5s ease 0.1s forwards;
}

@keyframes aff-backdrop-fade-in {
  to { opacity: 1; }
}

.affiliation-backdrop__half {
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: filter 0.4s ease;
}

/* ── A · Sigil halo (rotating emblem behind portraits) ───────────── */
.affiliation-backdrop__sigil {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72%;
  aspect-ratio: 1 / 1;
  max-width: 280px;
  max-height: 280px;
  opacity: 0.18;
  mix-blend-mode: screen;
  filter: drop-shadow(0 0 14px var(--fx-color, #00c3ff));
  animation: aff-sigil-drift 26s ease-in-out infinite;
}

.affiliation-backdrop__sigil svg {
  width: 100%;
  height: 100%;
  animation: aff-sigil-spin 80s linear infinite;
}

@keyframes aff-sigil-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes aff-sigil-drift {
  0%, 100% { opacity: 0.18; }
  50%      { opacity: 0.28; }
}

/* ── C · Color beam (diagonal wash from player corner) ──────────── */
.affiliation-backdrop__beam {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
  opacity: 0.55;
  transition: opacity 0.6s ease, filter 0.6s ease;
}

.affiliation-backdrop__half--left .affiliation-backdrop__beam {
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--fx-color) 22%, transparent) 0%,
      color-mix(in srgb, var(--fx-color)  6%, transparent) 28%,
      transparent 55%),
    radial-gradient(60% 70% at 0% 50%,
      color-mix(in srgb, var(--fx-color) 18%, transparent) 0%,
      transparent 70%);
}

.affiliation-backdrop__half--right .affiliation-backdrop__beam {
  background:
    linear-gradient(225deg,
      color-mix(in srgb, var(--fx-color) 22%, transparent) 0%,
      color-mix(in srgb, var(--fx-color)  6%, transparent) 28%,
      transparent 55%),
    radial-gradient(60% 70% at 100% 50%,
      color-mix(in srgb, var(--fx-color) 18%, transparent) 0%,
      transparent 70%);
}

/* ── C · Corner stamp (faction badge) ──────────────────────────── */
.affiliation-backdrop__stamp {
  position: absolute;
  top: 6%;
  font-family: var(--font-display);
  background: rgba(7, 11, 20, 0.6);
  padding: 4px 8px 3px;
  border: 1px dashed currentColor;
  border-radius: 2px;
  line-height: 1.25;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-width: 60%;
  pointer-events: none;
}

.affiliation-backdrop__stamp--left {
  left: 6%;
  text-align: left;
  align-items: flex-start;
}

.affiliation-backdrop__stamp--right {
  right: 6%;
  text-align: right;
  align-items: flex-end;
}

.affiliation-backdrop__stamp-label {
  font-size: var(--fs-9);
  letter-spacing: 0.22em;
  opacity: 0.7;
  line-height: 1;
}

.affiliation-backdrop__stamp-val {
  font-size: var(--fs-11);
  letter-spacing: 0.12em;
  color: #fff;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* ── Score change flash ────────────────────────────────────────── */
.affiliation-backdrop__half.is-flashing .affiliation-backdrop__sigil {
  animation: aff-sigil-flash 1.4s ease-out 1, aff-sigil-spin 80s linear infinite;
}

@keyframes aff-sigil-flash {
  0%   { opacity: 0.18; transform: translate(-50%, -50%) scale(1); }
  20%  { opacity: 0.6;  transform: translate(-50%, -50%) scale(1.05); }
  100% { opacity: 0.18; transform: translate(-50%, -50%) scale(1); }
}

.affiliation-backdrop__half.is-flashing .affiliation-backdrop__beam {
  opacity: 0.95;
}

/* ── Timer critical state — beam stays brighter, both halves ──── */
.affiliation-backdrop__half.is-critical .affiliation-backdrop__beam {
  opacity: 0.85;
  filter: brightness(1.25);
}

/* ── 800×480 landscape — shrink sigil and stamp ────────────────── */
@media (max-height: 540px) and (orientation: landscape) {
  .affiliation-backdrop__sigil {
    width: 64%;
    max-width: 220px;
    max-height: 220px;
  }
  .affiliation-backdrop__stamp { top: 5%; padding: 3px 7px 2px; }
  .affiliation-backdrop__stamp-val { font-size: var(--fs-10); }
}

/* ── Mobile portrait — hide stamps (no room) but keep sigil ──── */
@media (max-width: 640px) {
  .affiliation-backdrop { flex-direction: column; }
  .affiliation-backdrop__sigil {
    width: 54%;
    max-width: 180px;
    max-height: 180px;
    opacity: 0.14;
  }
  .affiliation-backdrop__stamp { display: none; }
}

/* ── Respect reduced-motion preference ────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .affiliation-backdrop__sigil svg { animation: none; }
  .affiliation-backdrop__sigil { animation: none; opacity: 0.2; }
  .affiliation-backdrop__half.is-flashing .affiliation-backdrop__sigil { animation: none; }
}

/* ── Fallback: browsers without color-mix() get static rgba beam ─ */
@supports not (background: color-mix(in srgb, red 50%, transparent)) {
  .affiliation-backdrop__beam { opacity: 0.35; }
  .affiliation-backdrop__half--left .affiliation-backdrop__beam {
    background: linear-gradient(135deg, var(--fx-color), transparent 55%);
  }
  .affiliation-backdrop__half--right .affiliation-backdrop__beam {
    background: linear-gradient(225deg, var(--fx-color), transparent 55%);
  }
}
