import { useEffect, useRef, useState } from 'react';
import { BACKGROUNDS } from '../data/backgroundsManifest';
import './RoundBackground.css';

const BASE = `${import.meta.env.BASE_URL}backgrounds/`;

/** Baraja Fisher-Yates (copia) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Background alternativo por ronda.
 *
 * - round <= 1  → no renderiza nada (se ve el wallpaper interactivo actual).
 * - round >= 2  → muestra una imagen aleatoria del mazo (sin repetir hasta
 *   agotarlo) con transición crossfade + zoom + barrido de escaneo.
 * - Si la ronda vuelve a 1 (nueva partida), se rebaraja el mazo.
 *
 * Uso: <RoundBackground round={round} />
 * Colocar como PRIMER hijo del contenedor de la pantalla MAIN
 * (el contenedor debe tener position: relative u overflow propio).
 */
export default function RoundBackground({ round }) {
  // Mazo barajado de imágenes para la partida en curso
  const deckRef = useRef(shuffle(BACKGROUNDS));
  const deckIdxRef = useRef(0);
  const lastRoundRef = useRef(round);

  // Dos capas para el crossfade: [src capa A, src capa B]
  const [layers, setLayers] = useState([null, null]);
  // Capa activa (la visible): 0 ó 1
  const [active, setActive] = useState(0);
  const [sweep, setSweep] = useState(false);

  useEffect(() => {
    const prev = lastRoundRef.current;
    lastRoundRef.current = round;

    // Nueva partida: ronda baja a 1 → rebarajar y limpiar
    if (round <= 1) {
      if (prev > 1) {
        deckRef.current = shuffle(BACKGROUNDS);
        deckIdxRef.current = 0;
        setLayers([null, null]);
      }
      return;
    }

    // Ronda 2+ y la ronda ha cambiado (o primera vez que entramos en 2+)
    if (round === prev && layers[active]) return;

    // Sacar siguiente carta del mazo (rebarajar si se agota)
    if (deckIdxRef.current >= deckRef.current.length) {
      deckRef.current = shuffle(BACKGROUNDS);
      deckIdxRef.current = 0;
    }
    const next = BASE + deckRef.current[deckIdxRef.current++];

    // Precargar y, al estar lista, hacer el crossfade en la capa oculta
    const img = new Image();
    img.onload = () => {
      const hidden = active === 0 ? 1 : 0;
      setLayers((l) => {
        const copy = [...l];
        copy[hidden] = next;
        return copy;
      });
      // Doble rAF para garantizar que la capa monta con opacity 0 antes de animar
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setActive(hidden);
          setSweep(true);
          setTimeout(() => setSweep(false), 900);
        })
      );
    };
    img.src = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // Ronda 1: dejar ver el background interactivo actual
  if (round <= 1 || (!layers[0] && !layers[1])) return null;

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
