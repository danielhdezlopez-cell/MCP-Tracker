# MCP Tracker VS Overlay

> **EXPERIMENTAL PROTOTYPE** — Tournament VS Layout inspired by fighting-game broadcast overlays (EVO style).
>
> The original MCP Tracker project at [`danielhdezlopez-cell/MCP-Tracker`](https://github.com/danielhdezlopez-cell/MCP-Tracker) is **untouched**. This is a completely separate repository.

---

## What This Is

A reskinned version of the MCP (Marvel Crisis Protocol) game tracker with a cinematic **VS Overlay** layout designed for tournament/stream broadcasting.

| Feature | Detail |
|---------|--------|
| Target device | iPad Mini 6 — landscape |
| Optimised for | ~1133 × 744 CSS px (2266×1488 physical at 2× DPR) |
| PWA support | Yes — fullscreen / standalone mode |
| Original repo | [`MCP-Tracker`](https://github.com/danielhdezlopez-cell/MCP-Tracker) — unchanged |

---

## Layout Overview

```
┌──────────────────────────────────────────────────────────────┐
│  [P1 NAME] [−] ## [+]  │  TIMER  ROUND  │  [+] ## [−] [P2 NAME]  │
├──────────────────────────────────────────────────────────────┤
│                        │               │                      │
│   P1 LEADER VIDEO BG   │     (VS)      │  P2 LEADER VIDEO BG  │
│     leader portrait    │               │    leader portrait   │
│                        │               │                      │
├──────────────────────────────────────────────────────────────┤
│  [ SECURE mission ]                [ EXTRACT mission ]        │
└──────────────────────────────────────────────────────────────┘
```

- **Split background**: each half shows the selected leader's theme video
- **P1 side**: crimson/red energy
- **P2 side**: cobalt/blue energy
- **VS separator**: cinematic center divider with metallic VS graphic
- **Top HUD**: both scores, timer, and round tracker — always visible

---

## All Functionality Preserved

- ✅ Score +/- (0–20) with victory state at 16+
- ✅ Editable timer (90 min default, tap to pause/resume, critical at ≤15 min)
- ✅ Round tracker (1–6) with Kang token badges
- ✅ Leader selection with automatic theme video
- ✅ Secure & Extract mission selection with threat display
- ✅ Mission card viewer (eye button)
- ✅ Kang Chronal Manipulation / Trust No One wizard
- ✅ Full game reset
- ✅ Fullscreen / PWA mode
- ✅ localStorage persistence
- ✅ Settings (timer presets, brightness, theme)
- ✅ Safari / iPad safe-area inset handling

---

## Assets

Leader images, mission cards, and background videos are **loaded from the original
MCP-Tracker GitHub Pages deployment**:

```
https://danielhdezlopez-cell.github.io/MCP-Tracker/assets/
```

### Local Development

For full local asset loading, copy the `public/assets/` folder from the original
MCP-Tracker repo into this project's `public/` directory, then set:

```bash
# .env.local
VITE_ASSETS_BASE=http://localhost:5173/
```

Otherwise assets load from GitHub Pages automatically (requires internet).

---

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
auto-deploys to GitHub Pages on every push to `main`.

### GitHub Pages Setup

1. Go to repo **Settings → Pages**
2. Set source to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

**Deployed URL:** `https://danielhdezlopez-cell.github.io/MCP-Tracker-VS-Overlay/`

---

## Design Notes

- Inspired by EVO / FGC (fighting game community) stream overlays
- Dark glass panels with metallic frames
- Red energy (P1) vs Blue energy (P2) split aesthetic
- Orbitron font for the HUD numerics
- Optimised for readability at streaming resolution
