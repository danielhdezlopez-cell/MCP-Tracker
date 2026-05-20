import { useEffect, useRef } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { SideNav } from './SideNav';
import { AnimatedThemeBackground } from './AnimatedThemeBackground';
import { MainPage } from '../pages/MainPage';
import { LeadersPage } from '../pages/LeadersPage';
import { MissionsPage } from '../pages/MissionsPage';
import { SettingsPage } from '../pages/SettingsPage';
import './Layout.css';

export function Layout() {
  const { currentPage, theme, brightness } = useMcpStore();
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply brightness to .layout div, not <html>, to avoid iOS Safari
    // compositing issues where filter on the root element creates a new
    // containing block for position:fixed children, causing right-side clipping.
    document.documentElement.style.filter = '';
    if (layoutRef.current) {
      layoutRef.current.style.filter = `brightness(${brightness / 100})`;
    }
  }, [brightness]);

  return (
    <div className="layout" ref={layoutRef}>
      <AnimatedThemeBackground theme={theme} />
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
