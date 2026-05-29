# MCP Tracker

**Marvel Crisis Protocol** game tracker PWA. Optimized for iPad Mini 6 landscape.

## Features

- Live score tracking for both players (0–20)
- Leader selection with affiliation filter and search
- Mission card selection (Secure & Extract)
- Round tracker (1–6)
- Countdown game timer with color warnings
- 4 visual themes: Neon Blue, Comic, Hydra Green, Wakanda
- Persistent state via localStorage
- Installable PWA (fullscreen, landscape orientation)

## Install & Run

```bash
npm install
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
```

## Add New Leader Images

Place PNG files in `/public/assets/leaders/` and update the `image` field in `src/data/leadersData.ts`:

```ts
{ id: 'new-leader', name: 'New Leader', affiliations: ['Affiliation'], image: '/assets/leaders/NewLeader.png' }
```

## Add New Missions

Edit `src/data/missionsData.ts` and append entries to `MISSIONS`:

```ts
{ id: 'mission-id', name: 'Mission Name', threat: 17, type: 'Secure' }
```

## Project Structure

```
src/
  components/   — Reusable UI components
  pages/        — MainPage, LeadersPage, MissionsPage, SettingsPage
  data/         — leadersData.ts, missionsData.ts
  store/        — useMcpStore.ts (Zustand + localStorage)
  styles/       — global.css, themes.css

public/assets/
  leaders/      — Leader portrait PNGs (49 included)
  icons/        — PWA icons (192px, 512px)
```

## Repository Safety

- **Do not commit `.env` files** or any variant. Use GitHub Secrets for sensitive values.
- **Do not commit tokens, API keys, or passwords** of any kind.
- **Work on feature branches**, not directly on `main`.
- **Open a Pull Request** before merging anything into `main`.
- **Verify the GitHub Pages build** passes before considering a release complete.
- See [SECURITY.md](./SECURITY.md) for the full security policy.

## Leaders Without Images (Placeholders)

Add PNG files to `public/assets/leaders/` to replace placeholders for:
- Thor → `Thor.png`
- Thanos → `Thanos.png`
- Emma Frost → `EmmaFrost.png`
- Octopus → `Octopus.png`
- Storm → `Storm.png`
- Weapon X → `WeaponX.png`
- Crimson Dynamo → `CrimsonDynamo.png`
