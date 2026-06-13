import { type RoundScoreEntry } from '../store/useMcpStore';
import './ScoreProgressIndicator.css';

/**
 * ScoreProgressIndicator
 * ----------------------
 * Non-interactive HUD grid (1–16). Active cells show current P1/P2 score.
 * The cell where each player ended a past round shows a small round-number badge.
 * P1 badge → bottom-left (red). P2 badge → bottom-right (blue).
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

  // Map: cell number → round label for P1 / P2
  // Only the final score cell of each round gets a mark.
  // If a later round overwrites the same cell, the latest round wins.
  const p1RoundAt = new Map<number, number>();
  const p2RoundAt = new Map<number, number>();
  for (const entry of roundScoreHistory) {
    const p1Cell = Math.min(entry.p1End, TOTAL_POINTS);
    const p2Cell = Math.min(entry.p2End, TOTAL_POINTS);
    if (p1Cell > 0) p1RoundAt.set(p1Cell, entry.round);
    if (p2Cell > 0) p2RoundAt.set(p2Cell, entry.round);
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
          const p1Round = p1RoundAt.get(n);
          const p2Round = p2RoundAt.get(n);
          return (
            <div key={n} className="score-progress__cell" data-fill={fill}>
              <span className="score-progress__num">{n}</span>
              {p1Round !== undefined && (
                <span className="score-progress__mark score-progress__mark--p1">{p1Round}</span>
              )}
              {p2Round !== undefined && (
                <span className="score-progress__mark score-progress__mark--p2">{p2Round}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
