import './HexPortrait.css';

export type HexVariant = 'left' | 'right' | 'neutral';

interface HexPortraitProps {
  image: string | null;
  name: string;
  variant?: HexVariant;
  /** Any valid CSS length, e.g. '72px' or 'clamp(80px, 12vw, 130px)' */
  cssSize?: string;
  selected?: boolean;
  empty?: boolean;
}

export function HexPortrait({
  image,
  name,
  variant = 'neutral',
  cssSize = '72px',
  selected = false,
  empty = false,
}: HexPortraitProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const classes = [
    'hex-portrait',
    `hex-portrait--${variant}`,
    selected ? 'hex-portrait--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ '--hex-size': cssSize } as React.CSSProperties}>
      <div className="hex-portrait__ring" />
      <div className="hex-portrait__inner">
        {empty ? (
          <div className="hex-portrait__empty">
            <span className="hex-portrait__plus">+</span>
          </div>
        ) : image ? (
          <img src={image} alt={name} className="hex-portrait__img" draggable={false} />
        ) : (
          <div className="hex-portrait__placeholder">{initials}</div>
        )}
      </div>
    </div>
  );
}
