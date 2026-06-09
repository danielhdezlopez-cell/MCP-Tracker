import './ScoreProgressIndicator.css';

/**
 * ScoreProgressIndicator
 * ----------------------
 * Indicador visual NO interactivo del progreso de puntos (1–16) de ambos jugadores.
 * Renderiza un grid HUD sutil: dos filas de 8 celdas.
 *   · Fila 1 → puntos 1–8
 *   · Fila 2 → puntos 9–16
 *
 * Se resalta la celda que coincide con la puntuación ACTUAL de cada jugador:
 *   · Player 1 → rojo
 *   · Player 2 → azul
 *   · Misma puntuación → borde dividido rojo/azul con doble glow.
 *
 * Es SOLO una referencia: nunca modifica la puntuación y no es clicable ni enfocable.
 */
interface ScoreProgressIndicatorProps {
  player1Score: number;
  player2Score: number;
}

const TOTAL_POINTS = 16;
const POINTS = Array.from({ length: TOTAL_POINTS }, (_, i) => i + 1);

/** Acota una puntuación cruda a la ventana visible 0–16. */
function displayPoint(score: number): number {
  if (score <= 0) return 0;
  return Math.min(score, TOTAL_POINTS);
}

export function ScoreProgressIndicator({
  player1Score,
  player2Score,
}: ScoreProgressIndicatorProps) {
  const p1 = displayPoint(player1Score);
  const p2 = displayPoint(player2Score);

  return (
    <div
      className="score-progress"
      role="img"
      aria-label={`Progreso de puntos — Jugador 1 en ${p1}, Jugador 2 en ${p2}, de ${TOTAL_POINTS}`}
    >
      <div className="score-progress__grid" aria-hidden="true">
        {POINTS.map((n) => {
          const isP1 = n === p1;
          const isP2 = n === p2;
          const fill = isP1 && isP2 ? 'both' : isP1 ? 'p1' : isP2 ? 'p2' : 'none';
          return (
            <div key={n} className="score-progress__cell" data-fill={fill}>
              <span className="score-progress__num">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
