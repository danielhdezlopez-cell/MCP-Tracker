import { type CSSProperties } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { getAffiliationFx, type AffiliationFx } from '../data/affiliationsFx';
import './AffiliationBackdrop.css';

export function AffiliationBackdrop() {
  const { theme, leaderLeft, leaderRight, timerRemaining, timerRunning } = useMcpStore();

  if (theme !== 'neon-blue') return null;
  if (!leaderLeft && !leaderRight) return null;

  const critical = timerRunning && timerRemaining <= 15 * 60;
  const fxLeft  = leaderLeft  ? getAffiliationFx(leaderLeft.affiliations)  : null;
  const fxRight = leaderRight ? getAffiliationFx(leaderRight.affiliations) : null;

  const halfCls = (critical: boolean) =>
    `affiliation-backdrop__half${critical ? ' is-critical' : ''}`;

  return (
    <div className="affiliation-backdrop" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <div className={`${halfCls(critical)} affiliation-backdrop__half--left`}>
        {fxLeft && <BeamAndStamp fx={fxLeft} side="left" />}
      </div>
      <div className={`${halfCls(critical)} affiliation-backdrop__half--right`}>
        {fxRight && <BeamAndStamp fx={fxRight} side="right" />}
      </div>
    </div>
  );
}

function BeamAndStamp({ fx, side }: { fx: AffiliationFx; side: 'left' | 'right' }) {
  const style = { '--fx-color': fx.color } as CSSProperties;
  return (
    <>
      <div className="affiliation-backdrop__beam" style={style} />
      <div className={`affiliation-backdrop__stamp affiliation-backdrop__stamp--${side}`} style={{ color: fx.color, borderColor: fx.color }}>
        <span className="affiliation-backdrop__stamp-label">AFFIL · {side === 'left' ? 'P1' : 'P2'}</span>
        <span className="affiliation-backdrop__stamp-val">{fx.name}</span>
      </div>
    </>
  );
}
