const BASE = import.meta.env.BASE_URL + 'sounds/';

const SOUNDS = {
  round:   { src: `${BASE}round.wav`,          maxDuration: 3 },
  alert15: { src: `${BASE}alert_15m-left.mp3`, maxDuration: 5 },
} as const;

type SoundId = keyof typeof SOUNDS;

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/**
 * Call once inside a synchronous user-gesture handler to unlock the Web Audio
 * context on Safari/iOS. Uses a 1-sample silent buffer — does not touch any
 * of the actual sound files so there is no race with immediate playSound calls.
 */
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'running') return;
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    void ctx.resume();
  } catch {
    // ignore
  }
}

/**
 * Play a sound clip, capped at maxDuration seconds.
 * Creates a fresh Audio element each call to avoid state / race issues.
 * Silently swallows autoplay-policy errors so the app never breaks.
 */
export function playSound(id: SoundId): void {
  try {
    const { src, maxDuration } = SOUNDS[id];
    const a = new Audio(src);
    a.volume = 0.7;

    const stop = () => {
      a.pause();
      a.src = '';
    };

    const t = setTimeout(stop, maxDuration * 1000);

    a.addEventListener('ended', () => clearTimeout(t), { once: true });
    a.addEventListener('error', () => clearTimeout(t), { once: true });

    const p = a.play();
    if (p) p.catch(() => clearTimeout(t));
  } catch {
    // Never throw — audio failure must not break the app
  }
}
