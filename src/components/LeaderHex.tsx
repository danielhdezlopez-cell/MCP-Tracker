import { useMcpStore } from '../store/useMcpStore';
import { HexPortrait } from './HexPortrait';
import './LeaderHex.css';

interface LeaderHexProps {
  side: 'left' | 'right';
}

export function LeaderHex({ side }: LeaderHexProps) {
  const { leaderLeft, leaderRight, setCurrentPage, setPendingLeaderAssign } = useMcpStore();

  const leader = side === 'left' ? leaderLeft : leaderRight;

  const handleClick = () => {
    setPendingLeaderAssign(side);
    setCurrentPage('leaders');
  };

  return (
    <div className={`leader-hex leader-hex--${side}`} onClick={handleClick}>
      <HexPortrait
        image={leader?.image ?? null}
        name={leader?.name ?? ''}
        variant={side}
        cssSize="clamp(100px, 14vw, 160px)"
        empty={!leader}
      />
      {leader && (
        <div className={`leader-hex__name text-accent-${side}`}>{leader.name}</div>
      )}
    </div>
  );
}
