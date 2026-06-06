import { useMcpStore } from '../store/useMcpStore';
import { getAffiliationFx } from '../data/affiliationsFx';
import './AffiliationBanner.css';

export function AffiliationBanner({ side }: { side: 'left' | 'right' }) {
  const leaderLeft = useMcpStore((s) => s.leaderLeft);
  const leaderRight = useMcpStore((s) => s.leaderRight);
  const showAffiliationBanner = useMcpStore((s) => s.showAffiliationBanner);
  const leader = side === 'left' ? leaderLeft : leaderRight;

  if (!showAffiliationBanner || !leader) return null;

  const fx = getAffiliationFx(leader.affiliations);
  const hasSigil = !!fx.customGlyph;

  return (
    <div
      className={`aff-banner aff-banner--${side}`}
      style={{ ['--fac' as string]: fx.color } as React.CSSProperties}
      aria-label={`Affiliation: ${fx.name}`}
    >
      {hasSigil && (
        <svg
          className="aff-banner__watermark aff-sigil"
          viewBox="0 0 200 200"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: fx.customGlyph! }}
        />
      )}
      <div className="aff-banner__emblem">
        {hasSigil ? (
          <svg
            className="aff-sigil"
            viewBox="0 0 200 200"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: fx.customGlyph! }}
          />
        ) : (
          <span className="aff-banner__glyph">{fx.glyph}</span>
        )}
      </div>
      <div className="aff-banner__text">
        <span className="aff-banner__eyebrow">Affiliation</span>
        <span className="aff-banner__name">{fx.name}</span>
      </div>
    </div>
  );
}
