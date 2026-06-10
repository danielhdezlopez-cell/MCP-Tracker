import { useLayoutEffect, useRef } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { getAffiliationFx } from '../data/affiliationsFx';
import { layoutAffiliationBanner } from './AffiliationBanner.layout';
import './AffiliationBanner.css';

export function AffiliationBanner({ side }: { side: 'left' | 'right' }) {
  const leaderLeft = useMcpStore((s) => s.leaderLeft);
  const leaderRight = useMcpStore((s) => s.leaderRight);
  const showAffiliationBanner = useMcpStore((s) => s.showAffiliationBanner);
  const setCurrentPage = useMcpStore((s) => s.setCurrentPage);
  const setPendingAffilFilter = useMcpStore((s) => s.setPendingAffilFilter);
  const setPendingLeaderAssign = useMcpStore((s) => s.setPendingLeaderAssign);
  const leader = side === 'left' ? leaderLeft : leaderRight;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => layoutAffiliationBanner(el);
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    document.fonts?.ready.then(run);
    return () => ro.disconnect();
  }, [leader]);

  if (!showAffiliationBanner || !leader) return null;

  const fx = getAffiliationFx(leader.affiliations);
  const hasSigil = Boolean(fx.customGlyph);
  const primaryAffil = leader.affiliations[0] ?? null;

  const handleClick = () => {
    setPendingLeaderAssign(side);
    if (primaryAffil) setPendingAffilFilter(primaryAffil);
    setCurrentPage('leaders');
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={`aff-banner aff-banner--${side} aff-banner--vA aff-banner--clickable`}
      style={{ ['--fac' as string]: fx.color, ['--icon-scale' as string]: fx.iconScale ?? 1 } as React.CSSProperties}
      aria-label={`Ver líderes de ${fx.name}`}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <div className="aff-banner__bg">
        {fx.iconSrc && (
          <img className="aff-banner__wm" src={fx.iconSrc} alt="" aria-hidden />
        )}
      </div>
      <svg className="aff-banner__edge" aria-hidden>
        <path className="glow" />
        <path className="line" />
      </svg>

      <span className="aff-banner__emblem">
        {fx.iconSrc ? (
          <img className="aff-banner__icon-img" src={fx.iconSrc} alt="" aria-hidden />
        ) : hasSigil ? (
          <svg
            className="aff-sigil"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: fx.customGlyph! }}
          />
        ) : (
          <span className="aff-banner__glyph">{fx.glyph}</span>
        )}
      </span>

      <span className="aff-banner__text">
        <span className="aff-banner__name">{fx.name}</span>
      </span>
    </div>
  );
}
