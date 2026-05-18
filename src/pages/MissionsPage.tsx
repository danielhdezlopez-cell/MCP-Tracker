import { useMcpStore } from '../store/useMcpStore';
import { EXTRACT_MISSIONS, SECURE_MISSIONS } from '../data/missionsData';
import { MissionList } from '../components/MissionList';
import './MissionsPage.css';

export function MissionsPage() {
  const { pendingMissionType, setPendingMissionType, setCurrentPage, selectedSecure, selectedExtract } = useMcpStore();

  const handleBack = () => {
    setPendingMissionType(null);
    setCurrentPage('main');
  };

  return (
    <div className="missions-page">
      {/* Title bar */}
      <div className="page-title-bar">
        <div className="page-title-bar__deco page-title-bar__deco--left">
          <div className="page-title-bar__deco-line" />
          <div className="page-title-bar__deco-dot" />
        </div>
        <span className="page-title-bar__text">Crisis Cards</span>
        <div className="page-title-bar__deco page-title-bar__deco--right">
          <div className="page-title-bar__deco-dot" />
          <div className="page-title-bar__deco-line" />
        </div>
      </div>

      {/* Sub-header */}
      <div className="missions-page__header">
        {pendingMissionType && (
          <button className="btn-hud missions-page__back-btn" onClick={handleBack}>
            ← BACK
          </button>
        )}
        <div className="missions-page__summary">
          {selectedSecure && (
            <span className="missions-page__selected missions-page__selected--left">
              SECURE: {selectedSecure.name.substring(0, 20)}… (T{selectedSecure.threat})
            </span>
          )}
          {selectedExtract && (
            <span className="missions-page__selected missions-page__selected--right">
              EXTRACT: {selectedExtract.name.substring(0, 20)}… (T{selectedExtract.threat})
            </span>
          )}
        </div>
      </div>

      <div className="missions-page__body">
        {/* SECURE column */}
        <div className="missions-page__column missions-page__column--secure">
          <div className="missions-page__col-header missions-page__col-header--secure">
            <span className="missions-page__col-title text-accent-left">SECURE</span>
            <span className="missions-page__col-count label-hud">{SECURE_MISSIONS.length} CARDS</span>
            {selectedSecure && (
              <span className="missions-page__col-active label-hud text-accent-left">✓ ACTIVE</span>
            )}
          </div>
          <div className="missions-page__list scroll-area">
            <MissionList missions={SECURE_MISSIONS} type="Secure" />
          </div>
        </div>

        {/* EXTRACT column */}
        <div className="missions-page__column missions-page__column--extract">
          <div className="missions-page__col-header missions-page__col-header--extract">
            <span className="missions-page__col-title text-accent-right">EXTRACT</span>
            <span className="missions-page__col-count label-hud">{EXTRACT_MISSIONS.length} CARDS</span>
            {selectedExtract && (
              <span className="missions-page__col-active label-hud text-accent-right">✓ ACTIVE</span>
            )}
          </div>
          <div className="missions-page__list scroll-area">
            <MissionList missions={EXTRACT_MISSIONS} type="Extract" />
          </div>
        </div>
      </div>
    </div>
  );
}
