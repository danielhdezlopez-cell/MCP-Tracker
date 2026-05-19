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
      <div className="leader-hex__portrait-wrap">
        <div className="leader-hex__corner leader-hex__corner--tl" />
        <div className="leader-hex__corner leader-hex__corner--tr" />
        <div className="leader-hex__corner leader-hex__corner--bl" />
        <div className="leader-hex__corner leader-hex__corner--br" />
        <HexPortrait
          image={leader?.image ?? null}
          name={leader?.name ?? ''}
          variant={side}
          cssSize="clamp(100px, 14vw, 160px)"
          empty={!leader}
        />
      </div>
      {leader && (
        <div className={`leader-hex__name text-accent-${side}`}>{leader.name}</div>
      )}
    </div>
  );
}
