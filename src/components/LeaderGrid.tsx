import { memo, useCallback } from 'react';
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

interface LeaderCardProps {
  leader: Leader;
  isLeft: boolean;
  isRight: boolean;
  onSelect: (leader: Leader) => void;
}

const LeaderCard = memo(function LeaderCard({ leader, isLeft, isRight, onSelect }: LeaderCardProps) {
  const variant = isLeft ? 'left' : isRight ? 'right' : 'neutral';
  const selected = isLeft || isRight;
  const handleClick = useCallback(() => onSelect(leader), [leader, onSelect]);
  const hasCover = Boolean(leader.coverImage);

  return (
    <button
      className={`leader-card ${isLeft ? 'selected-left' : ''} ${isRight ? 'selected-right' : ''} ${hasCover ? 'has-cover' : ''}`}
      onClick={handleClick}
      aria-label={`Select ${leader.name}`}
      style={hasCover ? { backgroundImage: `url(${leader.coverImage})` } : undefined}
    >
      {hasCover && <div className="leader-card__cover-overlay" />}
      <div className="leader-card__hex-wrap">
        <HexPortrait
          image={leader.image}
          name={leader.name}
          variant={variant}
          cssSize="160px"
          selected={selected}
        />
      </div>
      <div className="leader-card__affils">
        {leader.affiliations.slice(0, 2).map(a => (
          <span key={a} className="leader-card__affil">{getAffilDisplay(a)}</span>
        ))}
      </div>
    </button>
  );
});

export const LeaderGrid = memo(function LeaderGrid({ leaders, selectedLeftId, selectedRightId, onSelect }: LeaderGridProps) {
  return (
    <div className="leader-grid">
      {leaders.map(leader => (
        <LeaderCard
          key={leader.id}
          leader={leader}
          isLeft={leader.id === selectedLeftId}
          isRight={leader.id === selectedRightId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});
