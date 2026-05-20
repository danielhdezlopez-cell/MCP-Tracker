import { type Leader, getAffilDisplay } from '../data/leadersData';
import { HexPortrait } from './HexPortrait';
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
        const variant = isLeft ? 'left' : isRight ? 'right' : 'neutral';
        const selected = isLeft || isRight;

        return (
          <button
            key={leader.id}
            className={`leader-card ${isLeft ? 'selected-left' : ''} ${isRight ? 'selected-right' : ''}`}
            onClick={() => onSelect(leader)}
            aria-label={`Select ${leader.name}`}
          >
            <div className="leader-card__hex-wrap">
              <HexPortrait
                image={leader.image}
                name={leader.name}
                variant={variant}
                cssSize="100px"
                selected={selected}
              />
              {(isLeft || isRight) && (
                <div className={`leader-card__badge leader-card__badge--${isLeft ? 'left' : 'right'}`}>
                  {isLeft ? 'P1' : 'P2'}
                </div>
              )}
            </div>
            <div className="leader-card__name">{leader.name}</div>
            <div className="leader-card__affils">
              {leader.affiliations.slice(0, 2).map(a => (
                <span key={a} className="leader-card__affil">{getAffilDisplay(a)}</span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
