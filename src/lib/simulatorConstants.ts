// MCP board constants — all distances in inches
export const BOARD_IN   = 36;
export const MM_PER_IN  = 25.4;
export const DEPLOY_IN  = 6;
export const P1_LINE_IN = 30;   // player 1 deploy line (bottom)
export const P2_LINE_IN = 6;    // player 2 deploy line (top)

export const BASE_SIZES_MM = [35, 50, 65] as const;
export type SizeMm = 35 | 50 | 65;

// Official MCP ranges (inches), R1 excluded from simulator
export const MCP_RANGES: Record<number, number> = { 2: 3, 3: 6, 4: 8, 5: 10 };
export const RANGE_KEYS = [2, 3, 4, 5] as const;
export type RangeKey = 2 | 3 | 4 | 5;

// Official MCP movement distances (inches): Short / Medium / Long
export const MCP_MOVES = { S: 3.375, M: 5, L: 7.25 } as const;
export type MoveKey = 'S' | 'M' | 'L';

// Isolated localStorage key — must not overlap with global store keys
export const SIM_KEY = 'mcp-tracker-simulator-state';

// Colour tokens (Comic Tech / Cinematic palette)
export const P1_COLOR = '#00c3ff';   // cyan  — all characters + range rings
export const P2_COLOR = '#ff6a00';   // orange — P2 deploy zone accent
