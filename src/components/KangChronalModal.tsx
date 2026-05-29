import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMcpStore } from '../store/useMcpStore';
import './KangChronalModal.css';

export function KangChronalModal() {
  const {
    leaderLeft, leaderRight,
    selectedSecure, selectedExtract,
    kangLeftPromptAnswered, kangRightPromptAnswered,
    setKangLeftPromptAnswered, setKangLeftTimestreamRound,
    setKangRightPromptAnswered, setKangRightTimestreamRound,
  } = useMcpStore();

  // Which player's prompt is currently showing: 'left' | 'right' | null
  const [activePlayer, setActivePlayer] = useState<'left' | 'right' | null>(null);
  const [step, setStep] = useState<'ask' | 'round'>('ask');

  const bothMissionsSelected = selectedSecure !== null && selectedExtract !== null;
  const leftNeedsPrompt = leaderLeft?.name === 'Kang' && bothMissionsSelected && !kangLeftPromptAnswered;
  const rightNeedsPrompt = leaderRight?.name === 'Kang' && bothMissionsSelected && !kangRightPromptAnswered;

  useEffect(() => {
    if (activePlayer !== null) return;
    if (leftNeedsPrompt) {
      setActivePlayer('left');
      setStep('ask');
    } else if (rightNeedsPrompt) {
      setActivePlayer('right');
      setStep('ask');
    }
  }, [leftNeedsPrompt, rightNeedsPrompt, activePlayer]);

  if (activePlayer === null) return null;

  const isLeft = activePlayer === 'left';
  const playerLabel = isLeft ? 'PLAYER 1' : 'PLAYER 2';
  const accentClass = isLeft ? 'kang-modal--left' : 'kang-modal--right';

  function handleNo() {
    if (isLeft) {
      setKangLeftPromptAnswered(true);
      setKangLeftTimestreamRound(null);
    } else {
      setKangRightPromptAnswered(true);
      setKangRightTimestreamRound(null);
    }
    closeAndCheckNext();
  }

  function handleYes() {
    setStep('round');
  }

  function handleRoundSelect(r: number) {
    if (isLeft) {
      setKangLeftPromptAnswered(true);
      setKangLeftTimestreamRound(r);
    } else {
      setKangRightPromptAnswered(true);
      setKangRightTimestreamRound(r);
    }
    closeAndCheckNext();
  }

  function closeAndCheckNext() {
    const wasLeft = activePlayer === 'left';
    setActivePlayer(null);
    setStep('ask');
    // If the other player also needs the prompt, it'll be picked up by the effect
    // But we need to check after state settles — the effect re-runs automatically
    if (wasLeft && rightNeedsPrompt) {
      setTimeout(() => setActivePlayer('right'), 50);
    }
  }

  return createPortal(
    <div className="kang-modal-overlay" onClick={undefined}>
      <div className={`kang-modal panel clip-panel ${accentClass}`}>
        <div className="kang-modal__badge">
          <span className="kang-modal__kang-label">KANG</span>
          <span className="kang-modal__player-label">{playerLabel}</span>
        </div>

        {step === 'ask' ? (
          <>
            <div className="kang-modal__title">CHRONAL MANIPULATION</div>
            <div className="kang-modal__question">Has Chronal Manipulation been played?</div>
            <div className="kang-modal__actions">
              <button className="btn-hud kang-modal__btn kang-modal__btn--yes" onClick={handleYes}>
                YES
              </button>
              <button className="btn-hud kang-modal__btn kang-modal__btn--no" onClick={handleNo}>
                NO
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="kang-modal__title">TIMESTREAM TOKEN</div>
            <div className="kang-modal__question">Which round receives the Timestream token?</div>
            <div className="kang-modal__rounds">
              {[1, 2, 3, 4, 5, 6].map(r => (
                <button
                  key={r}
                  className={`kang-modal__round-btn ${accentClass}`}
                  onClick={() => handleRoundSelect(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
