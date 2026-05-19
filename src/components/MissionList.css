.mission-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
}

.mission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  min-height: 54px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition);
  text-align: left;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Micro left accent bar */
.mission-item--left  { border-left: 2px solid rgba(26, 143, 255, 0.35); }
.mission-item--right { border-left: 2px solid rgba(255, 47, 47, 0.35); }

.mission-item:hover {
  background: var(--color-panel-alt);
}

/* Hover / selected — SECURE blue */
.mission-item--left:hover,
.mission-item--left.selected {
  border-color: var(--color-mission-secure);
  border-left-width: 2px;
  box-shadow: 0 0 8px var(--color-glow-secure);
}

/* Hover / selected — EXTRACT red */
.mission-item--right:hover,
.mission-item--right.selected {
  border-color: var(--color-mission-extract);
  border-left-width: 2px;
  box-shadow: 0 0 8px var(--color-glow-extract);
}

/* Selected background tint */
.mission-item--left.selected  { background: rgba(26, 143, 255, 0.05); }
.mission-item--right.selected { background: rgba(255, 47, 47, 0.05); }

/* Check mark */
.mission-item__check {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.mission-item--left.selected  .mission-item__check { color: var(--color-mission-secure); }
.mission-item--right.selected .mission-item__check { color: var(--color-mission-extract); }

.mission-item__info {
  flex: 1;
  min-width: 0;
}

.mission-item__name {
  font-family: var(--font-display);
  font-size: var(--fs-13);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mission-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}

/* Type badge */
.mission-item__type {
  font-family: var(--font-display);
  font-size: var(--fs-10);
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.mission-item__type--left {
  background: rgba(26, 143, 255, 0.15);
  color: var(--color-mission-secure);
  border: 1px solid var(--color-mission-secure);
}

.mission-item__type--right {
  background: rgba(255, 47, 47, 0.15);
  color: var(--color-mission-extract);
  border: 1px solid var(--color-mission-extract);
}

.mission-item__threat-label {
  font-size: var(--fs-10);
  color: var(--color-text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.1em;
}

.mission-item__threat {
  font-family: var(--font-display);
  font-size: var(--fs-14);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}

.mission-item--left  .mission-item__threat { color: var(--color-mission-secure); }
.mission-item--right .mission-item__threat { color: var(--color-mission-extract); }

/* ── View card button ────────────────────────────────────────────── */
.mission-item__view-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition);
  color: var(--color-text-muted);
  margin-left: 4px;
  opacity: 0.6;
  padding: 0;
}

.mission-item__view-btn--left  { border-color: rgba(26, 143, 255, 0.25); }
.mission-item__view-btn--right { border-color: rgba(255, 47, 47, 0.25); }

.mission-item__view-btn--left:hover {
  opacity: 1;
  border-color: var(--color-mission-secure);
  box-shadow: 0 0 6px var(--color-glow-secure);
  color: var(--color-mission-secure);
  background: rgba(26, 143, 255, 0.08);
}

.mission-item__view-btn--right:hover {
  opacity: 1;
  border-color: var(--color-mission-extract);
  box-shadow: 0 0 6px var(--color-glow-extract);
  color: var(--color-mission-extract);
  background: rgba(255, 47, 47, 0.08);
}
