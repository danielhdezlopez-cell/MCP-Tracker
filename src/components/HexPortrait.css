/* ── HexPortrait ──────────────────────────────────────────────────── */
.hex-portrait {
  --hex-size: 72px;
  --hex-clip: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
  width: var(--hex-size);
  height: var(--hex-size);
  flex-shrink: 0;
}

/* Ring hidden — leader images carry their own hex frame artwork */
.hex-portrait__ring {
  display: none;
}

/* Inner area: no clip-path, just centre the image */
.hex-portrait__inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

/* Image: contain so the full built-in hex frame is visible */
.hex-portrait__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  transition: filter var(--transition);
}

/* Glow via drop-shadow — follows the image's own transparent shape */
.hex-portrait--left.hex-portrait--selected  .hex-portrait__img,
.hex-portrait--left:hover  .hex-portrait__img {
  filter: drop-shadow(0 0 6px var(--color-glow-left));
}
.hex-portrait--right.hex-portrait--selected .hex-portrait__img,
.hex-portrait--right:hover .hex-portrait__img {
  filter: drop-shadow(0 0 6px var(--color-glow-right));
}
.hex-portrait--neutral.hex-portrait--selected .hex-portrait__img,
.hex-portrait--neutral:hover .hex-portrait__img {
  filter: drop-shadow(0 0 5px var(--color-glow-left));
}

/* Placeholder (no image) — hex clip applied here instead */
.hex-portrait__placeholder {
  clip-path: var(--hex-clip);
  background: radial-gradient(ellipse at 50% 40%, #111827 0%, #070b14 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: calc(var(--hex-size) * 0.28);
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

/* Empty slot (+ SELECT) — hex clip applied here too */
.hex-portrait__empty {
  clip-path: var(--hex-clip);
  background: radial-gradient(ellipse at 50% 40%, #111827 0%, #070b14 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 2px;
}
.hex-portrait__plus {
  font-size: calc(var(--hex-size) * 0.32);
  line-height: 1;
  color: var(--color-text-muted);
  opacity: 0.6;
}
.hex-portrait__hint {
  font-family: var(--font-display);
  font-size: calc(var(--hex-size) * 0.09);
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
  opacity: 0.7;
}
