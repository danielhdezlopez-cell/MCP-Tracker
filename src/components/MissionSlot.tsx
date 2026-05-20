import { useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { MissionCardViewer } from './MissionCardViewer';
import './MissionSlot.css';

interface MissionSlotProps {
  type: 'Secure' | 'Extract';
}

export function MissionSlot({ type }: MissionSlotProps) {
  const { selectedSecure, selectedExtract, setCurrentPage, setPendingMissionType } = useMcpStore();
  const [viewing, setViewing] = useState(false);

  const mission = type === 'Secure' ? selectedSecure : selectedExtract;
  const accent = type === 'Secure' ? 'left' : 'right';

  const handleClick = () => {
    setPendingMissionType(type);
    setCurrentPage('missions');
  };

  const handleViewCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewing(true);
  };

  return (
    <>
      <div className={`mission-slot panel clip-panel-sm mission-slot--${accent}`} onClick={handleClick}>
        <div className="mission-slot__stripe" />
        <div className="mission-slot__type label-hud">{type}</div>
        {mission ? (
          <>
            <div className="mission-slot__name">{mission.name}</div>
            <div className="mission-slot__threat">
              <span className="label-hud">THREAT</span>
              <span className="mission-slot__threat-val">{mission.threat}</span>
              {mission.image && (
                <button
                  className={`mission-slot__view-btn mission-slot__view-btn--${accent}`}
                  onClick={handleViewCard}
                  aria-label="View mission card"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="mission-slot__empty">
            <span className="mission-slot__plus">+</span>
            <span className="label-hud">SELECT {type.toUpperCase()}</span>
          </div>
        )}
      </div>

      {viewing && mission && (
        <MissionCardViewer mission={mission} onClose={() => setViewing(false)} />
      )}
    </>
  );
}
