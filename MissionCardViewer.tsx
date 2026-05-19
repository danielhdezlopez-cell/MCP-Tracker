.leader-hex {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform var(--transition);
}

.leader-hex:active {
  transform: scale(0.95);
}

/* Portrait wrapper — holds the hex image and the corner HUD marks */
.leader-hex__portrait-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Corner bracket marks */
.leader-hex__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
  z-index: 2;
  transition: opacity var(--transition);
  opacity: 0.55;
}

.leader-hex--left .leader-hex__corner {
  border-color: var(--color-accent-left);
}

.leader-hex--right .leader-hex__corner {
  border-color: var(--color-accent-right);
}

.leader-hex__corner--tl {
  top: 2px; left: 2px;
  border-top: 1.5px solid;
  border-left: 1.5px solid;
}

.leader-hex__corner--tr {
  top: 2px; right: 2px;
  border-top: 1.5px solid;
  border-right: 1.5px solid;
}

.leader-hex__corner--bl {
  bottom: 2px; left: 2px;
  border-bottom: 1.5px solid;
  border-left: 1.5px solid;
}

.leader-hex__corner--br {
  bottom: 2px; right: 2px;
  border-bottom: 1.5px solid;
  border-right: 1.5px solid;
}

/* Hover: brighten corners + boost glow on portrait */
.leader-hex:hover .leader-hex__corner {
  opacity: 0.9;
}

/* Side energy bar below portrait, above name */
.leader-hex__portrait-wrap::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 20%;
  right: 20%;
  height: 1px;
  pointer-events: none;
  opacity: 0.5;
  transition: opacity var(--transition);
}

.leader-hex--left .leader-hex__portrait-wrap::after {
  background: linear-gradient(to right, transparent, var(--color-accent-left), transparent);
}

.leader-hex--right .leader-hex__portrait-wrap::after {
  background: linear-gradient(to right, transparent, var(--color-accent-right), transparent);
}

.leader-hex:hover .leader-hex__portrait-wrap::after {
  opacity: 0.8;
}

.leader-hex__name {
  font-family: var(--font-display);
  font-size: var(--fs-11);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
  max-width: 120px;
  line-height: 1.2;
}
