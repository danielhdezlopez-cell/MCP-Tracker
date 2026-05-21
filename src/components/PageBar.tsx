import { useMcpStore, type AppPage } from '../store/useMcpStore';
import { NavIconMain, NavIconLeaders, NavIconMissions, NavIconSettings } from './icons';
import { McpLogo } from './McpLogo';
import './PageBar.css';

const NAV: { page: AppPage; Icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
  { page: 'main',     Icon: NavIconMain,     label: 'MAIN'    },
  { page: 'leaders',  Icon: NavIconLeaders,  label: 'LEADERS' },
  { page: 'missions', Icon: NavIconMissions, label: 'MISSIONS'},
  { page: 'settings', Icon: NavIconSettings, label: 'CONFIG'  },
];

export function PageBar() {
  const { currentPage, setCurrentPage } = useMcpStore();

  return (
    <div className="page-bar">
      <div className="page-bar__nav">
        {NAV.map(({ page, Icon, label }) => (
          <button
            key={page}
            className={`page-bar__btn${currentPage === page ? ' active' : ''}`}
            onClick={() => setCurrentPage(page)}
            aria-label={label}
            title={label}
          >
            <Icon className="page-bar__icon" />
          </button>
        ))}
      </div>
      <McpLogo />
    </div>
  );
}
