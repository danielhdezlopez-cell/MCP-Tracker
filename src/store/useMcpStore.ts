import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Leader } from '../data/leadersData';
import { type Mission } from '../data/missionsData';

export type Theme = 'neon-blue' | 'comic-ink' | 'hydra';
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

      theme: 'neon-blue',
      brightness: 80,
      selectedBackground: '',
      interactiveBg: 'tech-hex',
      videoBg: 'none',

      setCurrentPage: (page) => set({ currentPage: page }),
      setPendingLeaderAssign: (side) => set({ pendingLeaderAssign: side }),
      setPendingMissionType: (type) => set({ pendingMissionType: type }),

      setScoreLeft: (score) => set({ scoreLeft: Math.max(0, Math.min(20, score)) }),
      setScoreRight: (score) => set({ scoreRight: Math.max(0, Math.min(20, score)) }),
      setLeaderLeft: (leader) => set({ leaderLeft: leader }),
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
        // Tech Hex Grid is exclusive to neon-blue — silently turn it off otherwise
        if (theme !== 'neon-blue' && get().interactiveBg !== 'off') {
          set({ theme, interactiveBg: 'off' });
        } else {
          set({ theme });
        }
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
        // Migrate removed/unknown themes → neon-blue
        if (state && !(['neon-blue', 'comic-ink', 'hydra'] as string[]).includes(state.theme)) {
          state.theme = 'neon-blue';
        }
        // Tech Hex Grid only valid under neon-blue
        if (state && state.theme !== 'neon-blue' && state.interactiveBg !== 'off') {
          state.interactiveBg = 'off';
        }
        if (state && !(['none', 'hydra'] as string[]).includes(state.videoBg)) {
          state.videoBg = 'none';
        }
      },
    }
  )
);
