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

// Maps mission IDs (from missionsData.ts) to their map setup IDs here.
// Only missions with a matching setup can show objectives in the simulator.
export const MISSION_TO_SETUP: Readonly<Record<string, string>> = {
  'mutant-madman':      'mutant-madman',
  'deadly-meteors':     'deadly-meteors',
  'spider-infected':    'spider-infected',
  'alien-ship':         'alien-ship',
  'infinity-formula':   'infinity-formula',
  'skrulls-infiltrate': 'skrulls',
  'surprise-assault':   'surprise-assault',
  'scientific-samples':  'scientific-samples',
  'sentinel-schematics': 'sentinel-schematics',
  'royal-wedding':       'royal-wedding',
  'inhumans-weaponry':   'inhumans-weaponry',
  'salvaged-supplies':      'salvaged-supplies',
  'experimental-soldiers':  'experimental-soldiers',
};

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
    type: 'extract',
    objectives: [
      ext('A', 10, 13),  // upper-left
      ext('B', 10, 23),  // lower-left
      ext('C', 18, 18),  // center
      ext('D', 26, 13),  // upper-right
      ext('E', 26, 23),  // lower-right
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
  {
    id: 'surprise-assault',
    name: 'Surprise Assault! Mutant Homes Destroyed',
    threat: 16,
    type: 'extract',
    objectives: [
      ext('A',  8, 20),  // lower-left
      ext('B', 14, 16),  // upper-center-left
      ext('C', 22, 20),  // lower-center-right
      ext('D', 28, 16),  // upper-right
    ],
  },
  {
    id: 'scientific-samples',
    name: 'Scientific Samples Found In Discovered Universe',
    threat: 17,
    type: 'extract',
    objectives: [
      ext('A',  6, 18),  // left-center
      ext('B', 18, 10),  // top-center
      ext('C', 18, 26),  // bottom-center
      ext('D', 30, 18),  // right-center
    ],
  },
  {
    id: 'sentinel-schematics',
    name: 'Sentinel Schematics Sabotaged!',
    threat: 17,
    type: 'extract',
    objectives: [
      ext('A', 14, 14),  // upper-left
      ext('B', 14, 22),  // lower-left
      ext('C', 22, 14),  // upper-right
      ext('D', 22, 22),  // lower-right
    ],
  },
  {
    id: 'royal-wedding',
    name: 'Unexpected Guests Crash Royal Wedding',
    threat: 17,
    type: 'extract',
    objectives: [
      ext('A', 10, 13),  // upper-left
      ext('B', 10, 23),  // lower-left
      ext('C', 26, 13),  // upper-right
      ext('D', 26, 23),  // lower-right
    ],
  },
  {
    id: 'inhumans-weaponry',
    name: 'Inhumans Deploy Advanced Weaponry',
    threat: 18,
    type: 'extract',
    objectives: [
      ext('A',  6, 18),  // left-pair left
      ext('B', 10, 18),  // left-pair right
      ext('C', 26, 18),  // right-pair left
      ext('D', 30, 18),  // right-pair right
    ],
  },
  {
    id: 'salvaged-supplies',
    name: 'Salvaged Supplies Fuel Resistance Efforts',
    threat: 18,
    type: 'extract',
    objectives: [
      ext('A', 13, 16),  // upper-left
      ext('B', 23, 20),  // lower-right
    ],
  },
  {
    id: 'experimental-soldiers',
    name: 'Evidence Of Experimental Soldiers Exposed',
    threat: 19,
    type: 'extract',
    objectives: [
      ext('A',  8, 18),  // left
      ext('B', 18, 18),  // center
      ext('C', 28, 18),  // right
    ],
  },
];
