import type { SVGProps } from 'react';

/* LEADERS — Command Crown
   Three-pointed angular crown with gem circles at each peak and a
   decorative horizontal band. Clean authority symbol — no franchise marks. */
export function NavIconLeaders(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      {/* Crown outline */}
      <path
        d="M2,20 L2,13 L7,7 L12,3 L17,7 L22,13 L22,20 Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Horizontal band */}
      <line x1="2" y1="15.5" x2="22" y2="15.5" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      {/* Band vertical dividers */}
      <line x1="7"  y1="15.5" x2="7"  y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="15.5" x2="12" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="17" y1="15.5" x2="17" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* Gem circles at each peak */}
      <circle cx="7"  cy="7" r="1.5" fill="currentColor" opacity="0.75" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="17" cy="7" r="1.5" fill="currentColor" opacity="0.75" />
    </svg>
  );
}
