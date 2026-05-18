import { type Leader } from '../data/leadersData';
import './LeaderGrid.css';

interface LeaderGridProps {
  leaders: Leader[];
  selectedLeftId?: string | null;
  selectedRightId?: string | null;
  onSelect: (leader: Leader) => void;
  assignSide: 'left' | 'right';
}

export function LeaderGrid({ leaders, selectedLeftId, selectedRightId, onSelect }: LeaderGridProps) {
  return (
    <div className="leader-grid">
      {leaders.map(leader => {
        const isLeft = leader.id === selectedLeftId;
        const isRight = leader.id === selectedRightId;
        return (
          <button
            key={leader.id}
            className={`leader-card ${isLeft ? 'selected-left' : ''} ${isRight ? 'selected-right' : ''}`}
            onClick={() => onSelect(leader)}
            aria-label={`Select ${leader.name}`}
          >
            <div className="leader-card__img-wrap">
              {leader.image ? (
                <img src={leader.image} alt={leader.name} className="leader-card__img" draggable={false} />
              ) : (
                <div className="leader-card__placeholder">
                  <span>{leader.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                </div>
              )}
              {(isLeft || isRight) && (
                <div className={`leader-card__badge leader-card__badge--${isLeft ? 'left' : 'right'}`}>
                  {isLeft ? 'P1' : 'P2'}
                </div>
              )}
            </div>
            <div className="leader-card__name">{leader.name}</div>
            <div className="leader-card__affils">
              {leader.affiliations.slice(0, 2).map(a => (
                <span key={a} className="leader-card__affil">{a}</span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
