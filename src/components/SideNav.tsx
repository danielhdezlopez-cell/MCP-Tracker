import { useState } from 'react';
import { useMcpStore, type AppPage } from '../store/useMcpStore';
import { NavIconMain, NavIconLeaders, NavIconMissions, NavIconSettings } from './icons';
import './SideNav.css';

type NavItem = { page: AppPage; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> };

const NAV_ITEMS: NavItem[] = [
  { page: 'main',     label: 'MAIN',    Icon: NavIconMain     },
  { page: 'leaders',  label: 'LEADERS', Icon: NavIconLeaders  },
  { page: 'missions', label: 'MISSIONS', Icon: NavIconMissions },
  { page: 'settings', label: 'CONFIG',  Icon: NavIconSettings },
];

export function SideNav() {
  const { currentPage, setCurrentPage, resetGame } = useMcpStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetGame();
    setShowConfirm(false);
  };

  return (
    <>
      <nav className="side-nav">
        <div className="side-nav__logo">
          <span className="side-nav__logo-text">MCP</span>
          <span className="side-nav__logo-sub">TRACKER</span>
        </div>
        <div className="side-nav__items">
          {NAV_ITEMS.map(({ page, label, Icon }) => (
            <button
              key={page}
              className={`side-nav__item ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
              aria-label={label}
            >
              <span className="side-nav__icon">
                <Icon className="side-nav__svg" />
              </span>
              <span className="side-nav__label">{label}</span>
            </button>
          ))}
        </div>

        <div className="side-nav__bottom">
          <button
            className="side-nav__reset-btn"
            onClick={() => setShowConfirm(true)}
            title="Reset Game"
            aria-label="Reset Game"
          >
            <span className="side-nav__icon">
              <svg
                className="side-nav__svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
            </span>
            <span className="side-nav__label">RESET</span>
          </button>
        </div>

        <div className="side-nav__version">v1.0</div>
      </nav>

      {showConfirm && (
        <div className="side-nav__modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="side-nav__modal panel clip-panel" onClick={e => e.stopPropagation()}>
            <div className="side-nav__modal-title">RESET GAME?</div>
            <div className="side-nav__modal-body">
              This will reset all scores, leaders, missions and timer.
            </div>
            <div className="side-nav__modal-actions">
              <button className="btn-hud btn-accent-right" onClick={handleReset}>
                CONFIRM RESET
              </button>
              <button className="btn-hud" onClick={() => setShowConfirm(false)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
