# MCP Tracker

A premium Progressive Web App for managing **Marvel Crisis Protocol** game sessions. Designed for iPad Mini 6 in landscape, with a sci-fi HUD / comic book dashboard aesthetic.

## Features

- **Main Dashboard** — Score tracking (0–20), Leader selection via hexagonal panels, round tracker (1–6), mission card slots, countdown timer with visual alerts
- **Leaders** — 55+ leaders with images, filterable by affiliation, searchable by name, assign to Player 1 or Player 2
- **Crisis Cards** — Browse and select Secure / Extract missions with threat values
- **Settings** — Timer presets (90/120/Custom), brightness, Wi-Fi & LED strip toggles, 4 visual themes, background selector
- **PWA** — Installable, landscape-locked, offline-capable with service worker
- **Persistent state** — All game state saved to LocalStorage via Zustand

## Stack

- React 19 + TypeScript + Vite 8
- Zustand (state + localStorage persistence)
- CSS custom properties (4 themes: Neon Blue, Comic, Hydra Green, Wakanda)
- vite-plugin-pwa (service worker + Web App Manifest)

## Getting Started

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open http://localhost:5173/ in a browser (or on your iPad via the network IP shown in the terminal).

## Build for Production

```bash
npm run build
npm run preview
```

## Adding New Leaders

1. Add the PNG image to `public/assets/leaders/YourLeader.png`
2. Add an entry to `src/data/leadersData.ts`:

```ts
{
  id: 'your-leader-id',
  name: 'Your Leader',
  affiliations: ['Affiliation Name'],
  image: '/assets/leaders/YourLeader.png',
}
```

3. If the affiliation is new, also add it to the `AFFILIATIONS` array in the same file.

## Adding New Missions

Edit `src/data/missionsData.ts` and add an entry to the `MISSIONS` array:

```ts
{
  id: 'unique-id',
  name: 'Mission Name As Printed On Card',
  threat: 18,       // threat value from the card
  type: 'Secure',   // or 'Extract'
}
```

## Modifying Affiliations

The affiliation list is in `src/data/leadersData.ts` — the `AFFILIATIONS` export. Add new names alphabetically. These drive the filter sidebar on the Leaders page.

## Adding Background Images

1. Place your image in `public/assets/backgrounds/`
2. Edit `src/pages/SettingsPage.tsx` and add an entry to the `BACKGROUNDS` array:

```ts
{ id: '/assets/backgrounds/your-bg.jpg', label: 'My Background' }
```

## Image Mapping Notes

Three leaders currently use SVG placeholder illustrations (no real game art provided):
- **Crimson Dynamo** → `public/assets/leaders/CrimsonDynamo.svg`
- **Emma Frost** → `public/assets/leaders/EmmaFrost.svg`
- **Doctor Octopus** → `public/assets/leaders/Octopus.svg`

To replace them, drop a `.png` with the same base name and update the path in `src/data/leadersData.ts`.

## Project Structure

```
src/
  components/     — Reusable UI components
  pages/          — Full-screen page views
  data/           — Static game data (leaders, missions)
  store/          — Zustand global store (useMcpStore.ts)
  styles/         — global.css + themes.css
public/
  assets/
    leaders/      — Leader portrait PNGs/SVGs
    icons/        — PWA icons (192px, 512px)
    backgrounds/  — Optional background images for Main
```
