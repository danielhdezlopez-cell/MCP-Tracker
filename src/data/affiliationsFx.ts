/**
 * Affiliation visual FX — color + sigil glyph per faction.
 *
 * Used by AffiliationBackdrop to tint the MAIN background under
 * the Neon Blue / Orange theme. Each affiliation has:
 *   - color: hex used for the beam tint, sigil stroke, and stamp text
 *   - name:  short display string for the corner stamp
 *   - glyph: 1-2 character fallback rendered at the sigil center
 *   - customGlyph (optional): inner SVG markup that REPLACES the
 *     character fallback. The `currentColor` keyword in the markup
 *     inherits the affiliation color, so glyphs are theme-aware.
 */
export interface AffiliationFx {
  color: string;
  name: string;
  glyph: string;
  customGlyph?: string;
}

const DEFAULT_FX: AffiliationFx = {
  color: '#00c3ff',
  name: 'UNALIGNED',
  glyph: '◆',
};

export const AFFILIATION_FX: Record<string, AffiliationFx> = {
  // ── Curated custom sigils ───────────────────────────────────────────
  'Avengers': {
    color: '#d62828',
    name: 'AVENGERS',
    glyph: 'A',
    customGlyph: `
      <polygon points="100,42 113,84 156,84 122,108 135,150 100,124 65,150 78,108 44,84 87,84" fill="currentColor" opacity="0.9"/>
      <circle cx="100" cy="100" r="46" stroke="currentColor" stroke-width="2" fill="none"/>
    `,
  },
  'S.H.I.E.L.D.': {
    color: '#1d4ed8',
    name: 'S.H.I.E.L.D.',
    glyph: 'S',
    customGlyph: `
      <path d="M100 46 L142 64 L142 104 Q142 138 100 154 Q58 138 58 104 L58 64 Z"
            stroke="currentColor" stroke-width="3" fill="none"/>
      <ellipse cx="100" cy="98" rx="22" ry="14" fill="currentColor" opacity="0.85"/>
      <circle cx="100" cy="98" r="6" fill="#070b14"/>
      <path d="M82 116 Q100 130 118 116" stroke="currentColor" stroke-width="2.5" fill="none"/>
    `,
  },
  'Hydra': {
    color: '#1ec84d',
    name: 'HYDRA',
    glyph: 'H',
    customGlyph: `
      <ellipse cx="100" cy="86" rx="24" ry="32" fill="currentColor" opacity="0.85"/>
      <circle cx="86" cy="82" r="5" fill="#070b14"/>
      <circle cx="114" cy="82" r="5" fill="#070b14"/>
      <rect x="98" y="60" width="4" height="14" fill="currentColor"/>
      <path d="M100 118 Q72 132 60 158 M100 118 Q128 132 140 158 M100 122 Q90 152 76 168 M100 122 Q110 152 124 168"
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    `,
  },
  'Wakanda': {
    color: '#a855f7',
    name: 'WAKANDA',
    glyph: 'W',
    customGlyph: `
      <path d="M70 80 Q70 60 100 56 Q130 60 130 80 L132 100 Q130 130 100 142 Q70 130 68 100 Z"
            fill="currentColor" opacity="0.85"/>
      <polygon points="86,82 78,72 92,80" fill="#070b14"/>
      <polygon points="114,82 122,72 108,80" fill="#070b14"/>
      <circle cx="90" cy="98" r="3" fill="#070b14"/>
      <circle cx="110" cy="98" r="3" fill="#070b14"/>
      <path d="M94 120 Q100 124 106 120" stroke="#070b14" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `,
  },
  'Uncanny X-Men': {
    color: '#fbbf24',
    name: 'X-MEN',
    glyph: 'X',
    customGlyph: `
      <path d="M62 52 L88 100 L62 148 L80 148 L100 112 L120 148 L138 148 L112 100 L138 52 L120 52 L100 88 L80 52 Z"
            fill="currentColor" opacity="0.9"/>
    `,
  },
  'X-Force': {
    color: '#94a3b8',
    name: 'X-FORCE',
    glyph: 'X',
    customGlyph: `
      <path d="M62 52 L88 100 L62 148 L80 148 L100 112 L120 148 L138 148 L112 100 L138 52 L120 52 L100 88 L80 52 Z"
            fill="currentColor" opacity="0.8"/>
      <circle cx="100" cy="100" r="14" stroke="currentColor" stroke-width="3" fill="none"/>
    `,
  },
  'Web Warriors': {
    color: '#ef4444',
    name: 'WEB WARRIORS',
    glyph: 'W',
    customGlyph: `
      <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
        <line x1="100" y1="50" x2="100" y2="150"/>
        <line x1="50" y1="100" x2="150" y2="100"/>
        <line x1="65" y1="65" x2="135" y2="135"/>
        <line x1="135" y1="65" x2="65" y2="135"/>
        <circle cx="100" cy="100" r="20"/>
        <circle cx="100" cy="100" r="36"/>
        <circle cx="100" cy="100" r="52"/>
      </g>
      <ellipse cx="100" cy="100" rx="14" ry="10" fill="currentColor"/>
    `,
  },
  'Asgard': {
    color: '#ffb800',
    name: 'ASGARD',
    glyph: 'A',
    customGlyph: `
      <rect x="74" y="56" width="52" height="34" fill="currentColor" opacity="0.9" rx="3"/>
      <rect x="96" y="86" width="8" height="62" fill="currentColor"/>
      <line x1="60" y1="78" x2="80" y2="78" stroke="currentColor" stroke-width="3"/>
      <line x1="120" y1="78" x2="140" y2="78" stroke="currentColor" stroke-width="3"/>
    `,
  },
  'Black Order': {
    color: '#7c3aed',
    name: 'BLACK ORDER',
    glyph: '✦',
    customGlyph: `
      <g fill="currentColor">
        <polygon points="100,62 104,80 122,80 108,90 114,108 100,98 86,108 92,90 78,80 96,80"/>
        <polygon points="64,108 67,118 78,118 70,124 73,134 64,128 55,134 58,124 50,118 61,118" opacity="0.85"/>
        <polygon points="136,108 139,118 150,118 142,124 145,134 136,128 127,134 130,124 122,118 133,118" opacity="0.85"/>
        <polygon points="100,124 103,134 114,134 106,140 109,150 100,144 91,150 94,140 86,134 97,134" opacity="0.85"/>
      </g>
    `,
  },
  'Defenders': {
    color: '#f59e0b',
    name: 'DEFENDERS',
    glyph: 'D',
    customGlyph: `
      <polygon points="100,48 152,84 132,156 68,156 48,84"
               stroke="currentColor" stroke-width="3" fill="none"/>
      <polygon points="100,72 130,92 118,134 82,134 70,92"
               fill="currentColor" opacity="0.7"/>
    `,
  },
  'Brotherhood': {
    color: '#b91c1c',
    name: 'BROTHERHOOD',
    glyph: 'M',
    customGlyph: `
      <path d="M58 152 L58 56 L100 110 L142 56 L142 152"
            stroke="currentColor" stroke-width="6" fill="none" stroke-linejoin="miter"/>
    `,
  },

  // ── Color-only entries (use letter fallback) ────────────────────────
  'Apocalypse':         { color: '#8b5cf6', name: 'SERVANTS',           glyph: 'A' },
  'Cabal':              { color: '#6d28d9', name: 'CABAL',             glyph: 'C' },
  'Convocation':        { color: '#06b6d4', name: 'CONVOCATION',       glyph: '✺' },
  'Criminal Syndicate': { color: '#9ca3af', name: 'CRIM. SYNDICATE',   glyph: 'CS' },
  'Dark Dimension':     { color: '#db2777', name: 'DARK DIM.',         glyph: 'D' },
  'Dracula':            { color: '#991b1b', name: 'THRALLS',            glyph: 'D' },
  'Galaxy Guardians':   { color: '#84cc16', name: 'GUARDIANS',         glyph: 'G' },
  'Hellfire Club':      { color: '#dc2626', name: 'HELLFIRE',          glyph: 'H' },
  'Inhumans':           { color: '#14b8a6', name: 'INHUMANS',          glyph: 'I' },
  'Intelligencia':      { color: '#facc15', name: 'INTELLIGENCIA',     glyph: '!' },
  'Mephisto':           { color: '#ef4444', name: 'LEGION LOST',        glyph: 'M' },
  'Midnight Sons':      { color: '#7c3aed', name: 'MIDNIGHT SONS',     glyph: '☾' },
  'Mighty Avengers':    { color: '#f97316', name: 'MIGHTY AVENGERS',   glyph: 'M' },
  'New Mutants':        { color: '#a78bfa', name: 'NEW MUTANTS',       glyph: 'N' },
  "Onslaught's Grip":   { color: '#4c1d95', name: 'ONSLAUGHT',         glyph: 'O' },
  'Sentinels':          { color: '#94a3b8', name: 'SENTINELS',         glyph: 'S' },
  'Spider Foes':        { color: '#16a34a', name: 'SPIDER FOES',       glyph: 'S' },
  'Thunderbolts':       { color: '#fbbf24', name: 'THUNDERBOLTS',      glyph: 'T' },
  'Weapon X':           { color: '#65a30d', name: 'WEAPON X',          glyph: 'X' },
  'Winter Guard':       { color: '#38bdf8', name: 'WINTER GUARD',      glyph: 'W' },
  'A-Force':            { color: '#ec4899', name: 'A-FORCE',           glyph: 'A' },
};

export function getAffiliationFx(affiliations: string[] | undefined): AffiliationFx {
  if (!affiliations || affiliations.length === 0) return DEFAULT_FX;
  const primary = affiliations[0];
  const hit = AFFILIATION_FX[primary];
  if (hit) return hit;
  // Unknown affiliation — fall back to default color but show its initials
  const initials = primary
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return { ...DEFAULT_FX, name: primary.toUpperCase(), glyph: initials };
}
