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
      <div className="missions-page__header">
        <span className="label-hud">MISSION CARDS</span>
        {pendingMissionType && (
          <button className="btn-hud missions-page__back-btn" onClick={handleBack}>
            ← BACK TO MAIN
          </button>
        )}
        <div className="missions-page__summary">
          {selectedSecure && (
            <span className="missions-page__selected missions-page__selected--left">
              SECURE: {selectedSecure.threat}
            </span>
          )}
          {selectedExtract && (
            <span className="missions-page__selected missions-page__selected--right">
              EXTRACT: {selectedExtract.threat}
            </span>
          )}
        </div>
      </div>

      <div className="missions-page__body">
        {/* SECURE column */}
        <div className="missions-page__column">
          <div className="missions-page__col-header panel missions-page__col-header--secure">
            <span className="missions-page__col-title text-accent-left">SECURE</span>
            <span className="missions-page__col-count label-hud">{SECURE_MISSIONS.length} CARDS</span>
            {selectedSecure && (
              <span className="missions-page__col-active label-hud text-accent-left">
                ✓ SELECTED
              </span>
            )}
          </div>
          <div className="missions-page__list scroll-area">
            <MissionList missions={SECURE_MISSIONS} type="Secure" />
          </div>
        </div>

        {/* EXTRACT column */}
        <div className="missions-page__column">
          <div className="missions-page__col-header panel missions-page__col-header--extract">
            <span className="missions-page__col-title text-accent-right">EXTRACT</span>
            <span className="missions-page__col-count label-hud">{EXTRACT_MISSIONS.length} CARDS</span>
            {selectedExtract && (
              <span className="missions-page__col-active label-hud text-accent-right">
                ✓ SELECTED
              </span>
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
