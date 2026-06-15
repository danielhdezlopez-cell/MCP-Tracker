import { memo, useEffect, useRef, useState } from 'react';
import { type Leader } from '../data/leadersData';
import { useMcpStore } from '../store/useMcpStore';
import './VSLeaderPanel.css';

interface Props {
  side: 'left' | 'right';
  showPortrait: boolean;
}

const SCAN_DUR = 850; // ms — keep in sync with --scan-dur in CSS

interface PanelState {
  layerData: [Leader | null, Leader | null];
  activeIdx: 0 | 1;
  enteringIdx: 0 | 1 | null;
  scanning: boolean;
}

export const VSLeaderPanel = memo(function VSLeaderPanel({ side, showPortrait }: Props) {
  const leader               = useMcpStore(s => side === 'left' ? s.leaderLeft  : s.leaderRight);
  const setCurrentPage       = useMcpStore(s => s.setCurrentPage);
  const setPendingLeaderAssign = useMcpStore(s => s.setPendingLeaderAssign);

  const busyRef       = useRef(false);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLeaderRef = useRef<Leader | null>(leader);

  const [panelState, setPanelState] = useState<PanelState>({
    layerData:   [leader, null],
    activeIdx:   0,
    enteringIdx: null,
    scanning:    false,
  });

  useEffect(() => {
    const prev = prevLeaderRef.current;
    prevLeaderRef.current = leader;

    // Animate only leader→leader swaps; first assignment (null→leader) appears instantly
    if (!prev || !leader || prev.id === leader.id) return;
    if (busyRef.current) return;

    busyRef.current = true;

    setPanelState(s => {
      const incomingIdx: 0 | 1 = s.activeIdx === 0 ? 1 : 0;
      const layerData = [...s.layerData] as [Leader | null, Leader | null];
      layerData[incomingIdx] = leader;
      return { layerData, activeIdx: s.activeIdx, enteringIdx: incomingIdx, scanning: true };
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPanelState(s => ({
        layerData:   s.layerData,
        activeIdx:   (s.enteringIdx ?? s.activeIdx) as 0 | 1,
        enteringIdx: null,
        scanning:    false,
      }));
      busyRef.current = false;
    }, SCAN_DUR + 40);
  }, [leader]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

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

  const { layerData, activeIdx, enteringIdx, scanning } = panelState;

  const containerClass = [
    'vs-leader-panel',
    `vs-leader-panel--${side}`,
    scanning ? 'scanning' : '',
    !leader  ? 'vs-leader-panel--empty' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClass}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      {/* Two persistent transparent layers — only portrait image, video shows through */}
      <div className="vs-leader-panel__view">
        {([0, 1] as const).map(idx => {
          const layerLeader = layerData[idx];
          const isActive   = idx === activeIdx;
          const isEntering = idx === enteringIdx;
          const isLeaving  = isActive && enteringIdx !== null;

          const layerClass = [
            'vs-leader-panel__layer',
            isActive   ? 'is-active' : '',
            isEntering ? 'entering'  : '',
            isLeaving  ? 'leaving'   : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={idx} className={layerClass}>
              {layerLeader && (
                <img
                  src={layerLeader.image ?? ''}
                  alt={layerLeader.name}
                  className="vs-leader-panel__layer-por"
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Scan bar — above layers, below frame */}
      <div className="vs-leader-panel__fx" aria-hidden="true">
        <div className="vs-leader-panel__scanbar" />
      </div>

      {/* Frame — carries the cyan glow pulse during scan */}
      <div className="vs-leader-panel__frame" aria-hidden="true" />

      {/* Empty-slot prompt */}
      {!leader && (
        <div className="vs-leader-panel__empty">
          <div className="vs-leader-panel__plus">+</div>
          <div className="vs-leader-panel__hint">TAP · ASSIGN</div>
        </div>
      )}
    </div>
  );
});
