import { useEffect, useRef, useState } from 'react';
import { BACKGROUNDS } from '../data/backgroundsManifest';
import { LEADER_BACKGROUNDS } from '../data/leaderBackgroundsMap';
import './RoundBackground.css';

const BASE = `${import.meta.env.BASE_URL}backgrounds/`;
const FADE_DUR = 400;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPool(leaderId) {
  if (!leaderId) return BACKGROUNDS;
  return LEADER_BACKGROUNDS[leaderId] ?? BACKGROUNDS;
}

/**
 * Per-player round background with crossfade transition.
 *
 * - round <= 1 or no leaderId → renders nothing (theme wallpaper shows through).
 * - round >= 2 + leaderId → crossfade through images specific to that leader.
 * - Leader change mid-game → deck resets immediately to the new leader's pool.
 *
 * Mount inside each vs-battle__side (position:relative / overflow:hidden).
 */
export default function RoundBackground({ round, leaderId, side = 'left' }) {
  const deckRef       = useRef(shuffle(getPool(leaderId)));
  const deckIdxRef    = useRef(0);
  const prevRoundRef  = useRef(round);
  const prevLeaderRef = useRef(leaderId);
  const activeRef     = useRef(0);
  const busyRef       = useRef(false);

  const [layers,   setLayers]   = useState([null, null]);
  const [keys,     setKeys]     = useState([0, 0]);
  const [active,   setActive]   = useState(0);
  const [entering, setEntering] = useState(-1);

  useEffect(() => {
    const prevRound  = prevRoundRef.current;
    const prevLeader = prevLeaderRef.current;
    prevRoundRef.current  = round;
    prevLeaderRef.current = leaderId;

    const leaderChanged = leaderId !== prevLeader;

    if (leaderChanged) {
      deckRef.current    = shuffle(getPool(leaderId));
      deckIdxRef.current = 0;
      activeRef.current  = 0;
      busyRef.current    = false;
      setLayers([null, null]);
      setKeys([0, 0]);
      setActive(0);
      setEntering(-1);
    }

    if (round <= 1 || !leaderId) {
      if (!leaderChanged && (prevRound > 1 || prevLeader)) {
        setLayers([null, null]);
        activeRef.current = 0;
        setActive(0);
        setEntering(-1);
      }
      return;
    }

    if (!leaderChanged && round === prevRound) return;
    if (busyRef.current) return;
    busyRef.current = true;

    if (deckIdxRef.current >= deckRef.current.length) {
      deckRef.current    = shuffle(getPool(leaderId));
      deckIdxRef.current = 0;
    }
    const next = BASE + deckRef.current[deckIdxRef.current++];

    const img = new Image();
    img.onload = () => {
      const hiddenIdx = activeRef.current === 0 ? 1 : 0;

      setLayers((l) => {
        const copy = [...l];
        copy[hiddenIdx] = next;
        return copy;
      });
      setKeys((k) => {
        const copy = [...k];
        copy[hiddenIdx] = k[hiddenIdx] + 1;
        return copy;
      });

      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setEntering(hiddenIdx);

          setTimeout(() => {
            activeRef.current = hiddenIdx;
            setActive(hiddenIdx);
            setEntering(-1);
            busyRef.current = false;
          }, FADE_DUR + 40);
        })
      );
    };
    img.onerror = () => { busyRef.current = false; };
    img.src = next;
  }, [round, leaderId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (round <= 1 || !leaderId || (!layers[0] && !layers[1])) return null;

  return (
    <div
      className={`round-bg round-bg--${side}`}
      aria-hidden="true"
    >
      {layers.map((src, i) =>
        src ? (
          <div
            key={`${keys[i]}-${src}`}
            className={[
              'round-bg__layer',
              i === active   ? 'is-active'  : '',
              i === entering ? 'is-entering' : '',
            ].filter(Boolean).join(' ')}
            style={{ backgroundImage: `url(${src})` }}
          />
        ) : null
      )}
      <div className="round-bg__shade" />
    </div>
  );
}
