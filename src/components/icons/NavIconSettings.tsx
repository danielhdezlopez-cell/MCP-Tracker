import type { SVGProps } from 'react';

/* SETTINGS — Control Gear
   Six-tooth gear drawn as a 12-point polygon alternating between outer
   radius (r=10, tooth tips) and inner radius (r=7, tooth valleys).
   An inner ring and center dot complete the system-core aesthetic. */
export function NavIconSettings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      {/* 6-tooth gear — 12 vertices alternating r=10 / r=7 */}
      <polygon
        points="12,2 15.5,5.94 20.66,7 19,12 20.66,17 15.5,18.06 12,22 8.5,18.06 3.34,17 5,12 3.34,7 8.5,5.94"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Inner ring */}
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.1" opacity="0.65" />
      {/* Center core dot */}
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
