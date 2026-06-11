import { type CSSProperties } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { getAffiliationFx, type AffiliationFx } from '../data/affiliationsFx';
import './AffiliationBackdrop.css';

export function AffiliationBackdrop() {
  const theme       = useMcpStore(s => s.theme);
  const leaderLeft  = useMcpStore(s => s.leaderLeft);
  const leaderRight = useMcpStore(s => s.leaderRight);
  const critical    = useMcpStore(s => s.timerCritical);

  if (theme !== 'neon-blue') return null;
  if (!leaderLeft && !leaderRight) return null;

  const fxLeft  = leaderLeft  ? getAffiliationFx(leaderLeft.affiliations)  : null;
  const fxRight = leaderRight ? getAffiliationFx(leaderRight.affiliations) : null;

  const halfCls = (critical: boolean) =>
    `affiliation-backdrop__half${critical ? ' is-critical' : ''}`;

  return (
    <div className="affiliation-backdrop" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <div className={`${halfCls(critical)} affiliation-backdrop__half--left`}>
        {fxLeft && <Beam fx={fxLeft} />}
      </div>
      <div className={`${halfCls(critical)} affiliation-backdrop__half--right`}>
        {fxRight && <Beam fx={fxRight} />}
      </div>
    </div>
  );
}

function Beam({ fx }: { fx: AffiliationFx }) {
  const style = { '--fx-color': fx.color } as CSSProperties;
  return <div className="affiliation-backdrop__beam" style={style} />;
}
