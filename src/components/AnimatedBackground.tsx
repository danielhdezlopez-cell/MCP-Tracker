import { useEffect, useRef } from 'react';
import { type InteractiveBg } from '../store/useMcpStore';

interface Props {
  mode: InteractiveBg;
}

// ─── tech-hex: hex grid with animated scan line ───────────────────────────────
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
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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

    // Scan leading edge
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(W(), scanY);
    ctx.strokeStyle = 'rgba(0, 220, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Floating hex data chars
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
