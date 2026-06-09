/**
 * Computes the dipped top edge for a Version-A affiliation banner.
 *
 * The banner's visible height = 66% of the icon (so the badge's top 34% pops
 * above the line), and the top line runs straight, arcs up & over the badge,
 * then straight again. Both the gradient layer's clip-path and the SVG stroke
 * use the same outline, derived from the live icon size — so it stays correct
 * at every breakpoint.
 *
 * Call it for each .aff-banner--vA on mount, on resize, and after fonts load.
 * In React: run inside a useLayoutEffect + a ResizeObserver on the banner.
 */
export const AFF_PROTRUDE = 0.34; // fraction of the icon above the line (line at 66%)
export const AFF_GAP = 5;         // px gap between the line and the badge
export const AFF_SLICE = 24;      // diagonal slice on the inner-bottom corner

export function layoutAffiliationBanner(aff: HTMLElement) {
  const icon = aff.querySelector<HTMLElement>('.aff-banner__emblem');
  const bg   = aff.querySelector<HTMLElement>('.aff-banner__bg');
  const edge = aff.querySelector<SVGSVGElement>('.aff-banner__edge');
  if (!icon || !bg || !edge) return;

  const D = icon.offsetWidth;
  if (!D) return;

  aff.style.height = D * (1 - AFF_PROTRUDE) + 'px';   // 66% of the icon

  const W = aff.offsetWidth;
  bg.style.height   = D + 'px';
  edge.style.height = D + 'px';
  edge.style.width  = W + 'px';
  edge.setAttribute('viewBox', `0 0 ${W} ${D}`);

  const R = D / 2;
  const arcR = R + AFF_GAP;
  const yb = D * AFF_PROTRUDE;
  const cx = icon.offsetLeft + R;
  const dy = D / 2 - yb;
  const half = Math.sqrt(Math.max(0, arcR * arcR - dy * dy));
  const xL = cx - half;
  const xR = cx + half;

  const right = aff.classList.contains('aff-banner--right');
  const top = `M ${right ? AFF_SLICE : 0} ${yb} L ${xL.toFixed(1)} ${yb} `
            + `A ${arcR} ${arcR} 0 0 1 ${xR.toFixed(1)} ${yb} L ${W} ${yb}`;
  const fill = right
    ? `${top} L ${W} ${D} L 0 ${D} Z`
    : `${top} L ${W - AFF_SLICE} ${D} L 0 ${D} Z`;

  bg.style.clipPath = `path('${fill}')`;
  (bg.style as CSSStyleDeclaration & { webkitClipPath: string }).webkitClipPath = `path('${fill}')`;
  edge.querySelector('.glow')!.setAttribute('d', top);
  edge.querySelector('.line')!.setAttribute('d', top);
}
