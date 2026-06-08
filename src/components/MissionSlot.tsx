import { useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { MissionCardViewer } from './MissionCardViewer';
import { MissionRing } from './MissionRing';
import './MissionSlot.css';

interface MissionSlotProps {
  type: 'Secure' | 'Extract';
}

/**
 * Mission ring style:
 *   'a' — Integrated Corner Ring (clean, sits inside the bottom-right corner)
 *   'b' — Floating Mission Badge (overflows the corner, stronger glow + float)
 * Flip this single constant to switch the whole MAIN screen between versions.
 */
const RING_VARIANT: 'a' | 'b' = 'a';

export function MissionSlot({ type }: MissionSlotProps) {
  const { selectedSecure, selectedExtract, setCurrentPage, setPendingMissionType } = useMcpStore();
  const [viewing, setViewing] = useState(false);

  const mission = type === 'Secure' ? selectedSecure : selectedExtract;
  const accent = type === 'Secure' ? 'left' : 'right';
  const ringWord = type === 'Secure' ? 'SECURE' : 'EXTRACTION';

  const handleClick = () => {
    setPendingMissionType(type);
    setCurrentPage('missions');
  };

  // Ring keeps the old eye behaviour: open the mission card detail when there is
  // a card image; otherwise fall through to the mission picker.
  const handleRingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mission?.image) setViewing(true);
    else handleClick();
  };

  return (
    <>
      <div
        className={`mission-slot panel clip-panel-sm mission-slot--${accent}`}
        data-ring={RING_VARIANT}
        onClick={handleClick}
      >
        <div className="mission-slot__stripe" />
        <div className="mission-slot__type label-hud">{type}</div>
        {mission ? (
          <>
            <div className="mission-slot__name">{mission.name}</div>
            <button
              className={`mission-ring mission-ring--${accent}`}
              onClick={handleRingClick}
              aria-label={`THREAT ${mission.threat} — open ${type} mission detail`}
            >
              <MissionRing side={accent} word={ringWord} />
              <span className="mission-ring__num">{mission.threat}</span>
            </button>
          </>
        ) : (
          <div className="mission-slot__empty">
            <span className="mission-slot__plus">+</span>
          </div>
        )}
      </div>

      {viewing && mission && (
        <MissionCardViewer mission={mission} onClose={() => setViewing(false)} />
      )}
    </>
  );
}
