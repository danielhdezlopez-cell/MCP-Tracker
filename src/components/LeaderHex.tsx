import { useMcpStore } from '../store/useMcpStore';
import { assetUrl } from '../utils/assetUrl';
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
    <div className={`leader-hex leader-hex--${side}`} onClick={handleClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && handleClick()}>
      <div className="leader-hex__outer">
        <div className="leader-hex__ring" />
        <div className="leader-hex__inner">
          {leader?.image ? (
            <img
              src={assetUrl(leader.image)}
              alt={leader.name}
              className="leader-hex__img"
              draggable={false}
            />
          ) : leader ? (
            <div className="leader-hex__placeholder">
              <span className="leader-hex__initials">
                {leader.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
          ) : (
            <div className="leader-hex__empty">
              <span className="leader-hex__plus">+</span>
              <span className="leader-hex__hint">SELECT</span>
            </div>
          )}
        </div>
      </div>
      {leader && (
        <div className={`leader-hex__name text-accent-${side}`}>{leader.name}</div>
      )}
    </div>
  );
}
