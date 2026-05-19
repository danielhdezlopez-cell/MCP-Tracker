.side-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
  min-width: 64px;
  height: 100%;
  background: var(--color-panel);
  border-right: 1px solid var(--color-border);
  padding: 8px 0;
  gap: 4px;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.side-nav::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom,
    transparent,
    var(--color-accent-left) 30%,
    var(--color-accent-left) 70%,
    transparent
  );
  opacity: 0.4;
}

.side-nav__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 4px;
  border-bottom: 1px solid var(--color-border);
  width: 100%;
}

.side-nav__logo-text {
  font-family: var(--font-display);
  font-size: var(--fs-13);
  font-weight: 900;
  color: var(--color-accent-left);
  letter-spacing: 0.08em;
  text-shadow: 0 0 8px var(--color-accent-left);
  line-height: 1;
}

.side-nav__logo-sub {
  font-family: var(--font-display);
  font-size: var(--fs-9);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  line-height: 1.2;
  margin-top: 2px;
}

.side-nav__items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  width: 100%;
  padding: 0 4px;
}

.side-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 2px;
  border-radius: var(--border-radius);
  border: 1px solid transparent;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-size: var(--fs-10);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: all var(--transition);
  cursor: pointer;
  background: transparent;
  gap: 4px;
  min-height: 56px;
}

.side-nav__item:hover {
  color: var(--color-text);
  background: var(--color-panel-alt);
  border-color: var(--color-border);
}

.side-nav__item.active {
  color: var(--color-accent-left);
  background: var(--color-panel-alt);
  border-color: var(--color-accent-left);
  box-shadow: 0 0 8px var(--color-glow-left), inset 0 0 8px rgba(0,195,255,0.05);
}

.side-nav__item.active .side-nav__icon {
  text-shadow: 0 0 8px var(--color-accent-left);
}

.side-nav__icon {
  font-size: 18px;
  line-height: 1;
}

.side-nav__label {
  font-size: var(--fs-10);
  letter-spacing: 0.04em;
  line-height: 1;
}

.side-nav__version {
  font-size: var(--fs-9);
  color: var(--color-text-muted);
  opacity: 0.5;
  padding: 4px;
  font-family: var(--font-display);
  letter-spacing: 0.06em;
}
