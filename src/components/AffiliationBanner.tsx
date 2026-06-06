import { useMcpStore } from '../store/useMcpStore';
import { getAffiliationFx, getAffiliationIcon } from '../data/affiliationsFx';
import './AffiliationBanner.css';

export function AffiliationBanner({ side }: { side: 'left' | 'right' }) {
  const leaderLeft = useMcpStore((s) => s.leaderLeft);
  const leaderRight = useMcpStore((s) => s.leaderRight);
  const showAffiliationBanner = useMcpStore((s) => s.showAffiliationBanner);
  const leader = side === 'left' ? leaderLeft : leaderRight;

  if (!showAffiliationBanner || !leader) return null;

  const fx = getAffiliationFx(leader.affiliations);
  const iconSrc = getAffiliationIcon(leader.affiliations);
  const nameLen = fx.name.length;
  const nameSizeClass = nameLen > 18 ? 'aff-banner__name--lg' : nameLen > 12 ? 'aff-banner__name--md' : '';

  return (
    <div
      className={`aff-banner aff-banner--${side}`}
      style={{ ['--fac' as string]: fx.color } as React.CSSProperties}
      aria-label={`Affiliation: ${fx.name}`}
    >
      <div className="aff-banner__emblem">
        <img
          className="aff-banner__icon"
          src={iconSrc}
          alt={fx.name}
          draggable={false}
        />
      </div>
      <div className="aff-banner__text">
        <span className={`aff-banner__name${nameSizeClass ? ` ${nameSizeClass}` : ''}`}>{fx.name}</span>
      </div>
    </div>
  );
}
