import { useEffect, useRef, useState } from 'react';
import { BACKGROUNDS } from '../data/backgroundsManifest';
import { LEADER_BACKGROUNDS } from '../data/leaderBackgroundsMap';
import './RoundBackground.css';

const BASE = `${import.meta.env.BASE_URL}backgrounds/`;

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
 * Per-player round background.
 *
 * - round <= 1 or no leaderId → renders nothing (theme wallpaper shows through).
 * - round >= 2 + leaderId → crossfade through images specific to that leader.
 *   Leaders with no curated images fall back to the global shuffled deck.
 * - Leader change mid-game → deck resets immediately to the new leader's pool.
 *
 * Mount inside each vs-battle__side (position:relative / overflow:hidden).
 */
export default function RoundBackground({ round, leaderId }) {
  const deckRef       = useRef(shuffle(getPool(leaderId)));
  const deckIdxRef    = useRef(0);
  const prevRoundRef  = useRef(round);
  const prevLeaderRef = useRef(leaderId);
  const activeRef     = useRef(0); // mirrors `active` — always current in async callbacks

  const [layers, setLayers] = useState([null, null]);
  const [active,  setActive]  = useState(0);
  const [sweep,   setSweep]   = useState(false);

  useEffect(() => {
    const prevRound  = prevRoundRef.current;
    const prevLeader = prevLeaderRef.current;
    prevRoundRef.current  = round;
    prevLeaderRef.current = leaderId;

    const leaderChanged = leaderId !== prevLeader;

    // Reset deck and clear layers when the leader changes.
    if (leaderChanged) {
      deckRef.current    = shuffle(getPool(leaderId));
      deckIdxRef.current = 0;
      activeRef.current  = 0;
      setLayers([null, null]);
      setActive(0);
    }

    // Nothing to show: round 1 or no leader.
    if (round <= 1 || !leaderId) {
      if (!leaderChanged && (prevRound > 1 || prevLeader)) {
        setLayers([null, null]);
        activeRef.current = 0;
        setActive(0);
      }
      return;
    }

    // Skip if neither round nor leader changed.
    if (!leaderChanged && round === prevRound) return;

    // Advance the deck (reshuffle when exhausted).
    if (deckIdxRef.current >= deckRef.current.length) {
      deckRef.current    = shuffle(getPool(leaderId));
      deckIdxRef.current = 0;
    }
    const next = BASE + deckRef.current[deckIdxRef.current++];

    const img = new Image();
    img.onload = () => {
      const hidden = activeRef.current === 0 ? 1 : 0;
      setLayers((l) => {
        const copy = [...l];
        copy[hidden] = next;
        return copy;
      });
      // Double-rAF: new element mounts at opacity:0, then is-active triggers the transition.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          activeRef.current = hidden;
          setActive(hidden);
          setSweep(true);
          setTimeout(() => setSweep(false), 900);
        })
      );
    };
    img.src = next;
  }, [round, leaderId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (round <= 1 || !leaderId || (!layers[0] && !layers[1])) return null;

  return (
    <div className={`round-bg${sweep ? ' round-bg--sweep' : ''}`} aria-hidden="true">
      {layers.map((src, i) =>
        src ? (
          <div
            key={src}
            className={`round-bg__layer${i === active ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ) : null
      )}
      <div className="round-bg__shade" />
    </div>
  );
}
