import type { SVGProps } from 'react';

/* MISSIONS — Tactical Reticle
   Outer ring split into four 70° arcs with cardinal-direction gaps,
   crosshair lines running through the gaps, an inner ring, and a
   filled diamond at the center. Classic HUD targeting marker. */
export function NavIconMissions(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      {/* Outer ring — 4 arc segments, gaps at N / E / S / W (±10°) */}
      {/* top-right  (280° → 350°) */ }
      <path d="M13.65,2.64 A9.5,9.5 0 0,1 21.35,10.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* bottom-right (10° → 80°) */}
      <path d="M21.35,13.65 A9.5,9.5 0 0,1 13.65,21.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* bottom-left (100° → 170°) */}
      <path d="M10.35,21.36 A9.5,9.5 0 0,1 2.65,13.65"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* top-left   (190° → 260°) */}
      <path d="M2.65,10.35  A9.5,9.5 0 0,1 10.35,2.64"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Crosshair lines — outer-ring edge to inner-ring edge through each gap */}
      <line x1="12" y1="2.5"  x2="12" y2="8"    stroke="currentColor" strokeWidth="1.2" />
      <line x1="12" y1="16"   x2="12" y2="21.5"  stroke="currentColor" strokeWidth="1.2" />
      <line x1="2.5" y1="12"  x2="8"  y2="12"    stroke="currentColor" strokeWidth="1.2" />
      <line x1="16"  y1="12"  x2="21.5" y2="12"  stroke="currentColor" strokeWidth="1.2" />

      {/* Inner ring */}
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.1" opacity="0.65" />

      {/* Center target diamond */}
      <polygon points="12,9.5 14.5,12 12,14.5 9.5,12" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
