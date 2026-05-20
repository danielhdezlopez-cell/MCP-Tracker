import type { SVGProps } from 'react';

/* MAIN — Hexagonal Hub
   Outer pointy-top hexagon (r=10) wrapping an inner diamond (r=5)
   with a filled center core. Side tick-marks add HUD bracket detail.
   All strokes use currentColor so CSS themes control the glow state. */
export function NavIconMain(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      {/* Outer hexagon — pointy-top, r=10 */}
      <polygon
        points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Inner diamond */}
      <polygon
        points="12,7.5 16.5,12 12,16.5 7.5,12"
        stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.6"
      />
      {/* HUD bracket ticks at left/right flat sides */}
      <line x1="20.66" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="1"     y1="12" x2="3.34" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Center core */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
