import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMcpStore } from '../store/useMcpStore';
import './KangChronalModal.css';

type Step = 'cards' | 'chronal-round' | 'trust-round';

export function KangChronalModal() {
  const {
    leaderLeft, leaderRight,
    selectedSecure, selectedExtract,
    kangLeftSetupAnswered, kangRightSetupAnswered,
    setKangLeftSetup, setKangRightSetup,
  } = useMcpStore();

  const [activePlayer, setActivePlayer] = useState<'left' | 'right' | null>(null);
  const [step, setStep] = useState<Step>('cards');
  const [chronalSelected, setChronalSelected] = useState(false);
  const [trustSelected, setTrustSelected] = useState(false);
  const [chronalRound, setChronalRound] = useState<number | null>(null);

  const bothMissions = selectedSecure !== null && selectedExtract !== null;
  const leftNeeds = leaderLeft?.name === 'Kang' && bothMissions && !kangLeftSetupAnswered;
  const rightNeeds = leaderRight?.name === 'Kang' && bothMissions && !kangRightSetupAnswered;

  useEffect(() => {
    if (activePlayer !== null) return;
    if (leftNeeds) {
      open('left');
    } else if (rightNeeds) {
      open('right');
    }
  }, [leftNeeds, rightNeeds, activePlayer]);

  function open(player: 'left' | 'right') {
    setActivePlayer(player);
    setStep('cards');
    setChronalSelected(false);
    setTrustSelected(false);
    setChronalRound(null);
  }

  function dismiss(player: 'left' | 'right', chronalPlayed: boolean, chronalRoundVal: number | null, trustPlayed: boolean, trustRoundVal: number | null) {
    const data = { answered: true, chronalPlayed, chronalRound: chronalRoundVal, trustPlayed, trustRound: trustRoundVal };
    if (player === 'left') setKangLeftSetup(data);
    else setKangRightSetup(data);
    setActivePlayer(null);
  }

  if (activePlayer === null) return null;

  const isLeft = activePlayer === 'left';
  const accentClass = isLeft ? 'kang-modal--left' : 'kang-modal--right';
  const playerLabel = isLeft ? 'PLAYER 1' : 'PLAYER 2';

  function handleConfirmCards() {
    if (!chronalSelected && !trustSelected) {
      dismiss(activePlayer!, false, null, false, null);
      return;
    }
    if (chronalSelected) {
      setStep('chronal-round');
    } else {
      setStep('trust-round');
    }
  }

  function handleChronalRound(r: number) {
    const cr = r;
    setChronalRound(cr);
    if (trustSelected) {
      setStep('trust-round');
    } else {
      dismiss(activePlayer!, true, cr, false, null);
    }
  }

  function handleTrustRound(r: number) {
    dismiss(activePlayer!, chronalSelected, chronalRound, true, r);
  }

  function handleSkip() {
    dismiss(activePlayer!, false, null, false, null);
  }

  const roundButtons = (onSelect: (r: number) => void) => (
    <div className="kang-modal__rounds">
      {[1, 2, 3, 4, 5, 6].map(r => (
        <button
          key={r}
          className={`kang-modal__round-btn ${accentClass}`}
          onClick={() => onSelect(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );

  return createPortal(
    <div className="kang-modal-overlay">
      <div className={`kang-modal panel clip-panel ${accentClass}`}>

        {/* Header badge */}
        <div className="kang-modal__header">
          <span className={`kang-modal__kang-chip ${accentClass}`}>KANG</span>
          <span className="kang-modal__player-label">{playerLabel}</span>
        </div>

        <div className="kang-modal__title">KANG TACTICS SETUP</div>

        {/* ── Step 1: card selection ── */}
        {step === 'cards' && (
          <>
            <div className="kang-modal__question">
              Which Kang tactics cards have been played?
            </div>

            <div className="kang-modal__card-list">
              <button
                className={`kang-modal__card-toggle ${accentClass} ${chronalSelected ? 'kang-modal__card-toggle--on' : ''}`}
                onClick={() => setChronalSelected(v => !v)}
              >
                <div className="kang-modal__card-toggle-inner">
                  <span className="kang-modal__card-check">{chronalSelected ? '✓' : '○'}</span>
                  <div className="kang-modal__card-info">
                    <span className="kang-modal__card-name">Chronal Manipulation</span>
                    <span className="kang-modal__card-hint">Place a Timestream token on a round</span>
                  </div>
                  <span className="kang-modal__card-badge kang-modal__card-badge--ts">TS</span>
                </div>
              </button>

              <button
                className={`kang-modal__card-toggle ${accentClass} ${trustSelected ? 'kang-modal__card-toggle--on' : ''}`}
                onClick={() => setTrustSelected(v => !v)}
              >
                <div className="kang-modal__card-toggle-inner">
                  <span className="kang-modal__card-check">{trustSelected ? '✓' : '○'}</span>
                  <div className="kang-modal__card-info">
                    <span className="kang-modal__card-name">Trust No One But Yourself</span>
                    <span className="kang-modal__card-hint">Place a Trust token on a round</span>
                  </div>
                  <span className="kang-modal__card-badge kang-modal__card-badge--tn">TN</span>
                </div>
              </button>
            </div>

            <div className="kang-modal__actions">
              <button className={`btn-hud kang-modal__btn kang-modal__btn--confirm ${accentClass}`} onClick={handleConfirmCards}>
                CONFIRM
              </button>
              <button className="btn-hud kang-modal__btn kang-modal__btn--skip" onClick={handleSkip}>
                SKIP
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Chronal Manipulation round ── */}
        {step === 'chronal-round' && (
          <>
            <div className="kang-modal__step-badge kang-modal__step-badge--ts">
              <span>TS</span> Timestream Token
            </div>
            <div className="kang-modal__question">
              Which round receives the Timestream token?
            </div>
            {roundButtons(handleChronalRound)}
          </>
        )}

        {/* ── Step 3: Trust No One round ── */}
        {step === 'trust-round' && (
          <>
            <div className="kang-modal__step-badge kang-modal__step-badge--tn">
              <span>TN</span> Trust Token
            </div>
            <div className="kang-modal__question">
              Which round receives the Trust token?
            </div>
            {roundButtons(handleTrustRound)}
          </>
        )}

      </div>
    </div>,
    document.body
  );
}
