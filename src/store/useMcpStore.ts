import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Leader } from '../data/leadersData';
import { type Mission } from '../data/missionsData';

export type Theme = 'neon-blue' | 'comic-ink' | 'adam-warlock' | 'apocalypse' | 'asgard' | 'baron-strucker' | 'baron-zemo' | 'bastion' | 'black-bolt' | 'black-panther' | 'blade' | 'cable' | 'captain-america' | 'cap-first-avenger' | 'convocation' | 'corbus' | 'cyclops' | 'dark-dimension' | 'daredevil' | 'doc-ock' | 'dr-strange' | 'dracula' | 'elsa-bloodstone' | 'green-goblin' | 'hellfire-club' | 'hulkbuster' | 'hydra' | 'invincible-ironman' | 'kang' | 'kill-monger' | 'king-tchalla' | 'kingpin' | 'klaw' | 'loki' | 'magik' | 'magneto' | 'maximus-the-mad' | 'medusa' | 'mephisto' | 'midnight-sons' | 'modok' | 'mystique' | 'new-mutants' | 'nick-fury' | 'onslaught' | 'professor-x' | 'red-skull' | 'red-skull-master-of-hydra' | 'red-skull-master-of-the-world' | 'sam-wilson' | 'sentinels' | 'shadowland-daredevil' | 'she-hulk' | 'shield' | 'miles-morales' | 'spider-man' | 'starlord' | 'storm' | 'thanos' | 'thor' | 'the-leader' | 'thunderbolts' | 'ultron' | 'weapon-x' | 'winter-guard';
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

  // Kang tactics setup state (per player)
  kangLeftSetupAnswered: boolean;
  kangLeftChronalPlayed: boolean;
  kangLeftChronalRound: number | null;
  kangLeftTrustPlayed: boolean;
  kangLeftTrustRound: number | null;
  kangRightSetupAnswered: boolean;
  kangRightChronalPlayed: boolean;
  kangRightChronalRound: number | null;
  kangRightTrustPlayed: boolean;
  kangRightTrustRound: number | null;

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

  setKangLeftSetup: (data: { answered: boolean; chronalPlayed: boolean; chronalRound: number | null; trustPlayed: boolean; trustRound: number | null }) => void;
  setKangRightSetup: (data: { answered: boolean; chronalPlayed: boolean; chronalRound: number | null; trustPlayed: boolean; trustRound: number | null }) => void;

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
  'Corvus Glaive':      'corbus',
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
  'Baron Strucker':        'baron-strucker',
  'Baron Helmut Zemo':     'baron-zemo',
  'Baron Zemo':            'baron-zemo', // alias for any persisted old data
  'Bastion':               'bastion',
  'Blade':                 'blade',
  'Nick Fury':             'nick-fury',
  'Red Skull':                      'red-skull',
  'Red Skull, Master of Hydra':     'red-skull-master-of-hydra',
  'Red Skull, Master of the World': 'red-skull-master-of-the-world',
  'Sam Wilson':            'sam-wilson',
  'Shadowlands Daredevil': 'shadowland-daredevil',
  'Kang':               'kang',
  'Klaw':               'klaw',
  'Invincible Iron Man': 'invincible-ironman',
  "King T'Challa":      'king-tchalla',
  'Kingpin':            'kingpin',
  'Adam Warlock':       'adam-warlock',
  'Elsa Bloodstone':    'elsa-bloodstone',
  'Black Bolt':         'black-bolt',
  'Black Panther':      'black-panther',
  'Starlord':           'starlord',
  'Loki':               'loki',
  'She-Hulk':           'she-hulk',
  'Storm':              'storm',
  'Maximus the Mad':    'maximus-the-mad',
  'Medusa':             'medusa',
  'M.O.D.O.K.':         'modok',
  'Onslaught':          'onslaught',
  'Leader':             'the-leader',
  'The Leader':         'the-leader', // fallback alias for any persisted old data
  'Killmonger':         'kill-monger',
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

const KANG_LEFT_RESET = {
  kangLeftSetupAnswered: false,
  kangLeftChronalPlayed: false,
  kangLeftChronalRound: null as number | null,
  kangLeftTrustPlayed: false,
  kangLeftTrustRound: null as number | null,
};

const KANG_RIGHT_RESET = {
  kangRightSetupAnswered: false,
  kangRightChronalPlayed: false,
  kangRightChronalRound: null as number | null,
  kangRightTrustPlayed: false,
  kangRightTrustRound: null as number | null,
};

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

      kangLeftSetupAnswered: false,
      kangLeftChronalPlayed: false,
      kangLeftChronalRound: null,
      kangLeftTrustPlayed: false,
      kangLeftTrustRound: null,
      kangRightSetupAnswered: false,
      kangRightChronalPlayed: false,
      kangRightChronalRound: null,
      kangRightTrustPlayed: false,
      kangRightTrustRound: null,

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
        const kangReset = leader?.name !== 'Kang' ? KANG_LEFT_RESET : {};
        if (autoTheme !== null) {
          set({ leaderLeft: leader, theme: autoTheme, interactiveBg: autoTheme === 'neon-blue' ? 'tech-hex' : 'off', ...kangReset });
        } else {
          set({ leaderLeft: leader, ...kangReset });
        }
      },
      setLeaderRight: (leader) => {
        const kangReset = leader?.name !== 'Kang' ? KANG_RIGHT_RESET : {};
        set({ leaderRight: leader, ...kangReset });
      },
      setRound: (round) => set({ round: Math.max(1, Math.min(6, round)) }),
      setSelectedSecure: (mission) => {
        if (mission === null) {
          set({ selectedSecure: null, ...KANG_LEFT_RESET, ...KANG_RIGHT_RESET });
        } else {
          set({ selectedSecure: mission });
        }
      },
      setSelectedExtract: (mission) => {
        if (mission === null) {
          set({ selectedExtract: null, ...KANG_LEFT_RESET, ...KANG_RIGHT_RESET });
        } else {
          set({ selectedExtract: mission });
        }
      },

      setKangLeftSetup: (data) => set({
        kangLeftSetupAnswered: data.answered,
        kangLeftChronalPlayed: data.chronalPlayed,
        kangLeftChronalRound: data.chronalRound,
        kangLeftTrustPlayed: data.trustPlayed,
        kangLeftTrustRound: data.trustRound,
      }),
      setKangRightSetup: (data) => set({
        kangRightSetupAnswered: data.answered,
        kangRightChronalPlayed: data.chronalPlayed,
        kangRightChronalRound: data.chronalRound,
        kangRightTrustPlayed: data.trustPlayed,
        kangRightTrustRound: data.trustRound,
      }),

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
          ...KANG_LEFT_RESET,
          ...KANG_RIGHT_RESET,
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
        if (state && !(['adam-warlock', 'apocalypse', 'asgard', 'baron-strucker', 'baron-zemo', 'bastion', 'black-bolt', 'black-panther', 'blade', 'cable', 'captain-america', 'cap-first-avenger', 'convocation', 'corbus', 'dark-dimension', 'daredevil', 'doc-ock', 'dr-strange', 'dracula', 'elsa-bloodstone', 'green-goblin', 'hellfire-club', 'hulkbuster', 'hydra', 'invincible-ironman', 'kang', 'king-tchalla', 'kingpin', 'klaw', 'loki', 'magik', 'magneto', 'maximus-the-mad', 'medusa', 'mephisto', 'midnight-sons', 'modok', 'mystique', 'new-mutants', 'nick-fury', 'onslaught', 'professor-x', 'red-skull', 'red-skull-master-of-hydra', 'red-skull-master-of-the-world', 'sam-wilson', 'sentinels', 'shadowland-daredevil', 'she-hulk', 'shield', 'miles-morales', 'spider-man', 'starlord', 'storm', 'thanos', 'thor', 'the-leader', 'thunderbolts', 'ultron', 'weapon-x', 'winter-guard'] as string[]).includes(state.theme)) {
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
