const BASE = '/MCP-Tracker/sounds/';

const SOUNDS = {
  round:   { src: `${BASE}round.wav`,           maxDuration: 3 },
  alert15: { src: `${BASE}alert_15m-left.mp3`,  maxDuration: 5 },
} as const;

type SoundId = keyof typeof SOUNDS;

const audioMap = new Map<SoundId, HTMLAudioElement>();
let unlocked = false;

function getAudio(id: SoundId): HTMLAudioElement {
  if (!audioMap.has(id)) {
    const a = new Audio(SOUNDS[id].src);
    a.preload = 'auto';
    a.volume = 0.7;
    audioMap.set(id, a);
  }
  return audioMap.get(id)!;
}

/**
 * Call once after any user gesture to prime the Web Audio context on Safari.
 * Uses a silent 1-sample AudioContext buffer so we never interfere with the
 * actual sound elements (playing+pausing them would race with playSound calls
 * made in the same gesture handler).
 */
export function unlockAudio(): void {
  if (unlocked) return;
  unlocked = true;
  // Preload all audio files so they're ready when needed
  for (const id of Object.keys(SOUNDS) as SoundId[]) {
    getAudio(id).load();
  }
  // Unlock the audio context with a silent buffer — Safari requires a play()
  // call inside a synchronous user-gesture handler
  try {
    const ctx = new (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    void ctx.resume();
  } catch {
    // Older browsers without AudioContext — fall back to silent; direct play()
    // calls in user-gesture handlers will still work on most platforms.
  }
}

/**
 * Play a sound, stopping it after its configured maxDuration seconds.
 * If it is already playing, restart from the beginning.
 */
export function playSound(id: SoundId): void {
  try {
    const a = getAudio(id);
    const max = SOUNDS[id].maxDuration * 1000;

    a.pause();
    a.currentTime = 0;

    const p = a.play();
    if (p) {
      p.catch(() => {}); // silently ignore autoplay block
    }

    setTimeout(() => {
      a.pause();
      a.currentTime = 0;
    }, max);
  } catch {
    // Never throw — audio failure must not break the app
  }
}
