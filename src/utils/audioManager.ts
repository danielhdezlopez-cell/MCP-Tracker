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

/** Call once after any user gesture to prime the Web Audio context on Safari. */
export function unlockAudio(): void {
  if (unlocked) return;
  unlocked = true;
  for (const id of Object.keys(SOUNDS) as SoundId[]) {
    const a = getAudio(id);
    a.load();
    // Play then immediately pause — enough to unblock autoplay policy
    const p = a.play();
    if (p) p.then(() => a.pause()).catch(() => {});
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
