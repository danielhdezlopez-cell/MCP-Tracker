import { useEffect, useRef } from 'react';
import { type InteractiveBg } from '../store/useMcpStore';

interface Props {
  mode: InteractiveBg;
}

// ─── hero-hud: floating hexagons + energy dots ───────────────────────────────
function runHeroHud(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;
  const W = () => canvas.width;
  const H = () => canvas.height;

  interface Hex { x: number; y: number; r: number; speed: number; angle: number; opacity: number; }
  interface Dot { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; }

  const hexes: Hex[] = Array.from({ length: 18 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 20 + Math.random() * 40,
    speed: 0.2 + Math.random() * 0.4,
    angle: Math.random() * Math.PI * 2,
    opacity: 0.04 + Math.random() * 0.08,
  }));

  const dots: Dot[] = [];
  const spawnDot = () => {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      life: 0,
      maxLife: 120 + Math.random() * 180,
    });
  };
  for (let i = 0; i < 30; i++) spawnDot();

  const drawHex = (x: number, y: number, r: number, opacity: number, color: string) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
               : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  let frame = 0;
  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());

    hexes.forEach(h => {
      h.x += Math.cos(h.angle) * h.speed;
      h.y += Math.sin(h.angle) * h.speed;
      if (h.x < -80) h.x = W() + 80;
      if (h.x > W() + 80) h.x = -80;
      if (h.y < -80) h.y = H() + 80;
      if (h.y > H() + 80) h.y = -80;
      drawHex(h.x, h.y, h.r, h.opacity, '#00c3ff');
    });

    dots.forEach((d, i) => {
      d.x += d.vx;
      d.y += d.vy;
      d.life++;
      const t = d.life / d.maxLife;
      const fade = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 100, 0, ${0.5 * fade})`;
      ctx.fill();
      if (d.life >= d.maxLife) { dots.splice(i, 1); spawnDot(); }
    });

    frame++;
    requestAnimationFrame(tick);
  };
  tick();
}

// ─── comic-energy: speed lines + energy orbs ─────────────────────────────────
function runComicEnergy(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;

  interface Line { angle: number; length: number; speed: number; x: number; y: number; opacity: number; }
  interface Orb { x: number; y: number; r: number; phase: number; speed: number; }

  const W = () => canvas.width;
  const H = () => canvas.height;

  const lines: Line[] = Array.from({ length: 24 }, () => ({
    angle: (Math.random() - 0.5) * 0.3,
    length: 80 + Math.random() * 200,
    speed: 4 + Math.random() * 6,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    opacity: 0.05 + Math.random() * 0.1,
  }));

  const orbs: Orb[] = Array.from({ length: 5 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 30 + Math.random() * 60,
    phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.02,
  }));

  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());

    lines.forEach(l => {
      l.x += l.speed;
      if (l.x > W() + l.length) l.x = -l.length;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      const grad = ctx.createLinearGradient(-l.length, 0, 0, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, `rgba(255, 200, 0, ${l.opacity})`);
      ctx.beginPath();
      ctx.moveTo(-l.length, 0);
      ctx.lineTo(0, 0);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    orbs.forEach(o => {
      o.phase += o.speed;
      const pulse = 0.5 + 0.5 * Math.sin(o.phase);
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * (1 + pulse * 0.3));
      grad.addColorStop(0, `rgba(255, 50, 0, ${0.12 * pulse})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * (1 + pulse * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(tick);
  };
  tick();
}

// ─── cosmic: star field parallax ─────────────────────────────────────────────
function runCosmic(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;
  const W = () => canvas.width;
  const H = () => canvas.height;

  interface Star { x: number; y: number; z: number; size: number; color: string; }

  const COLORS = ['#ffffff', '#aad4ff', '#ffd0aa', '#ff99cc', '#99ffee'];
  const stars: Star[] = Array.from({ length: 200 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    z: Math.random(),
    size: 0.5 + Math.random() * 1.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  let t = 0;
  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());

    t += 0.002;
    stars.forEach(s => {
      s.y -= s.z * (0.3 + s.z * 0.4);
      if (s.y < 0) { s.y = H(); s.x = Math.random() * W(); }
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + s.x));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = twinkle * s.z * 0.7;
      ctx.fill();
    });

    // Nebula wisps
    const cx = W() / 2, cy = H() / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W(), H()) * 0.5);
    grad.addColorStop(0, `rgba(80, 0, 120, ${0.04 + 0.02 * Math.sin(t)})`);
    grad.addColorStop(0.5, `rgba(0, 40, 100, ${0.03 + 0.01 * Math.cos(t * 0.7)})`);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W(), H());

    requestAnimationFrame(tick);
  };
  tick();
}

// ─── tech-hex: hex grid scan lines ───────────────────────────────────────────
function runTechHex(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;
  const W = () => canvas.width;
  const H = () => canvas.height;

  const SIZE = 32;
  let scanY = 0;
  let t = 0;

  const drawGrid = () => {
    const h = SIZE * Math.sqrt(3);
    const cols = Math.ceil(W() / (SIZE * 1.5)) + 2;
    const rows = Math.ceil(H() / h) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * SIZE * 1.5;
        const y = row * h + (col % 2 === 0 ? 0 : h / 2);
        const dist = Math.abs(y - scanY) / H();
        const glow = Math.max(0, 0.12 - dist * 0.5);
        const base = 0.02 + 0.02 * Math.sin(t * 0.5 + col * 0.3 + row * 0.5);

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          i === 0 ? ctx.moveTo(x + SIZE * Math.cos(a), y + SIZE * Math.sin(a))
                   : ctx.lineTo(x + SIZE * Math.cos(a), y + SIZE * Math.sin(a));
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 195, 255, ${base + glow})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  };

  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());

    t += 0.05;
    scanY = (scanY + 1.5) % H();

    drawGrid();

    // Scan line
    const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(0, 195, 255, 0.08)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 40, W(), 80);

    requestAnimationFrame(tick);
  };
  tick();
}

export function AnimatedBackground({ mode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'off' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const controller = new AbortController();

    if (mode === 'hero-hud') runHeroHud(canvas, controller.signal);
    else if (mode === 'comic-energy') runComicEnergy(canvas, controller.signal);
    else if (mode === 'cosmic') runCosmic(canvas, controller.signal);
    else if (mode === 'tech-hex') runTechHex(canvas, controller.signal);

    return () => controller.abort();
  }, [mode]);

  if (mode === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
