/**
 * Audio manager using Web Audio API (AudioContext + AudioBufferSourceNode).
 *
 * Why not HTMLAudioElement?
 * Safari/iOS blocks HTMLAudioElement.play() unless it is called synchronously
 * inside a user-gesture handler. The 15-minute alert fires from a useEffect
 * (timer tick) — not a gesture — so it would be silently swallowed every time.
 *
 * AudioContext is different: once the context is "unlocked" by a single
 * gesture (we do this via unlockAudio()), any subsequent AudioBufferSourceNode
 * created from that context can start() without a gesture. This is the
 * standard workaround for Safari audio in game / interactive apps.
 */

const SOUNDS_BASE = import.meta.env.BASE_URL + 'sounds/';

interface SoundDef {
  file: string;
  maxDuration: number; // seconds
}

const SOUND_DEFS: Record<string, SoundDef> = {
  round:   { file: 'round.wav',          maxDuration: 3 },
  alert15: { file: 'alert_15m-left.mp3', maxDuration: 5 },
};

type SoundId = keyof typeof SOUND_DEFS;

// ── Singleton AudioContext ────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let ctxUnlocked = false;

function getCtx(): AudioContext | null {
  if (!ctx) {
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

// ── Decoded buffers cache ─────────────────────────────────────────────────────

const bufferCache = new Map<SoundId, AudioBuffer>();
const fetchInFlight = new Set<SoundId>();

async function loadBuffer(id: SoundId): Promise<AudioBuffer | null> {
  if (bufferCache.has(id)) return bufferCache.get(id)!;
  if (fetchInFlight.has(id)) return null;
  fetchInFlight.add(id);

  const c = getCtx();
  if (!c) return null;

  try {
    const url = SOUNDS_BASE + SOUND_DEFS[id].file;
    const res = await fetch(url);
    if (!res.ok) return null;
    const raw = await res.arrayBuffer();
    const buf = await c.decodeAudioData(raw);
    bufferCache.set(id, buf);
    return buf;
  } catch {
    return null;
  } finally {
    fetchInFlight.delete(id);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call inside any synchronous user-gesture handler (button click, tap, etc.).
 * Unlocks the AudioContext on Safari/iOS and kicks off background buffer loads.
 * Idempotent — safe to call on every interaction.
 */
export function unlockAudio(): void {
  const c = getCtx();
  if (!c) return;

  if (!ctxUnlocked) {
    // Play a 1-sample silent buffer — the minimal gesture required by Safari
    try {
      const buf = c.createBuffer(1, 1, 22050);
      const src = c.createBufferSource();
      src.buffer = buf;
      src.connect(c.destination);
      src.start(0);
    } catch { /* ignore */ }
    void c.resume();
    ctxUnlocked = true;
  }

  // Start background preload of all sounds so they're ready before needed
  for (const id of Object.keys(SOUND_DEFS) as SoundId[]) {
    void loadBuffer(id);
  }
}

/**
 * Play a sound, stopping it after maxDuration seconds.
 * Works from any context (user gesture OR timer/effect) because it uses the
 * unlocked AudioContext, not HTMLAudioElement.
 */
export function playSound(id: SoundId): void {
  const c = getCtx();
  if (!c) return;

  const def = SOUND_DEFS[id];
  if (!def) return;

  const cached = bufferCache.get(id);

  if (cached) {
    // Buffer already decoded — play immediately
    _play(c, cached, def.maxDuration);
  } else {
    // Buffer not ready yet — load then play (adds a small one-time delay)
    loadBuffer(id).then(buf => {
      if (buf) _play(c, buf, def.maxDuration);
    });
  }
}

function _play(c: AudioContext, buffer: AudioBuffer, maxDuration: number): void {
  try {
    // Resume in case context was suspended (tab hidden, etc.)
    if (c.state !== 'running') void c.resume();

    const src = c.createBufferSource();
    src.buffer = buffer;

    // Gain node for volume control
    const gain = c.createGain();
    gain.gain.value = 0.7;
    src.connect(gain);
    gain.connect(c.destination);

    // Clamp playback to maxDuration even if the file is longer
    const duration = Math.min(buffer.duration, maxDuration);
    src.start(0, 0, duration);
  } catch {
    // Never throw — audio failure must not break the app
  }
}
