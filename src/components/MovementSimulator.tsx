import { useState, useRef, useCallback, useEffect } from 'react';
import './MovementSimulator.css';

// ── Board constants (all in inches) ──────────────────────────────────────────
const BOARD      = 36;
const DEPLOY     = 6;   // deployment zone depth = Range 3
const OBJ_R      = 0.45; // visual radius of objective markers

// ── MCP range table ──────────────────────────────────────────────────────────
const RANGES = [
  { label: 'R1', inches: 1,  color: '#27e2ff' },
  { label: 'R2', inches: 3,  color: '#4ade80' },
  { label: 'R3', inches: 6,  color: '#facc15' },
  { label: 'R4', inches: 8,  color: '#fb923c' },
  { label: 'R5', inches: 10, color: '#f87171' },
];

// ── Default objective placement ───────────────────────────────────────────────
const OBJECTIVES = [
  { id: 'obj1', x: 18, y: 10 },
  { id: 'obj2', x: 6,  y: 18 },
  { id: 'obj3', x: 30, y: 18 },
  { id: 'obj4', x: 18, y: 26 },
];

// ── Base sizes ────────────────────────────────────────────────────────────────
const BASE_SIZES_MM = [35, 50, 65] as const;
type SizeMm = 35 | 50 | 65;

const MINI_COLORS = [
  '#27e2ff', '#ff6b35', '#a855f7', '#22c55e',
  '#f59e0b', '#ec4899', '#ef4444', '#06b6d4',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const mmToInches = (mm: number) => mm / 25.4;

export const rangeToInches = (range: 1 | 2 | 3 | 4 | 5): number =>
  ({ 1: 1, 2: 3, 3: 6, 4: 8, 5: 10 }[range]);

function euclidean(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function edgeToEdgeDistance(
  ax: number, ay: number, ar: number,
  bx: number, by: number, br: number,
): number {
  return Math.max(0, euclidean(ax, ay, bx, by) - ar - br);
}

function inchesToRange(d: number): string {
  if (d <= 1)  return 'R1';
  if (d <= 3)  return 'R2';
  if (d <= 6)  return 'R3';
  if (d <= 8)  return 'R4';
  if (d <= 10) return 'R5';
  return '>R5';
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Mini {
  id: string;
  x: number;
  y: number;
  sizeMm: SizeMm;
  label: string;
  color: string;
}

// ── LocalStorage persistence ──────────────────────────────────────────────────
const LS_KEY = 'mcp-simulator-v1';

function loadMinis(): Mini[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Mini[]) : [];
  } catch {
    return [];
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export function MovementSimulator() {
  const [minis, setMinis] = useState<Mini[]>(loadMinis);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addSizeMm, setAddSizeMm] = useState<SizeMm>(35);
  const [showRanges, setShowRanges] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showCenters, setShowCenters] = useState(false);

  const svgRef        = useRef<SVGSVGElement>(null);
  const dragRef       = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const counterRef    = useRef(minis.length);

  // Persist minis to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(minis)); } catch { /* noop */ }
  }, [minis]);

  // Convert client pointer to SVG inch coordinates
  const toSvgPt = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    return pt.matrixTransform(m.inverse());
  }, []);

  const addMini = () => {
    counterRef.current += 1;
    const n = counterRef.current;
    const color = MINI_COLORS[(n - 1) % MINI_COLORS.length];
    const r = mmToInches(addSizeMm) / 2;
    // Spawn near center with slight random offset, clamped to board
    const x = Math.max(r, Math.min(BOARD - r, 18 + (Math.random() - 0.5) * 6));
    const y = Math.max(r, Math.min(BOARD - r, 18 + (Math.random() - 0.5) * 6));
    const mini: Mini = { id: `m${n}`, x, y, sizeMm: addSizeMm, label: `M${n}`, color };
    setMinis(prev => [...prev, mini]);
    setSelectedId(mini.id);
  };

  const deleteMini = (id: string) => {
    setMinis(prev => prev.filter(m => m.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  };

  const reset = () => {
    setMinis([]);
    setSelectedId(null);
    counterRef.current = 0;
    try { localStorage.removeItem(LS_KEY); } catch { /* noop */ }
  };

  // Drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const pt = toSvgPt(e);
    const mini = minis.find(m => m.id === id);
    if (!mini) return;
    dragRef.current = { id, ox: pt.x - mini.x, oy: pt.y - mini.y };
    setSelectedId(id);
  }, [minis, toSvgPt]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, ox, oy } = dragRef.current;
    const pt = toSvgPt(e);
    setMinis(prev => prev.map(m => {
      if (m.id !== id) return m;
      const r = mmToInches(m.sizeMm) / 2;
      return {
        ...m,
        x: Math.max(r, Math.min(BOARD - r, pt.x - ox)),
        y: Math.max(r, Math.min(BOARD - r, pt.y - oy)),
      };
    }));
  }, [toSvgPt]);

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

  const selected = minis.find(m => m.id === selectedId) ?? null;

  return (
    <div className="msim">
      {/* ── Controls ─────────────────────────────────────────────── */}
      <div className="msim__controls">
        <div className="msim__ctrl-row">
          <select
            className="msim__select"
            value={addSizeMm}
            onChange={e => setAddSizeMm(Number(e.target.value) as SizeMm)}
            aria-label="Base size"
          >
            {BASE_SIZES_MM.map(mm => (
              <option key={mm} value={mm}>
                {mm} mm ({mmToInches(mm).toFixed(2)}")
              </option>
            ))}
          </select>
          <button className="msim__btn msim__btn--add" onClick={addMini}>＋ ADD</button>
          {selectedId && (
            <button
              className="msim__btn msim__btn--del"
              onClick={() => deleteMini(selectedId)}
            >
              DELETE
            </button>
          )}
          <button className="msim__btn msim__btn--reset" onClick={reset}>RESET</button>
        </div>

        <div className="msim__ctrl-row msim__ctrl-row--toggles">
          <label className="msim__chk">
            <input type="checkbox" checked={showRanges}       onChange={e => setShowRanges(e.target.checked)} />
            Range rings
          </label>
          <label className="msim__chk">
            <input type="checkbox" checked={showMeasurements} onChange={e => setShowMeasurements(e.target.checked)} />
            Distances
          </label>
          <label className="msim__chk">
            <input type="checkbox" checked={showCenters}      onChange={e => setShowCenters(e.target.checked)} />
            Centers
          </label>
        </div>
      </div>

      {/* ── SVG Board ────────────────────────────────────────────── */}
      <div className="msim__board-wrap">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BOARD} ${BOARD}`}
          className="msim__svg"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={() => setSelectedId(null)}
          aria-label="Movement simulator board"
        >
          {/* Background */}
          <rect x={0} y={0} width={BOARD} height={BOARD} className="msim__bg" />

          {/* 6" grid lines */}
          {[6, 12, 18, 24, 30].map(v => (
            <g key={v}>
              <line x1={v} y1={0} x2={v} y2={BOARD} className="msim__grid-major" />
              <line x1={0} y1={v} x2={BOARD} y2={v} className="msim__grid-major" />
            </g>
          ))}
          {/* 1" minor grid */}
          {Array.from({ length: 35 }, (_, i) => i + 1)
            .filter(v => v % 6 !== 0)
            .map(v => (
              <g key={v}>
                <line x1={v} y1={0} x2={v} y2={BOARD} className="msim__grid-minor" />
                <line x1={0} y1={v} x2={BOARD} y2={v} className="msim__grid-minor" />
              </g>
            ))}

          {/* Center axes */}
          <line x1={18} y1={0} x2={18} y2={BOARD} className="msim__axis" />
          <line x1={0} y1={18} x2={BOARD} y2={18} className="msim__axis" />

          {/* Deployment zones */}
          <rect x={0} y={0} width={BOARD} height={DEPLOY} className="msim__deploy msim__deploy--top" />
          <rect x={0} y={BOARD - DEPLOY} width={BOARD} height={DEPLOY} className="msim__deploy msim__deploy--bot" />

          {/* Deploy zone labels */}
          <text x={0.7} y={2.6} className="msim__deploy-label msim__deploy-label--top">DEPLOY ZONE (6")</text>
          <text x={0.7} y={BOARD - 0.7} className="msim__deploy-label msim__deploy-label--bot">DEPLOY ZONE (6")</text>

          {/* Corner inch labels */}
          {[6, 12, 18, 24, 30, 36].map(v => (
            <text key={`xl${v}`} x={v - 0.12} y={0.9} className="msim__ruler-label" textAnchor="end">{v}"</text>
          ))}
          {[6, 12, 18, 24, 30, 36].map(v => (
            <text key={`yl${v}`} x={0.5} y={v + 0.3} className="msim__ruler-label" textAnchor="start">{v}"</text>
          ))}

          {/* Objectives */}
          {OBJECTIVES.map(obj => (
            <g key={obj.id}>
              <circle cx={obj.x} cy={obj.y} r={OBJ_R} className="msim__obj" />
              <circle cx={obj.x} cy={obj.y} r={0.08}  className="msim__obj-dot" />
              <text x={obj.x} y={obj.y + OBJ_R + 0.65} className="msim__obj-label" textAnchor="middle">
                OBJ
              </text>
            </g>
          ))}

          {/* ── Selected mini: range rings ────────────────────────── */}
          {selected && showRanges && RANGES.map(range => {
            const r = mmToInches(selected.sizeMm) / 2;
            const ringR = r + range.inches;
            return (
              <g key={range.label}>
                <circle
                  cx={selected.x} cy={selected.y} r={ringR}
                  fill="none"
                  stroke={range.color}
                  strokeWidth="0.07"
                  strokeDasharray="0.35 0.2"
                  opacity="0.55"
                />
                {/* Label at top of ring */}
                <text
                  x={selected.x}
                  y={selected.y - ringR - 0.1}
                  textAnchor="middle"
                  fill={range.color}
                  fontSize="0.6"
                  fontFamily="monospace"
                  opacity="0.9"
                >
                  {range.label} ({range.inches}")
                </text>
              </g>
            );
          })}

          {/* ── Selected mini: measurement lines ─────────────────── */}
          {selected && showMeasurements && (() => {
            const selR = mmToInches(selected.sizeMm) / 2;
            return [
              // to objectives
              ...OBJECTIVES.map(obj => {
                const d = edgeToEdgeDistance(selected.x, selected.y, selR, obj.x, obj.y, OBJ_R);
                const mx = (selected.x + obj.x) / 2;
                const my = (selected.y + obj.y) / 2;
                return (
                  <g key={`d-${obj.id}`}>
                    <line
                      x1={selected.x} y1={selected.y} x2={obj.x} y2={obj.y}
                      stroke="rgba(255,255,255,0.15)" strokeWidth="0.05"
                      strokeDasharray="0.22 0.15"
                    />
                    <text x={mx} y={my - 0.3}
                      textAnchor="middle" fill="#ffe566"
                      fontSize="0.62" fontFamily="monospace" fontWeight="bold"
                    >
                      {d.toFixed(1)}" · {inchesToRange(d)}
                    </text>
                  </g>
                );
              }),
              // to other minis
              ...minis
                .filter(m => m.id !== selected.id)
                .map(other => {
                  const otherR = mmToInches(other.sizeMm) / 2;
                  const d = edgeToEdgeDistance(selected.x, selected.y, selR, other.x, other.y, otherR);
                  const mx = (selected.x + other.x) / 2;
                  const my = (selected.y + other.y) / 2;
                  return (
                    <g key={`d-${other.id}`}>
                      <line
                        x1={selected.x} y1={selected.y} x2={other.x} y2={other.y}
                        stroke="rgba(255,200,80,0.22)" strokeWidth="0.06"
                        strokeDasharray="0.22 0.15"
                      />
                      <text x={mx} y={my - 0.3}
                        textAnchor="middle" fill="#ffcc44"
                        fontSize="0.62" fontFamily="monospace" fontWeight="bold"
                      >
                        {d.toFixed(1)}" · {inchesToRange(d)}
                      </text>
                    </g>
                  );
                }),
            ];
          })()}

          {/* ── Miniatures ────────────────────────────────────────── */}
          {minis.map(mini => {
            const r = mmToInches(mini.sizeMm) / 2;
            const isSel = mini.id === selectedId;
            return (
              <g
                key={mini.id}
                onPointerDown={e => onPointerDown(e, mini.id)}
                style={{ cursor: 'grab' }}
              >
                {/* Selection halo */}
                {isSel && (
                  <circle cx={mini.x} cy={mini.y} r={r + 0.18}
                    fill="none" stroke={mini.color} strokeWidth="0.07" opacity="0.5"
                  />
                )}
                {/* Base fill */}
                <circle
                  cx={mini.x} cy={mini.y} r={r}
                  fill={`${mini.color}30`}
                  stroke={mini.color}
                  strokeWidth={isSel ? 0.14 : 0.09}
                />
                {/* Center dot */}
                {showCenters && (
                  <circle cx={mini.x} cy={mini.y} r={0.07} fill={mini.color} />
                )}
                {/* Label */}
                <text
                  x={mini.x} y={mini.y + 0.22}
                  textAnchor="middle"
                  fill="white"
                  fontSize="0.58"
                  fontFamily="monospace"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {mini.label}
                </text>
                {/* Size label below */}
                <text
                  x={mini.x} y={mini.y + r + 0.65}
                  textAnchor="middle"
                  fill={mini.color}
                  fontSize="0.48"
                  fontFamily="monospace"
                  opacity="0.8"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {mini.sizeMm}mm
                </text>
              </g>
            );
          })}

          {/* Board border */}
          <rect x={0} y={0} width={BOARD} height={BOARD}
            fill="none" stroke="rgba(100,180,255,0.35)" strokeWidth="0.14" />
        </svg>
      </div>

      {/* ── Legend ────────────────────────────────────────────────── */}
      <div className="msim__legend">
        <div className="msim__legend-row">
          <span className="msim__legend-pill msim__legend-pill--top">■ Top deploy (6")</span>
          <span className="msim__legend-pill msim__legend-pill--bot">■ Bottom deploy (6")</span>
          <span className="msim__legend-pill msim__legend-pill--obj">● Objective (edge-to-edge)</span>
        </div>
        <div className="msim__legend-row">
          {RANGES.map(r => (
            <span key={r.label} className="msim__legend-pill" style={{ color: r.color }}>
              {r.label} = {r.inches}"
            </span>
          ))}
        </div>
        <p className="msim__note">
          Tap a miniature to select it. Drag to reposition. Distances are edge-to-edge.
          Range rings extend from the base edge.
        </p>
      </div>
    </div>
  );
}
