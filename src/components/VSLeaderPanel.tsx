import { memo } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import './VSLeaderPanel.css';

interface Props {
  side: 'left' | 'right';
  showPortrait: boolean;
}

export const VSLeaderPanel = memo(function VSLeaderPanel({ side, showPortrait }: Props) {
  const leader               = useMcpStore(s => side === 'left' ? s.leaderLeft  : s.leaderRight);
  const setCurrentPage       = useMcpStore(s => s.setCurrentPage);
  const setPendingLeaderAssign = useMcpStore(s => s.setPendingLeaderAssign);

  const handleClick = () => {
    setPendingLeaderAssign(side);
    setCurrentPage('leaders');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
  };

  const ariaLabel = leader
    ? `Change leader: ${leader.name}`
    : `Assign ${side === 'left' ? 'Player 1' : 'Player 2'} leader`;

  if (!showPortrait) {
    return (
      <div
        className={`vs-leader-panel vs-leader-panel--${side} vs-leader-panel--hidden`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <div
      className={`vs-leader-panel vs-leader-panel--${side}${!leader ? ' vs-leader-panel--empty' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      {leader ? (
        <img
          src={leader.image ?? ''}
          alt={leader.name}
          className="vs-leader-panel__por"
          draggable={false}
        />
      ) : (
        <div className="vs-leader-panel__empty">
          <div className="vs-leader-panel__plus">+</div>
          <div className="vs-leader-panel__hint">TAP · ASSIGN</div>
        </div>
      )}
    </div>
  );
});
