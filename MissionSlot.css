import { useEffect } from 'react';
import { type Mission } from '../data/missionsData';
import './MissionCardViewer.css';

interface Props {
  mission: Mission;
  onClose: () => void;
}

export function MissionCardViewer({ mission, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="mcv-overlay" onClick={onClose}>
      <div className="mcv-container" onClick={e => e.stopPropagation()}>
        <div className="mcv-header">
          <span className="mcv-title label-hud">{mission.name}</span>
          <button className="mcv-close btn-hud" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="mcv-body">
          {mission.image ? (
            <img
              className="mcv-img"
              src={mission.image}
              alt={mission.name}
              draggable={false}
            />
          ) : (
            <div className="mcv-no-image label-hud">NO CARD IMAGE AVAILABLE</div>
          )}
        </div>
        <div className="mcv-footer">
          <span className={`mcv-type label-hud mcv-type--${mission.type === 'Secure' ? 'secure' : 'extract'}`}>
            {mission.type.toUpperCase()}
          </span>
          <span className="mcv-threat label-hud">
            THREAT <span className={`mcv-threat-val mcv-type--${mission.type === 'Secure' ? 'secure' : 'extract'}`}>{mission.threat}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
