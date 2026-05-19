import { useState } from 'react';
import { type Mission } from '../data/missionsData';
import { useMcpStore } from '../store/useMcpStore';
import { MissionCardViewer } from './MissionCardViewer';
import './MissionList.css';

interface MissionListProps {
  missions: Mission[];
  type: 'Secure' | 'Extract';
}

export function MissionList({ missions, type }: MissionListProps) {
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
            onClick={() => setSelected(selected?.id === mission.id ? null : mission)}
          >
            <div className="mission-item__check">
              {selected?.id === mission.id ? '✓' : '○'}
            </div>
            <div className="mission-item__info">
              <div className="mission-item__name">{mission.name}</div>
              <div className="mission-item__meta">
                <span className={`mission-item__type mission-item__type--${accent}`}>{mission.type}</span>
                <span className="mission-item__threat-label">THREAT</span>
                <span className="mission-item__threat">{mission.threat}</span>
              </div>
            </div>
            {mission.image && (
              <button
                className={`mission-item__view-btn mission-item__view-btn--${accent}`}
                onClick={e => { e.stopPropagation(); setViewing(mission); }}
                aria-label={`View card: ${mission.name}`}
              >
                🃏
              </button>
            )}
          </button>
        ))}
      </div>

      {viewing && (
        <MissionCardViewer mission={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  );
}
