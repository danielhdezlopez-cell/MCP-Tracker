import { useEffect, useRef, useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import './EnergyScan.css';

/*══════════════════════════════════════════════════════════════════
  ENERGY SCAN — barrido de cambio de líder (versión estructura REAL)

  Se monta como hijo directo de .vs-battle, JUSTO DESPUÉS de <VSBackground/>.
  Su geometría es IDÉNTICA a .vs-bg (absolute inset:0, dos mitades flex:1),
  por lo que cada mitad coincide EXACTAMENTE con la imagen/vídeo del líder
  y llega al CENTRO REAL — sin depender del panel central .vs-battle__sep.

  - P1: la línea barre la mitad izquierda completa (borde izq → centro).
  - P2: la línea barre la mitad derecha completa (borde der → centro).
  - overflow:hidden por mitad ⇒ el glow nunca invade al rival.
  - z-index por encima de .vs-bg + sus overlays oscuros (solidez/glow intactos),
    por debajo de timer / VS / scores / misiones.
══════════════════════════════════════════════════════════════════*/

const SCAN_DUR = 1100; // mantener sincronizado con --escan-dur en EnergyScan.css

type Side = 'left' | 'right';

export function EnergyScan() {
  const leaderLeft  = useMcpStore(s => s.leaderLeft);
  const leaderRight = useMcpStore(s => s.leaderRight);
  const round       = useMcpStore(s => s.round);

  const [scanL, setScanL] = useState(false);
  const [scanR, setScanR] = useState(false);

  const prevLeftId  = useRef(leaderLeft?.id ?? null);
  const prevRightId = useRef(leaderRight?.id ?? null);
  const prevRound   = useRef(round);
  const tL = useRef<number | undefined>(undefined);
  const tR = useRef<number | undefined>(undefined);

  const fire = (side: Side) => {
    if (side === 'left') {
      setScanL(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setScanL(true)));
      window.clearTimeout(tL.current);
      tL.current = window.setTimeout(() => setScanL(false), SCAN_DUR + 60);
    } else {
      setScanR(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setScanR(true)));
      window.clearTimeout(tR.current);
      tR.current = window.setTimeout(() => setScanR(false), SCAN_DUR + 60);
    }
  };

  // Dispara el lado cuyo líder cambia
  useEffect(() => {
    const id = leaderLeft?.id ?? null;
    if (id !== prevLeftId.current) {
      prevLeftId.current = id;
      if (id) setTimeout(() => fire('left'), 0);
    }
  }, [leaderLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = leaderRight?.id ?? null;
    if (id !== prevRightId.current) {
      prevRightId.current = id;
      if (id) setTimeout(() => fire('right'), 0);
    }
  }, [leaderRight]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al avanzar de ronda, barre ambos lados
  useEffect(() => {
    if (round !== prevRound.current) {
      prevRound.current = round;
      setTimeout(() => {
        if (leaderLeft)  fire('left');
        if (leaderRight) fire('right');
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => () => { window.clearTimeout(tL.current); window.clearTimeout(tR.current); }, []);

  return (
    <div className="escan" aria-hidden="true">
      <div className={`escan__half escan__half--left${scanL ? ' is-scanning' : ''}`}>
        <span className="escan__beam">
          <span className="escan__trail" />
          <span className="escan__glow" />
          <span className="escan__core" />
        </span>
      </div>
      <div className={`escan__half escan__half--right${scanR ? ' is-scanning' : ''}`}>
        <span className="escan__beam">
          <span className="escan__trail" />
          <span className="escan__glow" />
          <span className="escan__core" />
        </span>
      </div>
    </div>
  );
}
