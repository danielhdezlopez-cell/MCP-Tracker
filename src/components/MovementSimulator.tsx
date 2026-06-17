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

// ── Types ─────────────────────────────────────────────────────────────────────
interface Character {
  id: string;         // 'A1', 'A2', …
  baseMm: SizeMm;
  x: number;          // centre, inches
  y: number;
  ranges: number[];   // active range selections
  move: MoveKey | null;
}

// ── LocalStorage ──────────────────────────────────────────────────────────────
function loadChars(): Character[] {
  try {
    const raw = localStorage.getItem(SIM_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw);
    return Array.isArray(p.characters) ? (p.characters as Character[]) : [];
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

  const svgRef     = useRef<SVGSVGElement>(null);
  const dragRef    = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const counterRef = useRef(initCounter(initial));

  // Persist characters; clean up the old provisional key once
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
    const ch: Character = { id: `A${n}`, baseMm: addSizeMm, x, y, ranges: [], move: null };
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

  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const pt = toSvgPt(e);
    const ch = characters.find(c => c.id === id);
    if (!ch) return;
    dragRef.current = { id, ox: pt.x - ch.x, oy: pt.y - ch.y };
    setSelectedId(id);
  }, [characters, toSvgPt]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, ox, oy } = dragRef.current;
    const pt = toSvgPt(e);
    setCharacters(prev => prev.map(c => {
      if (c.id !== id) return c;
      const { x, y } = clampToBoard(pt.x - ox, pt.y - oy, c.baseMm);
      return { ...c, x, y };
    }));
  }, [toSvgPt]);

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

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
                  <stop offset="0%"   stopColor={P2_COLOR} stopOpacity="0.22"/>
                  <stop offset="100%" stopColor={P2_COLOR} stopOpacity="0.01"/>
                </linearGradient>
                {/* P1 deploy zone (bottom, cyan) */}
                <linearGradient id="msimDzBot" x1="0" y1={BOARD_IN} x2="0" y2={P1_LINE_IN} gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor={P1_COLOR} stopOpacity="0.22"/>
                  <stop offset="100%" stopColor={P1_COLOR} stopOpacity="0.01"/>
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
              <line x1={0} y1={P2_LINE_IN} x2={BOARD_IN} y2={P2_LINE_IN} stroke={`${P2_COLOR}cc`} strokeWidth="0.09"/>
              <rect x={0} y={P1_LINE_IN} width={BOARD_IN} height={DEPLOY_IN} fill="url(#msimDzBot)"/>
              <line x1={0} y1={P1_LINE_IN} x2={BOARD_IN} y2={P1_LINE_IN} stroke={`${P1_COLOR}cc`} strokeWidth="0.09"/>

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
                  return (
                    <g key={`${ch.id}-r${r}`}>
                      <circle cx={ch.x} cy={ch.y} r={ringR}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.07"
                        strokeDasharray="0.3 0.2" opacity="0.55"/>
                      <text x={ch.x} y={ch.y - ringR - 0.12}
                        textAnchor="middle" fill={P1_COLOR}
                        fontSize="0.58" fontFamily="monospace" fontWeight="bold" opacity="0.9">
                        R{r}
                      </text>
                    </g>
                  );
                })
              )}

              {/* ── Move lines — movement mode only ─────────────── */}
              {!isObjectivesMode && characters.map(ch => {
                if (!ch.move) return null;
                const moveIn  = MCP_MOVES[ch.move];
                const moveR   = getBaseRadiusIn(ch.baseMm) + moveIn;
                const MOVE_COLOR = '#4ade80';
                return (
                  <g key={`${ch.id}-mv`}>
                    <circle cx={ch.x} cy={ch.y} r={moveR}
                      fill="none" stroke={MOVE_COLOR} strokeWidth="0.09"
                      strokeDasharray="0.35 0.2" opacity="0.70"/>
                    <text x={ch.x} y={ch.y - moveR - 0.12}
                      textAnchor="middle" fill={MOVE_COLOR}
                      fontSize="0.58" fontFamily="monospace" fontWeight="bold" opacity="0.9">
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
                const r       = getBaseRadiusIn(ch.baseMm);
                const isSel   = ch.id === selectedId;
                const tiers   = ({ 35: 0, 50: 1, 65: 2 } as Record<number,number>)[ch.baseMm] ?? 0;
                return (
                  <g key={ch.id} onPointerDown={e => onPointerDown(e, ch.id)} style={{ cursor: 'grab' }}>
                    {/* Selection halo */}
                    {isSel && (
                      <circle cx={ch.x} cy={ch.y} r={r + 0.22}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.07" opacity="0.45"/>
                    )}
                    {/* Base circle */}
                    <circle cx={ch.x} cy={ch.y} r={r}
                      fill={`${P1_COLOR}25`}
                      stroke={P1_COLOR}
                      strokeWidth={isSel ? 0.14 : 0.09}/>
                    {/* Inner tier rings (differentiate 50mm / 65mm) */}
                    {Array.from({ length: tiers }, (_, i) => (
                      <circle key={i} cx={ch.x} cy={ch.y} r={r * (1 - 0.3 * (i + 1))}
                        fill="none" stroke={P1_COLOR} strokeWidth="0.045" opacity="0.5"/>
                    ))}
                    {/* ID label */}
                    <text x={ch.x} y={ch.y + 0.22}
                      textAnchor="middle" fill="white"
                      fontSize="0.6" fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {ch.id}
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
