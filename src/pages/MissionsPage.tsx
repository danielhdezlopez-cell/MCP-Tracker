import { useMcpStore } from '../store/useMcpStore';
import { EXTRACT_MISSIONS, SECURE_MISSIONS } from '../data/missionsData';
import { MissionList } from '../components/MissionList';
import { AnimatedBackground } from '../components/AnimatedBackground';
import './MissionsPage.css';

export function MissionsPage() {
  const { pendingMissionType, setPendingMissionType, setCurrentPage, selectedSecure, selectedExtract, interactiveBg } = useMcpStore();

  const handleBack = () => {
    setPendingMissionType(null);
    setCurrentPage('main');
  };

  const handleMissionSelected = () => {
    const state = useMcpStore.getState();
    if (state.selectedSecure && state.selectedExtract && state.pendingMissionType) {
      state.setPendingMissionType(null);
      state.setCurrentPage('main');
    }
  };

  return (
    <div className="missions-page">
      <AnimatedBackground mode={interactiveBg} />
      <div className="missions-page__header">
        <span className="label-hud">CRISIS CARDS</span>
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
            <span className="missions-page__col-title missions-page__col-title--secure">SECURE</span>
            {selectedSecure && (
              <span className="missions-page__col-active label-hud missions-page__col-active--secure">
                ✓ SELECTED
              </span>
            )}
          </div>
          <div className="missions-page__list scroll-area">
            <MissionList missions={SECURE_MISSIONS} type="Secure" onSelect={handleMissionSelected} />
          </div>
        </div>

        {/* EXTRACT column */}
        <div className="missions-page__column">
          <div className="missions-page__col-header panel missions-page__col-header--extract">
            <span className="missions-page__col-title missions-page__col-title--extract">EXTRACT</span>
            {selectedExtract && (
              <span className="missions-page__col-active label-hud missions-page__col-active--extract">
                ✓ SELECTED
              </span>
            )}
          </div>
          <div className="missions-page__list scroll-area">
            <MissionList missions={EXTRACT_MISSIONS} type="Extract" onSelect={handleMissionSelected} />
          </div>
        </div>
      </div>
    </div>
  );
}
