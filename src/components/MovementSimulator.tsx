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
}

interface LeaderToken {
  side: 'p1' | 'p2';
  leaderId: string;
  baseMm: SizeMm;
  x: number;
  y: number;
  initials: string;
}

// ── LocalStorage ──────────────────────────────────────────────────────────────
interface SimState { characters: Character[]; leaderTokens: LeaderToken[]; }

function loadState(): SimState {
  try {
    const raw = localStorage.getItem(SIM_KEY);
    if (!raw) return { characters: [], leaderTokens: [] };
    const p = JSON.parse(raw);
    return {
      characters: Array.isArray(p.characters)
        ? (p.characters as Character[]).map(c => ({ ...c, moveAngleDeg: c.moveAngleDeg ?? -90 }))
        : [],
      leaderTokens: Array.isArray(p.leaderTokens) ? p.leaderTokens : [],
    };
  } catch { return { characters: [], leaderTokens: [] }; }
}

function saveState(chars: Character[], leaderTokens: LeaderToken[]) {
  try { localStorage.setItem(SIM_KEY, JSON.stringify({ characters: chars, leaderTokens })); } catch { /* noop */ }
}


function initCounter(chars: Character[]): number {
  if (!chars.length) return 0;
  const nums = chars.map(c => parseInt(c.id.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
  return nums.length ? Math.max(...nums) : 0;
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
  const [leaderTokens,  setLeaderTokens]  = useState<LeaderToken[]>(initialState.leaderTokens);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [addSizeMm,     setAddSizeMm]     = useState<SizeMm>(35);
  // undefined = follow MAIN; '' = explicitly none; 'id' = user-selected mission id
  const [localSecureId,  setLocalSecureId]  = useState<string | undefined>(undefined);
  const [localExtractId, setLocalExtractId] = useState<string | undefined>(undefined);

  const svgRef           = useRef<SVGSVGElement>(null);
  const dragRef          = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const dragLeaderRef    = useRef<{ side: 'p1'|'p2'; ox: number; oy: number } | null>(null);
  const moveHandleRef    = useRef<string | null>(null);
  const counterRef       = useRef(initCounter(initialState.characters));
  const prevLeaderLeftId  = useRef<string | null>(null);
  const prevLeaderRightId = useRef<string | null>(null);

  useEffect(() => { saveState(characters, leaderTokens); }, [characters, leaderTokens]);

  // ── MAIN state (Zustand) ──────────────────────────────────────────────────
  const selectedSecure  = useMcpStore(s => s.selectedSecure);
  const selectedExtract = useMcpStore(s => s.selectedExtract);
  const leaderLeft      = useMcpStore(s => s.leaderLeft);
  const leaderRight     = useMcpStore(s => s.leaderRight);

  // Sync leader tokens when leaders change in MAIN
  useEffect(() => {
    const newId = leaderLeft?.id ?? null;
    if (newId === prevLeaderLeftId.current) return;
    prevLeaderLeftId.current = newId;
    setLeaderTokens(prev => {
      const without = prev.filter(t => t.side !== 'p1');
      if (!newId || !leaderLeft) return without;
      const baseMm = getLeaderBaseMm(newId);
      const r = getBaseRadiusIn(baseMm);
      return [...without, {
        side: 'p1', leaderId: newId, baseMm,
        x: 18, y: P1_LINE_IN - r,
        initials: getInitials(leaderLeft.name),
      }];
    });
  }, [leaderLeft]);

  useEffect(() => {
    const newId = leaderRight?.id ?? null;
    if (newId === prevLeaderRightId.current) return;
    prevLeaderRightId.current = newId;
    setLeaderTokens(prev => {
      const without = prev.filter(t => t.side !== 'p2');
      if (!newId || !leaderRight) return without;
      const baseMm = getLeaderBaseMm(newId);
      const r = getBaseRadiusIn(baseMm);
      return [...without, {
        side: 'p2', leaderId: newId, baseMm,
        x: 18, y: P2_LINE_IN + r,
        initials: getInitials(leaderRight.name),
      }];
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
    setCharacters([]);
    setSelectedId(null);
    counterRef.current = 0;
    setLocalSecureId('');  // explicitly none — does not affect MAIN
    setLocalExtractId('');
    // Re-spawn leader tokens at default positions
    const respawned: LeaderToken[] = [];
    if (leaderLeft) {
      const bm = getLeaderBaseMm(leaderLeft.id);
      const r = getBaseRadiusIn(bm);
      respawned.push({ side: 'p1', leaderId: leaderLeft.id, baseMm: bm,
        x: 18, y: P1_LINE_IN - r,
        initials: getInitials(leaderLeft.name) });
    }
    if (leaderRight) {
      const bm = getLeaderBaseMm(leaderRight.id);
      const r = getBaseRadiusIn(bm);
      respawned.push({ side: 'p2', leaderId: leaderRight.id, baseMm: bm,
        x: 18, y: P2_LINE_IN + r,
        initials: getInitials(leaderRight.name) });
    }
    setLeaderTokens(respawned);
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

  const onLeaderPointerDown = useCallback((e: React.PointerEvent, side: 'p1'|'p2') => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const pt = toSvgPt(e);
    const tok = leaderTokens.find(t => t.side === side);
    if (!tok) return;
    dragLeaderRef.current = { side, ox: pt.x - tok.x, oy: pt.y - tok.y };
  }, [leaderTokens, toSvgPt]);

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
    if (dragLeaderRef.current) {
      const { side, ox, oy } = dragLeaderRef.current;
      const pt = toSvgPt(e);
      setLeaderTokens(prev => prev.map(t => {
        if (t.side !== side) return t;
        const { x, y } = clampToBoard(pt.x - ox, pt.y - oy, t.baseMm);
        return { ...t, x, y };
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
  }, [toSvgPt, setCharacters, setLeaderTokens]);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    dragLeaderRef.current = null;
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
                  return (
                    <g key={`${ch.id}-r${r}`}>
                      <circle cx={ch.x} cy={ch.y} r={ringR}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.07"
                        strokeDasharray="0.3 0.2" opacity="0.55"/>
                      <text
                        x={ch.x + (ringR + 0.4) * Math.cos(labelAngle)}
                        y={ch.y + (ringR + 0.4) * Math.sin(labelAngle)}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={P1_COLOR}
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
                const lblX = ch.x + Math.cos(angleRad) * (baseR + moveIn + 0.55);
                const lblY = ch.y + Math.sin(angleRad) * (baseR + moveIn + 0.55);
                return (
                  <g key={`${ch.id}-mv`}>
                    <line x1={startX} y1={startY} x2={endX} y2={endY}
                      stroke={MOVE_COLOR} strokeWidth="0.65" opacity="0.18"/>
                    <line x1={startX} y1={startY} x2={endX} y2={endY}
                      stroke={MOVE_COLOR} strokeWidth="0.32" opacity="0.95"
                      strokeLinecap="round"/>
                    <circle cx={endX} cy={endY} r={0.28}
                      fill="#040c1a" stroke="#f97316" strokeWidth="0.18"
                      style={{ cursor: 'crosshair' }}
                      onPointerDown={e => onMoveHandleDown(e, ch.id)}/>
                    <rect x={lblX - 0.42} y={lblY - 0.32} width={0.84} height={0.58}
                      fill={MOVE_COLOR} rx="0.1"/>
                    <text x={lblX} y={lblY}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="#021018"
                      fontSize="0.50" fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: 'none' }}>
                      {ch.move}
                    </text>
                  </g>
                );
              })}

              {/* ── Characters ───────────────────────────────────── */}
              {characters.map(ch => {
                const r     = getBaseRadiusIn(ch.baseMm);
                const isSel = ch.id === selectedId;
                const lbl   = BASE_LABEL[ch.baseMm] ?? 'S';
                return (
                  <g key={ch.id}
                    onPointerDown={e => onPointerDown(e, ch.id)}
                    onClick={e => e.stopPropagation()}
                    style={{ cursor: 'grab' }}>
                    {/* R1 secure-contest glow — soft area, no hard border */}
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
                    <text x={ch.x} y={ch.y}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="white"
                      fontSize={r * 1.1} fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {lbl}
                    </text>
                  </g>
                );
              })}

              {/* ── Leader tokens ────────────────────────────────── */}
              {leaderTokens.map(tok => {
                const r     = getBaseRadiusIn(tok.baseMm);
                const color = tok.side === 'p1' ? P1_TOKEN_COLOR : P2_TOKEN_COLOR;
                const fontSize = tok.baseMm === 65 ? r * 0.9 : tok.baseMm === 50 ? r * 1.0 : r * 1.1;
                return (
                  <g key={tok.side}
                    onPointerDown={e => onLeaderPointerDown(e, tok.side)}
                    onClick={e => e.stopPropagation()}
                    style={{ cursor: 'grab' }}>
                    {/* R1 glow */}
                    <circle cx={tok.x} cy={tok.y} r={getRangeRingRadiusIn(tok.baseMm, 1)}
                      fill={color} fillOpacity="0.06"
                      stroke={color} strokeWidth="0.06" strokeOpacity="0.12"
                      style={{ pointerEvents: 'none' }}/>
                    {/* Base circle */}
                    <circle cx={tok.x} cy={tok.y} r={r}
                      fill={`${color}28`} stroke={color} strokeWidth="0.13"/>
                    {/* Cross ticks */}
                    {[0, 90, 180, 270].map(deg => {
                      const rad = deg * Math.PI / 180;
                      return (
                        <line key={deg}
                          x1={tok.x + Math.cos(rad) * (r - 0.15)}
                          y1={tok.y + Math.sin(rad) * (r - 0.15)}
                          x2={tok.x + Math.cos(rad) * (r + 0.12)}
                          y2={tok.y + Math.sin(rad) * (r + 0.12)}
                          stroke={color} strokeWidth="0.07" opacity="0.7"/>
                      );
                    })}
                    {/* Initials */}
                    <text x={tok.x} y={tok.y}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={color}
                      fontSize={fontSize} fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {tok.initials}
                    </text>
                    {/* Side badge */}
                    <text x={tok.x} y={tok.y + r + 0.55}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={color} fontSize="0.38" fontFamily="monospace" opacity="0.75"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {tok.side === 'p1' ? 'P1' : 'P2'}
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

              {/* SECURE dropdown — options = all Secure missions */}
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

              {/* EXTRACT dropdown — options = all Extract missions */}
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
