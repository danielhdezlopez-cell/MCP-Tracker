import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Leader } from '../data/leadersData';
import { type Mission } from '../data/missionsData';

export type Theme = 'neon-blue' | 'comic-ink' | 'adam-warlock' | 'apocalypse' | 'black-panther' | 'cable' | 'captain-america' | 'cap-first-avenger' | 'convocation' | 'cyclops' | 'dark-dimension' | 'daredevil' | 'doc-ock' | 'dr-strange' | 'dracula' | 'green-goblin' | 'hellfire-club' | 'hulkbuster' | 'hydra' | 'invincible-ironman' | 'king-tchalla' | 'kingpin' | 'klaw' | 'loki' | 'magik' | 'magneto' | 'mephisto' | 'midnight-sons' | 'modok' | 'mystique' | 'new-mutants' | 'onslaught' | 'professor-x' | 'sam-wilson' | 'sentinels' | 'shadowland-daredevil' | 'she-hulk' | 'shield' | 'asgard' | 'miles-morales' | 'spider-man' | 'starlord' | 'storm' | 'thanos' | 'thor' | 'the-leader' | 'thunderbolts' | 'ultron' | 'weapon-x' | 'winter-guard';
export type AppPage = 'main' | 'leaders' | 'missions' | 'settings';
export type AssignSide = 'left' | 'right';
export type InteractiveBg = 'off' | 'tech-hex';
export type VideoBg = 'none' | 'hydra';

interface McpState {
  // Navigation
  currentPage: AppPage;
  pendingLeaderAssign: AssignSide | null;
  pendingMissionType: 'Secure' | 'Extract' | null;

  // Game state
  scoreLeft: number;
  scoreRight: number;
  leaderLeft: Leader | null;
  leaderRight: Leader | null;
  round: number;
  selectedSecure: Mission | null;
  selectedExtract: Mission | null;

  // Timer
  timerDuration: number;
  timerRemaining: number;
  timerRunning: boolean;

  // Settings
  theme: Theme;
  brightness: number;
  selectedBackground: string;
  interactiveBg: InteractiveBg;
  videoBg: VideoBg;

  // Actions
  setCurrentPage: (page: AppPage) => void;
  setPendingLeaderAssign: (side: AssignSide | null) => void;
  setPendingMissionType: (type: 'Secure' | 'Extract' | null) => void;

  setScoreLeft: (score: number) => void;
  setScoreRight: (score: number) => void;
  setLeaderLeft: (leader: Leader | null) => void;
  setLeaderRight: (leader: Leader | null) => void;
  setRound: (round: number) => void;
  setSelectedSecure: (mission: Mission | null) => void;
  setSelectedExtract: (mission: Mission | null) => void;

  setTimerDuration: (duration: number) => void;
  setTimerRemaining: (remaining: number) => void;
  setTimerRunning: (running: boolean) => void;

  setTheme: (theme: Theme) => void;
  setBrightness: (brightness: number) => void;
  setSelectedBackground: (bg: string) => void;
  setInteractiveBg: (bg: InteractiveBg) => void;
  setVideoBg: (bg: VideoBg) => void;

  resetGame: () => void;
}

// Name-based P1 auto-theme table — checked before affiliation rules.
// Exact match against Leader.name; covers all characters in the theme table.
const P1_NAME_THEME_MAP: Partial<Record<string, Theme>> = {
  'Thor':               'thor',
  'Captain America':    'captain-america',
  'Magneto':            'magneto',
  'Mystique':           'mystique',
  'Doctor Strange':     'dr-strange',
  'Magik':              'magik',
  'Sentinel Prime MK4': 'sentinels',
  'Doctor Octopus':     'doc-ock',
  'Green Goblin':       'green-goblin',
  'Cyclops':            'cyclops',
  'Professor X':        'professor-x',
  'Crimson Dynamo':     'winter-guard',
  'Cable':              'cable',
  'Daredevil':          'daredevil',
  'Shadowlands Daredevil': 'shadowland-daredevil',
  'Klaw':               'klaw',
  'Invincible Iron Man': 'invincible-ironman',
  "King T'Challa":      'king-tchalla',
  'Kingpin':            'kingpin',
  'Adam Warlock':       'adam-warlock',
  'Black Panther':      'black-panther',
  'Starlord':           'starlord',
  'Loki':               'loki',
  'She-Hulk':           'she-hulk',
  'Storm':              'storm',
  'M.O.D.O.K.':         'modok',
  'Onslaught':          'onslaught',
  'Leader':             'the-leader',
  'The Leader':         'the-leader', // fallback alias for any persisted old data
};

function getThemeFromLeader(leader: Leader): Theme | null {
  const { name, affiliations } = leader;

  // Name-based rules take priority over affiliation rules
  if (P1_NAME_THEME_MAP[name]) return P1_NAME_THEME_MAP[name]!;

  // Special cases by leader (checked before affiliation rules)
  if (affiliations.includes('Avengers') && name.toLowerCase().includes('captain america')) {
    return 'cap-first-avenger';
  }
  if (affiliations.includes('Avengers') && name === 'Hulkbuster') {
    return 'hulkbuster';
  }

  // Affiliation-based rules
  if (affiliations.includes('Apocalypse'))     return 'apocalypse';
  if (affiliations.includes('Convocation'))    return 'convocation';
  if (affiliations.includes('Dark Dimension')) return 'dark-dimension';
  if (affiliations.includes('Dracula'))        return 'dracula';
  if (affiliations.includes('Hellfire Club'))  return 'hellfire-club';
  if (affiliations.includes('Mephisto'))       return 'mephisto';
  if (affiliations.includes('Midnight Sons'))  return 'midnight-sons';
  if (affiliations.includes('Weapon X'))       return 'weapon-x';
  if (affiliations.includes('Thunderbolts'))   return 'thunderbolts';

  // Legacy affiliation rules
  if (name === 'Miles Morales')                return 'miles-morales';
  if (name === 'Amazing Spider-Man')           return 'spider-man';
  if (affiliations.includes('Asgard'))         return 'asgard';
  if (affiliations.includes('Hydra'))          return 'hydra';
  if (affiliations.includes('S.H.I.E.L.D.'))  return 'shield';
  if (affiliations.includes('Black Order'))    return 'thanos';
  if (affiliations.includes('Cabal'))          return 'ultron';

  return null;
}

export const useMcpStore = create<McpState>()(
  persist(
    (set, get) => ({
      currentPage: 'main',
      pendingLeaderAssign: null,
      pendingMissionType: null,

      scoreLeft: 0,
      scoreRight: 0,
      leaderLeft: null,
      leaderRight: null,
      round: 1,
      selectedSecure: null,
      selectedExtract: null,

      timerDuration: 90 * 60,
      timerRemaining: 90 * 60,
      timerRunning: false,

      theme: 'shield',
      brightness: 80,
      selectedBackground: '',
      interactiveBg: 'off',
      videoBg: 'none',

      setCurrentPage: (page) => set({ currentPage: page }),
      setPendingLeaderAssign: (side) => set({ pendingLeaderAssign: side }),
      setPendingMissionType: (type) => set({ pendingMissionType: type }),

      setScoreLeft: (score) => set({ scoreLeft: Math.max(0, Math.min(20, score)) }),
      setScoreRight: (score) => set({ scoreRight: Math.max(0, Math.min(20, score)) }),
      setLeaderLeft: (leader) => {
        const autoTheme = leader ? getThemeFromLeader(leader) : null;
        if (autoTheme !== null) {
          set({ leaderLeft: leader, theme: autoTheme, interactiveBg: autoTheme === 'neon-blue' ? 'tech-hex' : 'off' });
        } else {
          set({ leaderLeft: leader });
        }
      },
      setLeaderRight: (leader) => set({ leaderRight: leader }),
      setRound: (round) => set({ round: Math.max(1, Math.min(6, round)) }),
      setSelectedSecure: (mission) => set({ selectedSecure: mission }),
      setSelectedExtract: (mission) => set({ selectedExtract: mission }),

      setTimerDuration: (duration) => {
        const current = get();
        set({ timerDuration: duration, timerRemaining: duration, timerRunning: false });
        void current;
      },
      setTimerRemaining: (remaining) => set({ timerRemaining: Math.max(0, remaining) }),
      setTimerRunning: (running) => set({ timerRunning: running }),

      setTheme: (theme) => {
        // Tech Hex Grid auto-enables with neon-blue, auto-disables otherwise
        set({ theme, interactiveBg: theme === 'neon-blue' ? 'tech-hex' : 'off' });
      },
      setBrightness: (brightness) => set({ brightness }),
      setSelectedBackground: (bg) => set({ selectedBackground: bg }),
      setInteractiveBg: (bg) => {
        // Ignore any attempt to enable tech-hex outside neon-blue
        if (bg !== 'off' && get().theme !== 'neon-blue') return;
        set({ interactiveBg: bg });
      },
      setVideoBg: (bg) => set({ videoBg: bg }),

      resetGame: () => {
        const { timerDuration } = get();
        set({
          scoreLeft: 0,
          scoreRight: 0,
          leaderLeft: null,
          leaderRight: null,
          round: 1,
          selectedSecure: null,
          selectedExtract: null,
          timerRemaining: timerDuration,
          timerRunning: false,
        });
      },
    }),
    {
      name: 'mcp-tracker-store',
      onRehydrateStorage: () => (state) => {
        if (state && !(['off', 'tech-hex'] as string[]).includes(state.interactiveBg)) {
          state.interactiveBg = 'tech-hex';
        }
        // Migrate removed/unknown themes → shield
        if (state && !(['adam-warlock', 'apocalypse', 'black-panther', 'cable', 'captain-america', 'cap-first-avenger', 'convocation', 'dark-dimension', 'daredevil', 'doc-ock', 'dr-strange', 'dracula', 'green-goblin', 'hellfire-club', 'hulkbuster', 'hydra', 'invincible-ironman', 'king-tchalla', 'kingpin', 'klaw', 'loki', 'magik', 'magneto', 'mephisto', 'midnight-sons', 'modok', 'mystique', 'new-mutants', 'onslaught', 'professor-x', 'sam-wilson', 'sentinels', 'shadowland-daredevil', 'she-hulk', 'shield', 'asgard', 'miles-morales', 'spider-man', 'starlord', 'storm', 'thanos', 'thor', 'the-leader', 'thunderbolts', 'ultron', 'weapon-x', 'winter-guard'] as string[]).includes(state.theme)) {
          state.theme = 'shield';
        }
        // Tech Hex Grid disabled (no neon-blue theme in active set)
        if (state && state.interactiveBg !== 'off') {
          state.interactiveBg = 'off';
        }
        if (state && !(['none', 'hydra'] as string[]).includes(state.videoBg)) {
          state.videoBg = 'none';
        }
      },
    }
  )
);
