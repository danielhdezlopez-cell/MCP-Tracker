import type { ReactElement } from 'react';
import { useMcpStore, type AppPage } from '../store/useMcpStore';
import './SideNav.css';

const NAV_ITEMS: { page: AppPage; label: string; icon: ReactElement }[] = [
  {
    page: 'main',
    label: 'MAIN',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    page: 'leaders',
    label: 'LEADERS',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="9" cy="7" r="3"/>
        <circle cx="15" cy="7" r="3"/>
        <path d="M3 21v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2"/>
      </svg>
    ),
  },
  {
    page: 'missions',
    label: 'MISSIONS',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="3" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="21"/>
        <line x1="3" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="21" y2="12"/>
      </svg>
    ),
  },
  {
    page: 'settings',
    label: 'CONFIG',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
  },
];

export function SideNav() {
  const { currentPage, setCurrentPage } = useMcpStore();

  return (
    <nav className="side-nav">
      <div className="side-nav__items">
        {NAV_ITEMS.map(({ page, label, icon }) => (
          <button
            key={page}
            className={`side-nav__item ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
            aria-label={label}
          >
            <span className="side-nav__icon">{icon}</span>
            <span className="side-nav__label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
