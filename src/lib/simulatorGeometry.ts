import { MM_PER_IN, BOARD_IN, P1_LINE_IN } from './simulatorConstants';
import type { SizeMm } from './simulatorConstants';

export const mmToInches = (mm: number): number => mm / MM_PER_IN;

// Radius of a base in inches (half the diameter)
export const getBaseRadiusIn = (mm: SizeMm): number => mmToInches(mm) / 2;

// Outer radius of a range ring (from centre) = base radius + range distance
export const getRangeRingRadiusIn = (baseMm: SizeMm, rangeIn: number): number =>
  getBaseRadiusIn(baseMm) + rangeIn;

// X coordinate of the end point of a move line (horizontal, from base edge)
export const getMoveEndX = (cx: number, baseMm: SizeMm, moveIn: number): number =>
  cx + getBaseRadiusIn(baseMm) + moveIn;

// Clamp a character centre so it stays fully inside the board
export const clampToBoard = (cx: number, cy: number, baseMm: SizeMm) => {
  const r = getBaseRadiusIn(baseMm);
  return {
    x: Math.max(r, Math.min(BOARD_IN - r, cx)),
    y: Math.max(r, Math.min(BOARD_IN - r, cy)),
  };
};

// Spawn position: bottom edge tangent to the P1 deploy line (y = 30)
export const getSpawnPosition = (counter: number, baseMm: SizeMm) => {
  const r = getBaseRadiusIn(baseMm);
  // stagger x across the bottom third of the board
  const xs = [8, 15, 22, 29, 8, 15, 22, 29];
  const x  = xs[(counter - 1) % xs.length];
  const y  = P1_LINE_IN - r;
  return { x, y };
};
