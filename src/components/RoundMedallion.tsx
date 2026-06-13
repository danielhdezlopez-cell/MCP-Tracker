import { useRef } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import './RoundMedallion.css';

const TOTAL = 6;
const LONG_PRESS_MS = 500;
const R = 82;
const GAP_DEG = 8;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function RoundMedallion() {
  const round = useMcpStore((s) => s.round);
  const setRound = useMcpStore((s) => s.setRound);
  const kangLeftChronalRound  = useMcpStore((s) => s.kangLeftChronalRound);
  const kangRightChronalRound = useMcpStore((s) => s.kangRightChronalRound);
  const kangLeftTrustRound    = useMcpStore((s) => s.kangLeftTrustRound);
  const kangRightTrustRound   = useMcpStore((s) => s.kangRightTrustRound);

  const coreRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFired = useRef(false);

  const advance = () => {
    if (round < TOTAL) {
      setRound(round + 1);
      const c = coreRef.current;
      if (c) { c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse'); }
    }
  };
  const back = () => { if (round > 1) setRound(round - 1); };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    longFired.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      longFired.current = true;
      back();
      if (navigator.vibrate) navigator.vibrate(20);
    }, LONG_PRESS_MS);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!longFired.current) advance();
  };
  const cancel = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
    else if (e.key === 'Backspace' || e.key === 'ArrowLeft') { e.preventDefault(); back(); }
  };

  // 6-segment radial gauge
  const seg = 360 / TOTAL;
  const segments = Array.from({ length: TOTAL }, (_, i) => {
    const idx = i + 1;
    const start = -90 + i * seg + GAP_DEG / 2;
    const end = -90 + (i + 1) * seg - GAP_DEG / 2;
    const [x1, y1] = polar(100, 100, R, start);
    const [x2, y2] = polar(100, 100, R, end);
    const large = end - start > 180 ? 1 : 0;
    const state = idx < round ? 'done' : idx === round ? 'current' : 'future';
    return { d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, state };
  });

  // TS/TN mini-indicators for the active round
  const showTs = kangLeftChronalRound === round || kangRightChronalRound === round;
  const showTn = kangLeftTrustRound === round || kangRightTrustRound === round;

  return (
    <div className="round-medallion">
      <div className="round-medallion__frame">
        <svg viewBox="0 0 200 200" className="round-medallion__spin" aria-hidden="true">
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(0,195,255,0.18)" strokeWidth="1" strokeDasharray="3 7" />
        </svg>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {segments.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill="none"
              strokeLinecap="round"
              className={`round-medallion__seg round-medallion__seg--${s.state}`}
            />
          ))}
        </svg>
        <div
          ref={coreRef}
          className="round-medallion__core"
          role="button"
          tabIndex={0}
          aria-label={`Round ${round} of ${TOTAL}. Tap to advance, long-press to go back.`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={cancel}
          onPointerCancel={cancel}
          onKeyDown={onKeyDown}
        >
          <span className="round-medallion__eyebrow">Round</span>
          <span className="round-medallion__num">{round}</span>

        </div>
        {(showTs || showTn) && (
          <div className="round-medallion__kang-badges" aria-label="Kang markers">
            {showTs && <span className="round-medallion__kang-badge round-medallion__kang-badge--ts" title="Timestream – Chronal Manipulation">TS</span>}
            {showTn && <span className="round-medallion__kang-badge round-medallion__kang-badge--tn" title="Trust – Trust No One But Yourself">TN</span>}
          </div>
        )}
      </div>
    </div>
  );
}
