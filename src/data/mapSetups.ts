// MCP Crisis card objective placements
// Board: 36"×36", (0,0) = top-left, x=right, y=down
// Deployment zones: y=0–6 (top) and y=30–36 (bottom)
// Coordinates in inches

export type ObjType = 'secure' | 'extract';

export interface ObjectivePoint {
  id: string;
  x: number;
  y: number;
  type: ObjType;
}

export interface MapSetup {
  id: string;
  name: string;
  threat: number;
  type: ObjType;
  objectives: ObjectivePoint[];
}

function sec(id: string, x: number, y: number): ObjectivePoint {
  return { id, x, y, type: 'secure' };
}
function ext(id: string, x: number, y: number): ObjectivePoint {
  return { id, x, y, type: 'extract' };
}

export const MAP_SETUPS: MapSetup[] = [
  // ── SECURE CRISES ────────────────────────────────────────────────────────
  {
    id: 'mayor-fisk',
    name: "Mayor Fisk Vows to Make Marvel's Streets Safe",
    threat: 13,
    type: 'secure',
    objectives: [
      sec('A', 9,  18),
      sec('B', 18, 18),
      sec('C', 27, 18),
    ],
  },
  {
    id: 'research-station',
    name: 'Research Station Attacked!',
    threat: 13,
    type: 'secure',
    objectives: [
      sec('A', 6,  18),
      sec('B', 18, 18),
      sec('C', 30, 18),
    ],
  },
  {
    id: 'mutant-madman',
    name: 'Mutant Madman Turns City Center Into Lethal Amusement Park!',
    threat: 13,
    type: 'secure',
    objectives: [
      sec('A',  9,  9),
      sec('B', 27,  9),
      sec('C',  9, 27),
      sec('D', 27, 27),
    ],
  },
  {
    id: 'cosmic-invasion',
    name: 'Cosmic Invasion! Black Order Descends on Earth',
    threat: 17,
    type: 'secure',
    objectives: [
      sec('A',  6, 18),
      sec('B', 18, 18),
      sec('C', 30, 18),
    ],
  },
  {
    id: 'deadly-meteors',
    name: 'Deadly Meteors Mutate Civilians',
    threat: 17,
    type: 'secure',
    objectives: [
      sec('A', 18, 18),
      sec('B',  9, 18),
      sec('C', 27, 18),
      sec('D', 18,  9),
      sec('E', 18, 27),
    ],
  },
  {
    id: 'spider-infected',
    name: 'Spider-Infected Invade Manhattan',
    threat: 17,
    type: 'secure',
    objectives: [
      sec('A', 18, 18),
      sec('B',  9, 18),
      sec('C', 27, 18),
      sec('D', 18,  9),
      sec('E', 18, 27),
    ],
  },
  {
    id: 'gamma-wave',
    name: 'Gamma Wave Sweeps Across Midwest',
    threat: 19,
    type: 'secure',
    objectives: [
      sec('A',  6, 18),
      sec('B', 14, 18),
      sec('C', 22, 18),
      sec('D', 30, 18),
    ],
  },
  {
    id: 'skrulls',
    name: 'Skrulls Infiltrate World Leadership',
    threat: 17,
    type: 'secure',
    objectives: [
      sec('A',  9,  9),
      sec('B', 27,  9),
      sec('C', 18, 18),
      sec('D',  9, 27),
      sec('E', 27, 27),
    ],
  },
  // ── EXTRACT CRISES ───────────────────────────────────────────────────────
  {
    id: 'alien-ship',
    name: 'Alien Ship Crashes in Downtown!',
    threat: 13,
    type: 'extract',
    objectives: [
      ext('A',  6, 18),
      ext('B', 18, 18),
      ext('C', 30, 18),
    ],
  },
  {
    id: 'mystic-herbs',
    name: 'Mystic Wakandan Herbs: Fact or Fiction?',
    threat: 13,
    type: 'extract',
    objectives: [
      ext('A',  9, 18),
      ext('B', 18, 18),
      ext('C', 27, 18),
    ],
  },
  {
    id: 'fear-grips',
    name: 'Fear Grips World as Serum Cures Mutant X-Gene',
    threat: 15,
    type: 'extract',
    objectives: [
      ext('A',  9, 18),
      ext('B', 18, 18),
      ext('C', 27, 18),
    ],
  },
  {
    id: 'infinity-formula',
    name: 'Infinity Formula Goes Missing!',
    threat: 17,
    type: 'extract',
    objectives: [
      ext('A',  6, 18),
      ext('B', 18, 18),
      ext('C', 30, 18),
    ],
  },
  {
    id: 'montesi',
    name: 'The Montesi Formula Found',
    threat: 19,
    type: 'extract',
    objectives: [
      ext('A',  9, 18),
      ext('B', 18, 18),
      ext('C', 27, 18),
    ],
  },
  {
    id: 'demons-downtown',
    name: 'Demons Downtown! Has Our Hero Gone Too Far?',
    threat: 17,
    type: 'extract',
    objectives: [
      ext('A',  9,  9),
      ext('B', 27,  9),
      ext('C', 18, 18),
      ext('D',  9, 27),
      ext('E', 27, 27),
    ],
  },
  {
    id: 'terrigen-clouds',
    name: 'Terrigen Clouds Sweep Across America',
    threat: 19,
    type: 'extract',
    objectives: [
      ext('A',  9, 18),
      ext('B', 18, 18),
      ext('C', 27, 18),
      ext('D', 18, 10),
      ext('E', 18, 26),
    ],
  },
];
