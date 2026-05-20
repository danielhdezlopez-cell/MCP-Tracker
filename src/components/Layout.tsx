import { useEffect } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { SideNav } from './SideNav';
import { MainPage } from '../pages/MainPage';
import { LeadersPage } from '../pages/LeadersPage';
import { MissionsPage } from '../pages/MissionsPage';
import { SettingsPage } from '../pages/SettingsPage';
import './Layout.css';

export function Layout() {
  const { currentPage, theme, brightness } = useMcpStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.filter = `brightness(${brightness / 100})`;
  }, [brightness]);

  return (
    <div className="layout">
      <SideNav />
      <main className="layout__content">
        <div key={currentPage} className="layout__page-anim">
          {currentPage === 'main' && <MainPage />}
          {currentPage === 'leaders' && <LeadersPage />}
          {currentPage === 'missions' && <MissionsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
