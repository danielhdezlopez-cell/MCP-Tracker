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

  interface Hex { x: number; y: number; r: number; speed: number; angle: number; opacity: number; drift: number; }
  interface Dot { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }

  const hexes: Hex[] = Array.from({ length: 26 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 16 + Math.random() * 50,
    speed: 0.25 + Math.random() * 0.5,
    angle: Math.random() * Math.PI * 2,
    opacity: 0.08 + Math.random() * 0.14,
    drift: (Math.random() - 0.5) * 0.008,
  }));

  const dots: Dot[] = [];
  const spawnDot = () => {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.0,
      vy: (Math.random() - 0.5) * 1.0,
      life: 0,
      maxLife: 90 + Math.random() * 150,
      size: 1 + Math.random() * 2,
    });
  };
  for (let i = 0; i < 50; i++) spawnDot();

  const drawHex = (x: number, y: number, r: number, opacity: number, color: string, filled = false) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
               : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    if (filled) {
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.3;
      ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // Energy trail between close dots
  const drawConnections = () => {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const a = (1 - dist / 80) * 0.12;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0, 195, 255, ${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  let t = 0;
  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());
    t += 0.01;

    hexes.forEach(h => {
      h.angle += h.drift;
      h.x += Math.cos(h.angle) * h.speed;
      h.y += Math.sin(h.angle) * h.speed;
      if (h.x < -100) h.x = W() + 100;
      if (h.x > W() + 100) h.x = -100;
      if (h.y < -100) h.y = H() + 100;
      if (h.y > H() + 100) h.y = -100;
      const pulse = 1 + 0.15 * Math.sin(t * 2 + h.x * 0.01);
      const color = h.r > 36 ? '#00c3ff' : '#ff6a00';
      drawHex(h.x, h.y, h.r * pulse, h.opacity, color, h.r < 25);
    });

    drawConnections();

    dots.forEach((d, i) => {
      d.x += d.vx;
      d.y += d.vy;
      d.life++;
      const t2 = d.life / d.maxLife;
      const fade = t2 < 0.2 ? t2 / 0.2 : t2 > 0.8 ? (1 - t2) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 140, 0, ${0.7 * fade})`;
      ctx.fill();
      if (d.life >= d.maxLife) { dots.splice(i, 1); spawnDot(); }
    });

    requestAnimationFrame(tick);
  };
  tick();
}

// ─── comic-energy: speed lines + energy orbs ─────────────────────────────────
function runComicEnergy(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;

  interface Line { angle: number; length: number; speed: number; x: number; y: number; opacity: number; width: number; }
  interface Orb { x: number; y: number; r: number; phase: number; speed: number; color: string; }
  interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; }

  const W = () => canvas.width;
  const H = () => canvas.height;

  const lines: Line[] = Array.from({ length: 30 }, () => ({
    angle: (Math.random() - 0.5) * 0.35,
    length: 100 + Math.random() * 250,
    speed: 5 + Math.random() * 8,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    opacity: 0.08 + Math.random() * 0.14,
    width: 0.8 + Math.random() * 1.5,
  }));

  const orbs: Orb[] = Array.from({ length: 6 }, (_, i) => ({
    x: (window.innerWidth / 6) * i + 80,
    y: Math.random() * window.innerHeight,
    r: 40 + Math.random() * 70,
    phase: Math.random() * Math.PI * 2,
    speed: 0.012 + Math.random() * 0.018,
    color: i % 2 === 0 ? '255, 60, 0' : '255, 180, 0',
  }));

  const sparks: Spark[] = [];
  const spawnSpark = () => {
    sparks.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      life: 0, maxLife: 40 + Math.random() * 40,
    });
  };
  for (let i = 0; i < 20; i++) spawnSpark();

  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());

    orbs.forEach(o => {
      o.phase += o.speed;
      const pulse = 0.5 + 0.5 * Math.sin(o.phase);
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * (1 + pulse * 0.4));
      grad.addColorStop(0, `rgba(${o.color}, ${0.18 * pulse})`);
      grad.addColorStop(0.5, `rgba(${o.color}, ${0.06 * pulse})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * (1 + pulse * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    lines.forEach(l => {
      l.x += l.speed;
      if (l.x > W() + l.length) l.x = -l.length;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      const grad = ctx.createLinearGradient(-l.length, 0, 0, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.7, `rgba(255, 200, 0, ${l.opacity * 0.5})`);
      grad.addColorStop(1, `rgba(255, 255, 200, ${l.opacity})`);
      ctx.beginPath();
      ctx.moveTo(-l.length, 0);
      ctx.lineTo(0, 0);
      ctx.strokeStyle = grad;
      ctx.lineWidth = l.width;
      ctx.stroke();
      ctx.restore();
    });

    sparks.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      const fade = 1 - s.life / s.maxLife;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 80, ${fade * 0.8})`;
      ctx.fill();
      if (s.life >= s.maxLife) { sparks.splice(i, 1); spawnSpark(); }
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

  interface Star { x: number; y: number; z: number; size: number; color: string; phase: number; }
  interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; }

  const COLORS = ['#ffffff', '#aad4ff', '#ffd0aa', '#ff99dd', '#99ffee', '#ccaaff'];
  const stars: Star[] = Array.from({ length: 280 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    z: 0.1 + Math.random() * 0.9,
    size: 0.4 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  }));

  const particles: Particle[] = [];
  const spawnParticle = () => {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      life: 0, maxLife: 200 + Math.random() * 200,
    });
  };
  for (let i = 0; i < 25; i++) spawnParticle();

  let t = 0;
  const tick = () => {
    if (signal.aborted) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, W(), H());
    t += 0.003;

    // Nebula layers
    const cx = W() * 0.4, cy = H() * 0.5;
    const grad1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W(), H()) * 0.6);
    grad1.addColorStop(0, `rgba(60, 0, 100, ${0.08 + 0.03 * Math.sin(t)})`);
    grad1.addColorStop(0.5, `rgba(0, 20, 80, ${0.05 + 0.02 * Math.cos(t * 0.7)})`);
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W(), H());

    const cx2 = W() * 0.65, cy2 = H() * 0.4;
    const grad2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.min(W(), H()) * 0.4);
    grad2.addColorStop(0, `rgba(0, 50, 100, ${0.06 + 0.02 * Math.sin(t * 1.3)})`);
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W(), H());

    stars.forEach(s => {
      s.y -= s.z * (0.35 + s.z * 0.5);
      if (s.y < 0) { s.y = H(); s.x = Math.random() * W(); }
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.5 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = twinkle * s.z * 0.85;
      ctx.fill();
      // Bright star cross
      if (s.size > 1.5 && twinkle > 0.8) {
        ctx.globalAlpha = twinkle * s.z * 0.3;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x - s.size * 3, s.y);
        ctx.lineTo(s.x + s.size * 3, s.y);
        ctx.moveTo(s.x, s.y - s.size * 3);
        ctx.lineTo(s.x, s.y + s.size * 3);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      const fade = p.life < 60 ? p.life / 60 : p.life > p.maxLife - 60 ? (p.maxLife - p.life) / 60 : 1;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
      grad.addColorStop(0, `rgba(180, 100, 255, ${0.3 * fade})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      if (p.life >= p.maxLife) { particles.splice(i, 1); spawnParticle(); }
    });

    requestAnimationFrame(tick);
  };
  tick();
}

// ─── tech-hex: hex grid scan lines ───────────────────────────────────────────
function runTechHex(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;
  const W = () => canvas.width;
  const H = () => canvas.height;

  const SIZE = 30;
  let scanY = 0;
  let t = 0;

  interface DataBit { x: number; y: number; val: string; life: number; maxLife: number; }
  const dataBits: DataBit[] = [];
  const HEX_CHARS = '0123456789ABCDEF';
  const spawnBit = () => {
    dataBits.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      val: HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)],
      life: 0, maxLife: 60 + Math.random() * 80,
    });
  };
  for (let i = 0; i < 15; i++) spawnBit();

  const drawGrid = () => {
    const h = SIZE * Math.sqrt(3);
    const cols = Math.ceil(W() / (SIZE * 1.5)) + 2;
    const rows = Math.ceil(H() / h) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * SIZE * 1.5;
        const y = row * h + (col % 2 === 0 ? 0 : h / 2);
        const distFromScan = Math.abs(y - scanY) / H();
        const scanGlow = Math.max(0, 0.22 - distFromScan * 0.8);
        const wave = 0.03 + 0.025 * Math.abs(Math.sin(t * 0.4 + col * 0.4 + row * 0.6));

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          i === 0 ? ctx.moveTo(x + SIZE * Math.cos(a), y + SIZE * Math.sin(a))
                   : ctx.lineTo(x + SIZE * Math.cos(a), y + SIZE * Math.sin(a));
        }
        ctx.closePath();

        if (scanGlow > 0.05) {
          ctx.fillStyle = `rgba(0, 195, 255, ${scanGlow * 0.08})`;
          ctx.fill();
        }
        ctx.strokeStyle = `rgba(0, 195, 255, ${wave + scanGlow})`;
        ctx.lineWidth = scanGlow > 0.1 ? 1 : 0.5;
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
    scanY = (scanY + 1.8) % H();

    drawGrid();

    // Scan beam
    const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.4, 'rgba(0, 195, 255, 0.04)');
    grad.addColorStop(0.5, 'rgba(0, 220, 255, 0.12)');
    grad.addColorStop(0.6, 'rgba(0, 195, 255, 0.04)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 60, W(), 120);

    // Scan leading edge line
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(W(), scanY);
    ctx.strokeStyle = 'rgba(0, 220, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Data bits
    dataBits.forEach((d, i) => {
      d.life++;
      const fade = d.life < 15 ? d.life / 15 : d.life > d.maxLife - 15 ? (d.maxLife - d.life) / 15 : 1;
      ctx.font = '10px monospace';
      ctx.fillStyle = `rgba(0, 220, 255, ${fade * 0.4})`;
      ctx.fillText(d.val, d.x, d.y);
      if (d.life >= d.maxLife) { dataBits.splice(i, 1); spawnBit(); }
    });

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
