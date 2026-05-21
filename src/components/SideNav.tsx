import { useMcpStore, type AppPage } from '../store/useMcpStore';
import { NavIconMain, NavIconLeaders, NavIconMissions } from './icons';
import './SideNav.css';

type NavItem = { page: AppPage; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> };

const NAV_ITEMS: NavItem[] = [
  { page: 'main',     label: 'MAIN',    Icon: NavIconMain     },
  { page: 'leaders',  label: 'LEADERS', Icon: NavIconLeaders  },
  { page: 'missions', label: 'MISSIONS', Icon: NavIconMissions },
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
      <div className="side-nav__version">v1.0</div>
    </nav>
  );
}
