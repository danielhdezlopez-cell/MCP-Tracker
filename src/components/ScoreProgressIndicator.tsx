import { type RoundScoreEntry } from '../store/useMcpStore';
import './ScoreProgressIndicator.css';

/**
 * ScoreProgressIndicator
 * ----------------------
 * Non-interactive HUD grid (1–16). Active cells show current P1/P2 score.
 * Past rounds leave small dots in the bottom corners of each earned cell.
 */
interface ScoreProgressIndicatorProps {
  player1Score: number;
  player2Score: number;
  roundScoreHistory?: RoundScoreEntry[];
}

const TOTAL_POINTS = 16;
const POINTS = Array.from({ length: TOTAL_POINTS }, (_, i) => i + 1);

function displayPoint(score: number): number {
  if (score <= 0) return 0;
  return Math.min(score, TOTAL_POINTS);
}

export function ScoreProgressIndicator({
  player1Score,
  player2Score,
  roundScoreHistory = [],
}: ScoreProgressIndicatorProps) {
  const p1 = displayPoint(player1Score);
  const p2 = displayPoint(player2Score);

  // Build sets: which cells have a P1 or P2 history mark
  const p1Marked = new Set<number>();
  const p2Marked = new Set<number>();
  for (const entry of roundScoreHistory) {
    for (let i = entry.p1Start + 1; i <= Math.min(entry.p1End, TOTAL_POINTS); i++) p1Marked.add(i);
    for (let i = entry.p2Start + 1; i <= Math.min(entry.p2End, TOTAL_POINTS); i++) p2Marked.add(i);
  }

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
          const hasP1Mark = p1Marked.has(n);
          const hasP2Mark = p2Marked.has(n);
          return (
            <div key={n} className="score-progress__cell" data-fill={fill}>
              <span className="score-progress__num">{n}</span>
              {hasP1Mark && <span className="score-progress__mark score-progress__mark--p1" />}
              {hasP2Mark && <span className="score-progress__mark score-progress__mark--p2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
