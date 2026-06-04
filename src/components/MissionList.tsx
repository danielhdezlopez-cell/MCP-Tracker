import { useState } from 'react';
import { type Mission } from '../data/missionsData';
import { useMcpStore } from '../store/useMcpStore';
import { MissionCardViewer } from './MissionCardViewer';
import './MissionList.css';

interface MissionListProps {
  missions: Mission[];
  type: 'Secure' | 'Extract';
  onSelect?: () => void;
}

export function MissionList({ missions, type, onSelect }: MissionListProps) {
  const { selectedSecure, selectedExtract, setSelectedSecure, setSelectedExtract } = useMcpStore();
  const [viewing, setViewing] = useState<Mission | null>(null);

  const selected = type === 'Secure' ? selectedSecure : selectedExtract;
  const setSelected = type === 'Secure' ? setSelectedSecure : setSelectedExtract;
  const accent = type === 'Secure' ? 'left' : 'right';

  return (
    <>
      <div className="mission-list">
        {missions.map(mission => (
          <button
            key={mission.id}
            className={`mission-item mission-item--${accent} ${selected?.id === mission.id ? 'selected' : ''}`}
            onClick={() => {
                const next = selected?.id === mission.id ? null : mission;
                setSelected(next);
                if (next !== null) onSelect?.();
              }}
          >
            {mission.image && (
              <button
                className={`mission-item__view-btn mission-item__view-btn--${accent}`}
                onClick={e => { e.stopPropagation(); setViewing(mission); }}
                aria-label={`View card: ${mission.name}`}
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            )}
            <div className="mission-item__check">
              {selected?.id === mission.id ? '✓' : '○'}
            </div>
            <div className="mission-item__info">
              <div className="mission-item__name">{mission.name}</div>
            </div>
            <div className="mission-item__threat-corner">
              <span className="mission-item__threat-label">THREAT</span>
              <span className="mission-item__threat">{mission.threat}</span>
            </div>
          </button>
        ))}
      </div>

      {viewing && (
        <MissionCardViewer mission={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  );
}
