import { useId } from 'react';

/**
 * MissionRing — the SECURE/EXTRACT mission "threat ring".
 * Pure SVG, transparent, themeable (no bitmap). Curved THREAT + type text
 * runs continuously clockwise around the band, matching the reference art.
 * The threat number is rendered by the parent, centered in the hole.
 */
interface MissionRingProps {
  side: 'left' | 'right';      // left = SECURE (blue), right = EXTRACT (red)
  word: string;                // 'SECURE' | 'EXTRACTION'
}

export function MissionRing({ side, word }: MissionRingProps) {
  const uid = useId().replace(/[:]/g, '');
  const pid = `mring-${side}-${uid}`;

  // continuous circular text path — starts at 225° (upper-left) so no word
  // sits on the seam; clockwise. Cardinal offsets: top 12.5%, right 37.5%,
  // bottom 62.5%, left 87.5%.
  const rt = 44, cx = 60, cy = 60, a = (225 * Math.PI) / 180;
  const sx = (cx + rt * Math.cos(a)).toFixed(2);
  const sy = (cy + rt * Math.sin(a)).toFixed(2);
  const ex = (cx - rt * Math.cos(a)).toFixed(2);
  const ey = (cy - rt * Math.sin(a)).toFixed(2);
  const d = `M${sx},${sy} A${rt},${rt} 0 1 1 ${ex},${ey} A${rt},${rt} 0 1 1 ${sx},${sy}`;
  const longCls = word.length > 7 ? 'mission-ring__txt--long' : '';
  const wordCls = `mission-ring__txt mission-ring__txt--type ${longCls}`.trim();

  return (
    <svg className="mission-ring__svg" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id={pid} d={d} />
      </defs>
      <circle className="mission-ring__band" cx="60" cy="60" r="44" />
      <circle className="mission-ring__edge" cx="60" cy="60" r="54" strokeWidth="1.8" />
      <circle className="mission-ring__edge" cx="60" cy="60" r="34" strokeWidth="1.4" />
      <g className="mission-ring__rot">
        <text className="mission-ring__txt">
          <textPath href={`#${pid}`} startOffset="12.5%" textAnchor="middle">THREAT</textPath>
        </text>
        <text className={wordCls}>
          <textPath href={`#${pid}`} startOffset="37.5%" textAnchor="middle">{word}</textPath>
        </text>
        <text className="mission-ring__txt">
          <textPath href={`#${pid}`} startOffset="62.5%" textAnchor="middle">THREAT</textPath>
        </text>
        <text className={wordCls}>
          <textPath href={`#${pid}`} startOffset="87.5%" textAnchor="middle">{word}</textPath>
        </text>
      </g>
    </svg>
  );
}
