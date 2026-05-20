import { useMcpStore, type AppPage } from '../store/useMcpStore';
import './SideNav.css';

const NAV_ITEMS: { page: AppPage; label: string; icon: string }[] = [
  { page: 'main', label: 'MAIN', icon: '⬡' },
  { page: 'leaders', label: 'LEADERS', icon: '🛡' },
  { page: 'missions', label: 'MISSIONS', icon: '⚡' },
  { page: 'settings', label: 'CONFIG', icon: '⚙' },
];

export function SideNav() {
  const { currentPage, setCurrentPage } = useMcpStore();

  return (
    <nav className="side-nav">
      <div className="side-nav__logo">
        <span className="side-nav__logo-text">MCP</span>
        <span className="side-nav__logo-sub">TRACKER</span>
      </div>
      <div className="side-nav__items">
        {NAV_ITEMS.map(({ page, label, icon }) => (
          <button
            key={page}
            className={`side-nav__item ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
            aria-label={label}
          >
            <span className="side-nav__icon">{icon}</span>
          </button>
        ))}
      </div>
      <div className="side-nav__version">v1.0</div>
    </nav>
  );
}
