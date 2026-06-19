import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './MovementSimulator.css';
import {
  BOARD_IN, DEPLOY_IN, P1_LINE_IN, P2_LINE_IN,
  BASE_SIZES_MM, MCP_RANGES, RANGE_KEYS, MCP_MOVES, SIM_KEY, P1_COLOR, P2_COLOR,
} from '../lib/simulatorConstants';
import type { SizeMm, MoveKey, RangeKey } from '../lib/simulatorConstants';
import {
  getBaseRadiusIn, getRangeRingRadiusIn,
  clampToBoard, getSpawnPosition,
} from '../lib/simulatorGeometry';
import { MAP_SETUPS, MISSION_TO_SETUP, type MapSetup, type ObjectivePoint } from '../data/mapSetups';
import { SECURE_MISSIONS, EXTRACT_MISSIONS } from '../data/missionsData';
import { useMcpStore } from '../store/useMcpStore';
import { getLeaderBaseMm } from '../data/characterBaseSizes';
import { getLeaderMove } from '../data/leaderMovements';
import { getAffiliationIcon } from '../data/affiliationsFx';

// Objective token size: 1" diameter (25 mm) → 0.5" radius
const OBJ_R = 0.5;
const SECURE_COLOR  = '#00c3ff';
const EXTRACT_COLOR = '#ff3b30';

// Base size → token label
const BASE_LABEL: Record<number, string> = { 35: 'S', 50: 'M', 65: 'L' };

// Leader token colors
const P1_TOKEN_COLOR = '#00c3ff'; // cyan — matches P1_COLOR
const P2_TOKEN_COLOR = '#f43f5e'; // rose-red

function getInitials(name: string): string {
  const clean = name.replace(/\s*\(.*?\)\s*/g, '').replace(/,.*$/, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Character {
  id: string;
  baseMm: SizeMm;
  x: number;
  y: number;
  ranges: number[];
  move: MoveKey | null;
  moveAngleDeg: number; // degrees in SVG coords; -90 = straight up
  // Leader-only optional fields
  isLeader?: boolean;
  leaderSide?: 'p1' | 'p2';
  leaderInitials?: string;
  leaderIconSrc?: string;
}

// ── LocalStorage ──────────────────────────────────────────────────────────────
interface SimState { characters: Character[]; }

function loadState(): SimState {
  try {
    const raw = localStorage.getItem(SIM_KEY);
    if (!raw) return { characters: [] };
    const p = JSON.parse(raw);
    if (Array.isArray(p.characters)) {
      return {
        characters: (p.characters as Character[]).map(c => ({ ...c, moveAngleDeg: c.moveAngleDeg ?? -90 })),
      };
    }
    return { characters: [] };
  } catch { return { characters: [] }; }
}

function saveState(chars: Character[]) {
  try { localStorage.setItem(SIM_KEY, JSON.stringify({ characters: chars })); } catch { /* noop */ }
}

function initCounter(chars: Character[]): number {
  const nonLeaders = chars.filter(c => !c.isLeader);
  if (!nonLeaders.length) return 0;
  const nums = nonLeaders.map(c => parseInt(c.id.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
  return nums.length ? Math.max(...nums) : 0;
}

function makeLeaderChar(
  side: 'p1' | 'p2',
  leaderId: string,
  name: string,
  affiliations: string[],
  existingX?: number,
  existingY?: number,
): Character {
  const baseMm = getLeaderBaseMm(leaderId);
  const r = getBaseRadiusIn(baseMm);
  const defaultX = 18;
  const defaultY = side === 'p1' ? P1_LINE_IN - r : P2_LINE_IN + r;
  return {
    id: `leader-${side}`,
    baseMm,
    x: existingX ?? defaultX,
    y: existingY ?? defaultY,
    ranges: [],
    move: getLeaderMove(leaderId),
    // P1 (bottom) points up toward centre; P2 (top) points down toward centre
    moveAngleDeg: side === 'p1' ? -90 : 90,
    isLeader: true,
    leaderSide: side,
    leaderInitials: getInitials(name),
    leaderIconSrc: getAffiliationIcon(affiliations),
  };
}

// ── Objective token ───────────────────────────────────────────────────────────
function ObjectiveToken({ obj, color }: { obj: ObjectivePoint; color: string }) {
  return (
    <g key={obj.id}>
      <circle cx={obj.x} cy={obj.y} r={OBJ_R + 0.18}
        fill="none" stroke={color} strokeWidth="0.07" opacity="0.25"/>
      <circle cx={obj.x} cy={obj.y} r={OBJ_R}
        fill={`${color}22`} stroke={color} strokeWidth="0.1" opacity="0.95"/>
      <circle cx={obj.x} cy={obj.y} r={0.1} fill={color} opacity="0.9"/>
    </g>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function MovementSimulator() {
  const initialState = loadState();
  const [characters,    setCharacters]    = useState<Character[]>(initialState.characters);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [addSizeMm,     setAddSizeMm]     = useState<SizeMm>(35);
  // undefined = follow MAIN; '' = explicitly none; 'id' = user-selected mission id
  const [localSecureId,  setLocalSecureId]  = useState<string | undefined>(undefined);
  const [localExtractId, setLocalExtractId] = useState<string | undefined>(undefined);

  const svgRef        = useRef<SVGSVGElement>(null);
  const dragRef       = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const moveHandleRef = useRef<string | null>(null);
  const counterRef    = useRef(initCounter(initialState.characters));
  const prevLeaderLeftId  = useRef<string | null>(null);
  const prevLeaderRightId = useRef<string | null>(null);

  useEffect(() => { saveState(characters); }, [characters]);

  // ── MAIN state (Zustand) ──────────────────────────────────────────────────
  const selectedSecure  = useMcpStore(s => s.selectedSecure);
  const selectedExtract = useMcpStore(s => s.selectedExtract);
  const leaderLeft      = useMcpStore(s => s.leaderLeft);
  const leaderRight     = useMcpStore(s => s.leaderRight);

  // Sync P1 leader when leaderLeft changes in MAIN
  useEffect(() => {
    const newId = leaderLeft?.id ?? null;
    if (newId === prevLeaderLeftId.current) return;
    prevLeaderLeftId.current = newId;
    setCharacters(prev => {
      const without = prev.filter(c => c.leaderSide !== 'p1');
      if (!newId || !leaderLeft) return without;
      // Preserve current position if token was already on the board
      const existing = prev.find(c => c.leaderSide === 'p1');
      return [...without, makeLeaderChar('p1', newId, leaderLeft.name, leaderLeft.affiliations, existing?.x, existing?.y)];
    });
  }, [leaderLeft]);

  // Sync P2 leader when leaderRight changes in MAIN
  useEffect(() => {
    const newId = leaderRight?.id ?? null;
    if (newId === prevLeaderRightId.current) return;
    prevLeaderRightId.current = newId;
    setCharacters(prev => {
      const without = prev.filter(c => c.leaderSide !== 'p2');
      if (!newId || !leaderRight) return without;
      const existing = prev.find(c => c.leaderSide === 'p2');
      return [...without, makeLeaderChar('p2', newId, leaderRight.name, leaderRight.affiliations, existing?.x, existing?.y)];
    });
  }, [leaderRight]);

  // Effective mission ID: local override wins, else MAIN, else ''
  const effectiveSecureId  = localSecureId  !== undefined ? localSecureId  : (selectedSecure?.id  ?? '');
  const effectiveExtractId = localExtractId !== undefined ? localExtractId : (selectedExtract?.id ?? '');

  // Resolve map setup from effective mission id via MISSION_TO_SETUP
  const activeSecureSetup = useMemo<MapSetup | null>(() => {
    if (!effectiveSecureId) return null;
    const sid = MISSION_TO_SETUP[effectiveSecureId];
    return sid ? (MAP_SETUPS.find(s => s.id === sid) ?? null) : null;
  }, [effectiveSecureId]);

  const activeExtractSetup = useMemo<MapSetup | null>(() => {
    if (!effectiveExtractId) return null;
    const sid = MISSION_TO_SETUP[effectiveExtractId];
    return sid ? (MAP_SETUPS.find(s => s.id === sid) ?? null) : null;
  }, [effectiveExtractId]);

  // ── SVG coordinate helper ─────────────────────────────────────────────────
  const toSvgPt = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    return pt.matrixTransform(m.inverse());
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const deployCharacter = () => {
    counterRef.current += 1;
    const n = counterRef.current;
    const { x, y } = getSpawnPosition(n, addSizeMm);
    const ch: Character = { id: `A${n}`, baseMm: addSizeMm, x, y, ranges: [], move: null, moveAngleDeg: -90 };
    setCharacters(prev => [...prev, ch]);
    setTimeout(() => setSelectedId(ch.id), 0);
  };

  const reset = () => {
    setSelectedId(null);
    counterRef.current = 0;
    setLocalSecureId('');  // explicitly none — does not affect MAIN
    setLocalExtractId('');
    const respawned: Character[] = [];
    if (leaderLeft) respawned.push(makeLeaderChar('p1', leaderLeft.id, leaderLeft.name, leaderLeft.affiliations));
    if (leaderRight) respawned.push(makeLeaderChar('p2', leaderRight.id, leaderRight.name, leaderRight.affiliations));
    setCharacters(respawned);
    try { localStorage.removeItem(SIM_KEY); } catch { /* noop */ }
  };

  const toggleRange = (r: RangeKey) => {
    setCharacters(prev => prev.map(c => {
      if (c.id !== selectedId) return c;
      const has = c.ranges.includes(r);
      return { ...c, ranges: has ? c.ranges.filter(x => x !== r) : [...c.ranges, r].sort() };
    }));
  };

  const toggleMove = (m: MoveKey) => {
    setCharacters(prev => prev.map(c => {
      if (c.id !== selectedId) return c;
      return { ...c, move: c.move === m ? null : m };
    }));
  };

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const pt = toSvgPt(e);
    const ch = characters.find(c => c.id === id);
    if (!ch) return;
    dragRef.current = { id, ox: pt.x - ch.x, oy: pt.y - ch.y };
    setSelectedId(id);
  }, [characters, toSvgPt, setSelectedId]);

  const onMoveHandleDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    moveHandleRef.current = id;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (moveHandleRef.current) {
      const id = moveHandleRef.current;
      const pt = toSvgPt(e);
      setCharacters(prev => prev.map(c => {
        if (c.id !== id) return c;
        const dx = pt.x - c.x;
        const dy = pt.y - c.y;
        return { ...c, moveAngleDeg: Math.atan2(dy, dx) * 180 / Math.PI };
      }));
      return;
    }
    if (!dragRef.current) return;
    const { id, ox, oy } = dragRef.current;
    const pt = toSvgPt(e);
    setCharacters(prev => prev.map(c => {
      if (c.id !== id) return c;
      const { x, y } = clampToBoard(pt.x - ox, pt.y - oy, c.baseMm);
      return { ...c, x, y };
    }));
  }, [toSvgPt, setCharacters]);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    moveHandleRef.current = null;
  }, []);

  const selectedChar = characters.find(c => c.id === selectedId) ?? null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="msim">
      <div className="msim__body">
        {/* ── SVG Board ────────────────────────────────────────── */}
        <div className="msim__stage">
          <div className="msim__boardwrap">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${BOARD_IN} ${BOARD_IN}`}
              className="msim__svg"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onClick={() => setSelectedId(null)}
              aria-label="Movement simulator board"
            >
              <defs>
                <radialGradient id="msimBg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%"   stopColor="#0c1830"/>
                  <stop offset="70%"  stopColor="#060a16"/>
                  <stop offset="100%" stopColor="#04060e"/>
                </radialGradient>
                <linearGradient id="msimDzTop" x1="0" y1="0" x2="0" y2={DEPLOY_IN} gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor={P2_COLOR} stopOpacity="0.48"/>
                  <stop offset="100%" stopColor={P2_COLOR} stopOpacity="0.06"/>
                </linearGradient>
                <linearGradient id="msimDzBot" x1="0" y1={BOARD_IN} x2="0" y2={P1_LINE_IN} gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor={P1_COLOR} stopOpacity="0.48"/>
                  <stop offset="100%" stopColor={P1_COLOR} stopOpacity="0.06"/>
                </linearGradient>
              </defs>

              {/* Background */}
              <rect x={0} y={0} width={BOARD_IN} height={BOARD_IN} fill="url(#msimBg)"/>

              {/* 6" major grid */}
              {[6, 12, 18, 24, 30].map(v => (
                <g key={v}>
                  <line x1={v} y1={0} x2={v} y2={BOARD_IN} stroke="rgba(0,195,255,0.13)" strokeWidth="0.05"/>
                  <line x1={0} y1={v} x2={BOARD_IN} y2={v} stroke="rgba(0,195,255,0.13)" strokeWidth="0.05"/>
                </g>
              ))}
              {/* 1" minor grid */}
              {Array.from({ length: 35 }, (_, i) => i + 1)
                .filter(v => v % 6 !== 0)
                .map(v => (
                  <g key={v}>
                    <line x1={v} y1={0} x2={v} y2={BOARD_IN} stroke="rgba(100,150,220,0.045)" strokeWidth="0.025"/>
                    <line x1={0} y1={v} x2={BOARD_IN} y2={v} stroke="rgba(100,150,220,0.045)" strokeWidth="0.025"/>
                  </g>
                ))}

              {/* Center axes */}
              <line x1={18} y1={0} x2={18} y2={BOARD_IN} stroke="rgba(0,195,255,0.18)" strokeWidth="0.06" strokeDasharray="0.5 0.3"/>
              <line x1={0} y1={18} x2={BOARD_IN} y2={18} stroke="rgba(0,195,255,0.18)" strokeWidth="0.06" strokeDasharray="0.5 0.3"/>

              {/* Deploy zones */}
              <rect x={0} y={0}          width={BOARD_IN} height={DEPLOY_IN} fill="url(#msimDzTop)"/>
              <line x1={0} y1={P2_LINE_IN} x2={BOARD_IN} y2={P2_LINE_IN} stroke={`${P2_COLOR}ee`} strokeWidth="0.13"/>
              <rect x={0} y={P1_LINE_IN} width={BOARD_IN} height={DEPLOY_IN} fill="url(#msimDzBot)"/>
              <line x1={0} y1={P1_LINE_IN} x2={BOARD_IN} y2={P1_LINE_IN} stroke={`${P1_COLOR}ee`} strokeWidth="0.13"/>

              {/* Ruler labels */}
              {[6, 12, 18, 24, 30, 36].map(v => (
                <text key={`xl${v}`} x={v - 0.12} y={0.85} textAnchor="end"
                  fill="rgba(0,195,255,0.40)" fontSize="0.52" fontFamily="monospace">{v}"</text>
              ))}
              {[6, 12, 18, 24, 30].map(v => (
                <text key={`yl${v}`} x={0.45} y={v + 0.28} textAnchor="start"
                  fill="rgba(0,195,255,0.40)" fontSize="0.52" fontFamily="monospace">{v}"</text>
              ))}

              {/* ── Objective tokens — always rendered when a setup is active ── */}
              {activeSecureSetup?.objectives.map(obj => (
                <ObjectiveToken key={`sec-${obj.id}`} obj={obj} color={SECURE_COLOR}/>
              ))}
              {activeExtractSetup?.objectives.map(obj => (
                <ObjectiveToken key={`ext-${obj.id}`} obj={obj} color={EXTRACT_COLOR}/>
              ))}

              {/* ── Range rings ──────────────────────────────────── */}
              {characters.map(ch =>
                ch.ranges.map(r => {
                  const ringR = getRangeRingRadiusIn(ch.baseMm, MCP_RANGES[r]);
                  const labelAngle = 225 * Math.PI / 180;
                  const color = ch.isLeader
                    ? (ch.leaderSide === 'p1' ? P1_TOKEN_COLOR : P2_TOKEN_COLOR)
                    : P1_COLOR;
                  return (
                    <g key={`${ch.id}-r${r}`}>
                      <circle cx={ch.x} cy={ch.y} r={ringR}
                        fill="none" stroke={color} strokeWidth="0.07"
                        strokeDasharray="0.3 0.2" opacity="0.55"/>
                      <text
                        x={ch.x + (ringR + 0.4) * Math.cos(labelAngle)}
                        y={ch.y + (ringR + 0.4) * Math.sin(labelAngle)}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={color}
                        fontSize="0.75" fontFamily="monospace" fontWeight="bold" opacity="0.95">
                        R{r}
                      </text>
                    </g>
                  );
                })
              )}

              {/* ── Move lines ───────────────────────────────────── */}
              {characters.map(ch => {
                if (!ch.move) return null;
                const MOVE_COLOR = '#4ade80';
                const moveIn    = MCP_MOVES[ch.move];
                const baseR     = getBaseRadiusIn(ch.baseMm);
                const angleRad  = ch.moveAngleDeg * Math.PI / 180;
                const startX    = ch.x + Math.cos(angleRad) * baseR;
                const startY    = ch.y + Math.sin(angleRad) * baseR;
                const endX      = ch.x + Math.cos(angleRad) * (baseR + moveIn);
                const endY      = ch.y + Math.sin(angleRad) * (baseR + moveIn);
                // Label at midpoint, offset 0.55" perpendicular to the line
                const midX  = (startX + endX) / 2;
                const midY  = (startY + endY) / 2;
                const perpX = -Math.sin(angleRad) * 0.55;
                const perpY =  Math.cos(angleRad) * 0.55;
                const lblX  = midX + perpX;
                const lblY  = midY + perpY;
                return (
                  // Dragging any part of the line rotates it toward the pointer
                  <g key={`${ch.id}-mv`}
                    onPointerDown={e => onMoveHandleDown(e, ch.id)}
                    style={{ cursor: 'crosshair' }}>
                    {/* solid continuous line — wider, subtle */}
                    <line x1={startX} y1={startY} x2={endX} y2={endY}
                      stroke={MOVE_COLOR} strokeWidth="0.28" opacity="0.45"
                      strokeLinecap="round"/>
                    {/* lateral HUD label at midpoint */}
                    <rect x={lblX - 0.42} y={lblY - 0.32} width={0.84} height={0.64}
                      fill="#060d1a" fillOpacity="0.72" rx="0.10"
                      style={{ pointerEvents: 'none' }}/>
                    <text x={lblX} y={lblY}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={MOVE_COLOR} opacity="0.90"
                      fontSize="0.72" fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: 'none' }}>
                      {ch.move}
                    </text>
                  </g>
                );
              })}

              {/* ── Characters (non-leader) ───────────────────────── */}
              {characters.filter(ch => !ch.isLeader).map(ch => {
                const r       = getBaseRadiusIn(ch.baseMm);
                const isSel   = ch.id === selectedId;
                const lbl     = BASE_LABEL[ch.baseMm] ?? 'S';
                const logoR   = r * 0.78;
                const clipId  = `cc-${ch.id}`;
                // P1 leader logo used as translucent watermark inside each character token
                const p1Icon  = leaderLeft ? getAffiliationIcon(leaderLeft.affiliations) : '';
                return (
                  <g key={ch.id}
                    onPointerDown={e => onPointerDown(e, ch.id)}
                    onClick={e => e.stopPropagation()}
                    style={{ cursor: 'grab' }}>
                    <defs>
                      <clipPath id={clipId}>
                        <circle cx={ch.x} cy={ch.y} r={logoR}/>
                      </clipPath>
                    </defs>
                    {/* R1 secure-contest glow */}
                    <circle cx={ch.x} cy={ch.y} r={getRangeRingRadiusIn(ch.baseMm, 1)}
                      fill="#38bdf8" fillOpacity="0.06"
                      stroke="#38bdf8" strokeWidth="0.06" strokeOpacity="0.12"
                      style={{ pointerEvents: 'none' }}/>
                    {isSel && (
                      <circle cx={ch.x} cy={ch.y} r={r + 0.25}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.08" opacity="0.5"
                        strokeDasharray="0.4 0.25"/>
                    )}
                    <circle cx={ch.x} cy={ch.y} r={r}
                      fill={`${P1_COLOR}20`}
                      stroke={P1_COLOR}
                      strokeWidth={isSel ? 0.15 : 0.10}/>
                    {/* P1 leader logo — translucent watermark */}
                    {p1Icon && (
                      <image
                        href={p1Icon}
                        x={ch.x - logoR} y={ch.y - logoR}
                        width={logoR * 2} height={logoR * 2}
                        opacity="0.18"
                        clipPath={`url(#${clipId})`}
                        style={{ pointerEvents: 'none' }}/>
                    )}
                    {[0, 90, 180, 270].map(deg => {
                      const rad = deg * Math.PI / 180;
                      return (
                        <line key={deg}
                          x1={ch.x + Math.cos(rad) * (r - 0.15)}
                          y1={ch.y + Math.sin(rad) * (r - 0.15)}
                          x2={ch.x + Math.cos(rad) * (r + 0.12)}
                          y2={ch.y + Math.sin(rad) * (r + 0.12)}
                          stroke={P1_COLOR} strokeWidth="0.07" opacity="0.6"/>
                      );
                    })}
                    {/* Base size label — outside the circle, at bottom-right edge */}
                    <text x={ch.x + r * 0.72} y={ch.y + r + 0.28}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={P1_COLOR} opacity="0.75"
                      fontSize="0.38" fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {lbl}
                    </text>
                  </g>
                );
              })}

              {/* ── Leader tokens ────────────────────────────────── */}
              {characters.filter(ch => ch.isLeader).map(ch => {
                const r      = getBaseRadiusIn(ch.baseMm);
                const color  = ch.leaderSide === 'p1' ? P1_TOKEN_COLOR : P2_TOKEN_COLOR;
                const isSel  = ch.id === selectedId;
                const clipId = `lc-${ch.leaderSide}`;
                const logoR  = r * 0.78;
                return (
                  <g key={ch.id}
                    onPointerDown={e => onPointerDown(e, ch.id)}
                    onClick={e => e.stopPropagation()}
                    style={{ cursor: 'grab' }}>
                    <defs>
                      <clipPath id={clipId}>
                        <circle cx={ch.x} cy={ch.y} r={logoR}/>
                      </clipPath>
                    </defs>
                    {/* R1 glow */}
                    <circle cx={ch.x} cy={ch.y} r={getRangeRingRadiusIn(ch.baseMm, 1)}
                      fill={color} fillOpacity="0.06"
                      stroke={color} strokeWidth="0.06" strokeOpacity="0.12"
                      style={{ pointerEvents: 'none' }}/>
                    {/* Selection ring */}
                    {isSel && (
                      <circle cx={ch.x} cy={ch.y} r={r + 0.25}
                        fill="none" stroke={color} strokeWidth="0.08" opacity="0.5"
                        strokeDasharray="0.4 0.25"/>
                    )}
                    {/* Base circle */}
                    <circle cx={ch.x} cy={ch.y} r={r}
                      fill={`${color}28`} stroke={color}
                      strokeWidth={isSel ? 0.17 : 0.13}/>
                    {/* Dark backing so logo reads on the tinted base */}
                    <circle cx={ch.x} cy={ch.y} r={logoR}
                      fill="#060d1a" opacity="0.55"
                      style={{ pointerEvents: 'none' }}/>
                    {/* Affiliation logo — full opacity, clipped to inner circle */}
                    <image
                      href={ch.leaderIconSrc}
                      x={ch.x - logoR} y={ch.y - logoR}
                      width={logoR * 2} height={logoR * 2}
                      opacity="1"
                      clipPath={`url(#${clipId})`}
                      style={{ pointerEvents: 'none' }}/>
                    {/* Cross ticks on outer ring */}
                    {[0, 90, 180, 270].map(deg => {
                      const rad = deg * Math.PI / 180;
                      return (
                        <line key={deg}
                          x1={ch.x + Math.cos(rad) * (r - 0.15)}
                          y1={ch.y + Math.sin(rad) * (r - 0.15)}
                          x2={ch.x + Math.cos(rad) * (r + 0.12)}
                          y2={ch.y + Math.sin(rad) * (r + 0.12)}
                          stroke={color} strokeWidth="0.07" opacity="0.7"/>
                      );
                    })}
                    {/* Name abbreviation below token */}
                    <text x={ch.x} y={ch.y + r + 0.55}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={color} fontSize="0.42" fontFamily="monospace" fontWeight="bold"
                      opacity="0.9"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {ch.leaderInitials}
                    </text>
                  </g>
                );
              })}

              {/* Board border */}
              <rect x={0} y={0} width={BOARD_IN} height={BOARD_IN}
                fill="none" stroke={`${P1_COLOR}50`} strokeWidth="0.14"/>
            </svg>
          </div>
        </div>

        {/* ── Controls column ───────────────────────────────────── */}
        <div className="msim__ctrl">

          {/* CHARACTER */}
          <div className="msim__cgroup">
            <div className="msim__cgroup-title">Character</div>
            <div className="msim__cgroup-body">
              <div className="msim__seg">
                {BASE_SIZES_MM.map(mm => (
                  <button
                    key={mm}
                    className={`msim__seg-btn${addSizeMm === mm ? ' msim__seg-btn--on' : ''}`}
                    onClick={() => setAddSizeMm(mm)}
                  >
                    {mm}<span className="msim__seg-sub">mm</span>
                  </button>
                ))}
              </div>
              <button className="msim__deploy-btn" onClick={deployCharacter}>
                ＋ Deploy character
              </button>
            </div>
          </div>

          {/* RANGE */}
          <div className="msim__cgroup">
            <div className="msim__cgroup-title">Range</div>
            <div className="msim__cgroup-body">
              <div className="msim__rangerow">
                {RANGE_KEYS.map(r => (
                  <button
                    key={r}
                    className={`msim__range-btn${selectedChar?.ranges.includes(r) ? ' msim__range-btn--on' : ''}`}
                    onClick={() => toggleRange(r)}
                    disabled={!selectedChar}
                  >
                    R{r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MOVE */}
          <div className="msim__cgroup">
            <div className="msim__cgroup-title">Move</div>
            <div className="msim__cgroup-body">
              <div className="msim__rangerow">
                {(['S', 'M', 'L'] as MoveKey[]).map(m => (
                  <button
                    key={m}
                    className={`msim__range-btn${selectedChar?.move === m ? ' msim__range-btn--on' : ''}`}
                    onClick={() => toggleMove(m)}
                    disabled={!selectedChar}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CRISIS / OBJECTIVES */}
          <div className="msim__cgroup">
            <div className="msim__cgroup-title">Crisis</div>
            <div className="msim__cgroup-body">

              {/* SECURE dropdown */}
              <div className="msim__crisis-row">
                <span className="msim__crisis-dot msim__crisis-dot--secure"/>
                <select
                  className="msim__select msim__select--setup"
                  value={effectiveSecureId}
                  onChange={e => setLocalSecureId(e.target.value)}
                >
                  <option value="">SECURE:</option>
                  {SECURE_MISSIONS.map(m => (
                    <option key={m.id} value={m.id}>{m.threat} - {m.name}</option>
                  ))}
                </select>
              </div>

              {/* EXTRACT dropdown */}
              <div className="msim__crisis-row">
                <span className="msim__crisis-dot msim__crisis-dot--extract"/>
                <select
                  className="msim__select msim__select--setup"
                  value={effectiveExtractId}
                  onChange={e => setLocalExtractId(e.target.value)}
                >
                  <option value="">EXTRACT:</option>
                  {EXTRACT_MISSIONS.map(m => (
                    <option key={m.id} value={m.id}>{m.threat} - {m.name}</option>
                  ))}
                </select>
              </div>

              {/* Sync hint when following MAIN */}
              {localSecureId === undefined && localExtractId === undefined &&
               (selectedSecure || selectedExtract) && (
                <div className="msim__main-badge">Synced from MAIN</div>
              )}
            </div>
          </div>

          {/* RESET */}
          <button className="msim__reset-btn" onClick={reset} aria-label="Reset simulator" title="Reset simulator">
            ⟳
          </button>
        </div>
      </div>
    </div>
  );
}
