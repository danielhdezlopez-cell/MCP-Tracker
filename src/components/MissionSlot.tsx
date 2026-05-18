import { useMcpStore } from '../store/useMcpStore';
import './MissionSlot.css';

interface MissionSlotProps {
  type: 'Secure' | 'Extract';
}

export function MissionSlot({ type }: MissionSlotProps) {
  const { selectedSecure, selectedExtract, setCurrentPage, setPendingMissionType } = useMcpStore();

  const mission = type === 'Secure' ? selectedSecure : selectedExtract;
  const accent = type === 'Secure' ? 'left' : 'right';

  const handleClick = () => {
    setPendingMissionType(type);
    setCurrentPage('missions');
  };

  return (
    <div className={`mission-slot panel clip-panel-sm mission-slot--${accent}`} onClick={handleClick}>
      <div className={`mission-slot__type label-hud text-accent-${accent}`}>{type}</div>
      {mission ? (
        <>
          <div className="mission-slot__name">{mission.name}</div>
          <div className="mission-slot__threat">
            <span className="label-hud">THREAT</span>
            <span className={`mission-slot__threat-val text-accent-${accent}`}>{mission.threat}</span>
          </div>
        </>
      ) : (
        <div className="mission-slot__empty">
          <span className="mission-slot__plus">+</span>
          <span className="label-hud">SELECT MISSION</span>
        </div>
      )}
    </div>
  );
}
