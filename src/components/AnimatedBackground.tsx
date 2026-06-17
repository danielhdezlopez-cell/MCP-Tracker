import { useEffect, useRef } from 'react';
import { type InteractiveBg } from '../store/useMcpStore';

interface Props {
  mode: InteractiveBg;
}

// ─── tech-hex: animated hex grid ─────────────────────────────────────────────
// Target ~20 FPS for this decorative canvas to reduce GPU/CPU load on iPad.
const TARGET_FPS = 20;
const FRAME_MS   = 1000 / TARGET_FPS;

function runTechHex(canvas: HTMLCanvasElement, signal: AbortSignal) {
  const ctx = canvas.getContext('2d')!;

  // Sync canvas size once and on resize, not every frame.
  const syncSize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  syncSize();
  const resizeObs = new ResizeObserver(syncSize);
  resizeObs.observe(document.documentElement);

  const W = () => canvas.width;
  const H = () => canvas.height;

  const SIZE = 30;
  let t = 0;
  let lastFrameTime = 0;

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
          const wave = 0.03 + 0.025 * Math.abs(Math.sin(t * 0.4 + col * 0.4 + row * 0.6));

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          i === 0 ? ctx.moveTo(x + SIZE * Math.cos(a), y + SIZE * Math.sin(a))
                   : ctx.lineTo(x + SIZE * Math.cos(a), y + SIZE * Math.sin(a));
        }
        ctx.closePath();

        ctx.strokeStyle = `rgba(0, 195, 255, ${wave})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  };

  const tick = (now: number) => {
    if (signal.aborted) { resizeObs.disconnect(); return; }
    requestAnimationFrame(tick);

    // Pause canvas work when page is hidden or user is idle.
    if (document.hidden || document.body.classList.contains('mcp-idle')) return;

    // Skip frame if we haven't reached the target interval yet.
    if (now - lastFrameTime < FRAME_MS) return;
    lastFrameTime = now;

    ctx.clearRect(0, 0, W(), H());
    t += 0.05;

    drawGrid();

    // Floating hex data chars
    dataBits.forEach((d, i) => {
      d.life++;
      const fade = d.life < 15 ? d.life / 15 : d.life > d.maxLife - 15 ? (d.maxLife - d.life) / 15 : 1;
      ctx.font = '10px monospace';
      ctx.fillStyle = `rgba(0, 220, 255, ${fade * 0.4})`;
      ctx.fillText(d.val, d.x, d.y);
      if (d.life >= d.maxLife) { dataBits.splice(i, 1); spawnBit(); }
    });

  };
  requestAnimationFrame(tick);
}

export function AnimatedBackground({ mode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'off' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const controller = new AbortController();
    runTechHex(canvas, controller.signal);
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
