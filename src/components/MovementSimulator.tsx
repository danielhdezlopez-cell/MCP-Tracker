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
import { MAP_SETUPS, MISSION_TO_SETUP, type MapSetup } from '../data/mapSetups';
import { MISSIONS } from '../data/missionsData';
import { useMcpStore } from '../store/useMcpStore';

// Fallback dropdown: only missions from MISSIONS panel that have objective coordinates
const SECURE_WITH_SETUP  = MISSIONS.filter(m => m.type === 'Secure'  && MISSION_TO_SETUP[m.id]);
const EXTRACT_WITH_SETUP = MISSIONS.filter(m => m.type === 'Extract' && MISSION_TO_SETUP[m.id]);

// Base size → token label
const BASE_LABEL: Record<number, string> = { 35: 'S', 50: 'M', 65: 'L' };

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

// ── LocalStorage ──────────────────────────────────────────────────────────────
function loadChars(): Character[] {
  try {
    const raw = localStorage.getItem(SIM_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw);
    if (!Array.isArray(p.characters)) return [];
    return (p.characters as Character[]).map(c => ({
      ...c,
      moveAngleDeg: c.moveAngleDeg ?? -90,
    }));
  } catch { return []; }
}

function saveChars(chars: Character[]) {
  try { localStorage.setItem(SIM_KEY, JSON.stringify({ characters: chars })); } catch { /* noop */ }
}

function initCounter(chars: Character[]): number {
  if (!chars.length) return 0;
  const nums = chars.map(c => parseInt(c.id.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
  return nums.length ? Math.max(...nums) : 0;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function MovementSimulator() {
  const initial = loadChars();
  const [characters, setCharacters] = useState<Character[]>(initial);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [addSizeMm,   setAddSizeMm]   = useState<SizeMm>(35);
  const [manualSetupId, setManualSetupId] = useState<string | null>(null);

  const svgRef          = useRef<SVGSVGElement>(null);
  const dragRef         = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const moveHandleRef   = useRef<string | null>(null); // character id being angle-dragged
  const counterRef      = useRef(initCounter(initial));

  useEffect(() => { saveChars(characters); }, [characters]);
  useEffect(() => { try { localStorage.removeItem('mcp-simulator-v1'); } catch { /* noop */ } }, []);

  // ── MAIN missions (Zustand) ────────────────────────────────────────────────
  const selectedSecure  = useMcpStore(s => s.selectedSecure);
  const selectedExtract = useMcpStore(s => s.selectedExtract);

  const mainSetups = useMemo<MapSetup[]>(() => {
    const result: MapSetup[] = [];
    for (const m of [selectedSecure, selectedExtract]) {
      if (!m) continue;
      const sid = MISSION_TO_SETUP[m.id];
      if (!sid) continue;
      const setup = MAP_SETUPS.find(s => s.id === sid);
      if (setup) result.push(setup);
    }
    return result;
  }, [selectedSecure, selectedExtract]);

  const isMainActive = mainSetups.length > 0;

  const manualSetup = !isMainActive && manualSetupId
    ? (MAP_SETUPS.find(s => s.id === manualSetupId) ?? null)
    : null;

  const activeSetups: MapSetup[] = isMainActive ? mainSetups : (manualSetup ? [manualSetup] : []);
  const isObjectivesMode = activeSetups.length > 0;

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
  }, [characters, toSvgPt]);

  const onMoveHandleDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    moveHandleRef.current = id;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    // Move-handle rotation takes priority
    if (moveHandleRef.current) {
      const id = moveHandleRef.current;
      const pt = toSvgPt(e);
      setCharacters(prev => prev.map(c => {
        if (c.id !== id) return c;
        const dx = pt.x - c.x;
        const dy = pt.y - c.y;
        const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
        return { ...c, moveAngleDeg: angleDeg };
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
  }, [toSvgPt]);

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
                {/* Board background radial gradient */}
                <radialGradient id="msimBg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%"   stopColor="#0c1830"/>
                  <stop offset="70%"  stopColor="#060a16"/>
                  <stop offset="100%" stopColor="#04060e"/>
                </radialGradient>
                {/* P2 deploy zone (top, orange) */}
                <linearGradient id="msimDzTop" x1="0" y1="0" x2="0" y2={DEPLOY_IN} gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor={P2_COLOR} stopOpacity="0.48"/>
                  <stop offset="100%" stopColor={P2_COLOR} stopOpacity="0.06"/>
                </linearGradient>
                {/* P1 deploy zone (bottom, cyan) */}
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

              {/* ── Range rings — movement mode only ────────────── */}
              {!isObjectivesMode && characters.map(ch =>
                ch.ranges.map(r => {
                  const ringR = getRangeRingRadiusIn(ch.baseMm, MCP_RANGES[r]);
                  // 225° in SVG coords = upper-left visually
                  const labelAngle = 225 * Math.PI / 180;
                  const lx = ch.x + (ringR + 0.4) * Math.cos(labelAngle);
                  const ly = ch.y + (ringR + 0.4) * Math.sin(labelAngle);
                  return (
                    <g key={`${ch.id}-r${r}`}>
                      <circle cx={ch.x} cy={ch.y} r={ringR}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.07"
                        strokeDasharray="0.3 0.2" opacity="0.55"/>
                      <text
                        x={lx} y={ly}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={P1_COLOR}
                        fontSize="0.75" fontFamily="monospace" fontWeight="bold" opacity="0.95">
                        R{r}
                      </text>
                    </g>
                  );
                })
              )}

              {/* ── Move lines — movement mode only ─────────────── */}
              {!isObjectivesMode && characters.map(ch => {
                if (!ch.move) return null;
                const MOVE_COLOR = '#4ade80';
                const moveIn    = MCP_MOVES[ch.move];
                const angleRad  = ch.moveAngleDeg * Math.PI / 180;
                const endX      = ch.x + Math.cos(angleRad) * moveIn;
                const endY      = ch.y + Math.sin(angleRad) * moveIn;
                // Label box slightly past end point
                const lblX = ch.x + Math.cos(angleRad) * (moveIn + 0.55);
                const lblY = ch.y + Math.sin(angleRad) * (moveIn + 0.55);
                return (
                  <g key={`${ch.id}-mv`}>
                    {/* Glow shadow */}
                    <line x1={ch.x} y1={ch.y} x2={endX} y2={endY}
                      stroke={MOVE_COLOR} strokeWidth="0.35" opacity="0.18"/>
                    {/* Main line */}
                    <line x1={ch.x} y1={ch.y} x2={endX} y2={endY}
                      stroke={MOVE_COLOR} strokeWidth="0.16" opacity="0.95"
                      strokeLinecap="round"/>
                    {/* End marker — draggable */}
                    <circle cx={endX} cy={endY} r={0.28}
                      fill="#040c1a" stroke={MOVE_COLOR} strokeWidth="0.12"
                      style={{ cursor: 'crosshair' }}
                      onPointerDown={e => onMoveHandleDown(e, ch.id)}/>
                    {/* Move label */}
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

              {/* ── Objective markers ────────────────────────────── */}
              {activeSetups.map(setup =>
                setup.objectives.map(obj => {
                  const isSecure = obj.type === 'secure';
                  const stroke = isSecure ? P1_COLOR : P2_COLOR;
                  const fill   = isSecure ? 'rgba(0,195,255,0.15)' : 'rgba(255,106,0,0.15)';
                  return (
                    <g key={`${setup.id}-${obj.id}`}>
                      <circle cx={obj.x} cy={obj.y} r={0.55}
                        fill={fill} stroke={stroke} strokeWidth="0.09"/>
                      <circle cx={obj.x} cy={obj.y} r={0.12} fill={stroke} opacity="0.9"/>
                      <text x={obj.x} y={obj.y - 0.72}
                        textAnchor="middle" fill={stroke}
                        fontSize="0.52" fontFamily="monospace" fontWeight="bold" opacity="0.95">
                        {obj.id}
                      </text>
                    </g>
                  );
                })
              )}

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
                    {/* Selection halo */}
                    {isSel && (
                      <circle cx={ch.x} cy={ch.y} r={r + 0.25}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.08" opacity="0.5"
                        strokeDasharray="0.4 0.25"/>
                    )}
                    {/* Base circle */}
                    <circle cx={ch.x} cy={ch.y} r={r}
                      fill={`${P1_COLOR}20`}
                      stroke={P1_COLOR}
                      strokeWidth={isSel ? 0.15 : 0.10}/>
                    {/* Cross-hair accents at cardinal points */}
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
                    {/* Size label: S / M / L */}
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

          {/* RANGE — movement mode only */}
          {!isObjectivesMode && (
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
          )}

          {/* MOVE — movement mode only */}
          {!isObjectivesMode && (
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
          )}

          {/* OBJECTIVES */}
          <div className="msim__cgroup">
            <div className="msim__cgroup-title">Objectives</div>
            <div className="msim__cgroup-body">
              {isMainActive ? (
                <>
                  <div className="msim__main-badge">MAIN missions active</div>
                  <div className="msim__main-missions">
                    {[selectedSecure, selectedExtract]
                      .filter(Boolean)
                      .map(m => m!.name)
                      .join(' · ')}
                  </div>
                </>
              ) : (
                <select
                  className="msim__select msim__select--setup"
                  value={manualSetupId ?? ''}
                  onChange={e => setManualSetupId(e.target.value || null)}
                >
                  <option value="">— Movement mode —</option>
                  {SECURE_WITH_SETUP.length > 0 && (
                    <optgroup label="Secure">
                      {SECURE_WITH_SETUP.map(m => (
                        <option key={m.id} value={MISSION_TO_SETUP[m.id]}>{m.name} (T{m.threat})</option>
                      ))}
                    </optgroup>
                  )}
                  {EXTRACT_WITH_SETUP.length > 0 && (
                    <optgroup label="Extract">
                      {EXTRACT_WITH_SETUP.map(m => (
                        <option key={m.id} value={MISSION_TO_SETUP[m.id]}>{m.name} (T{m.threat})</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              )}
            </div>
          </div>

          {/* RESET — icon only */}
          <button className="msim__reset-btn" onClick={reset} aria-label="Reset simulator" title="Reset simulator">
            ⟳
          </button>
        </div>
      </div>
    </div>
  );
}
