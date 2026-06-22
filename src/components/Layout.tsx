import { useEffect, useRef } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { PageBar } from './PageBar';
import { SharedPageBackground } from './SharedPageBackground';
import { MainPage } from '../pages/MainPage';
import { LeadersPage } from '../pages/LeadersPage';
import { MissionsPage } from '../pages/MissionsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LeaderImagesReviewPage } from '../pages/LeaderImagesReviewPage';
import './Layout.css';

export function Layout() {
  // Per-field selectors: subscribing to the whole store re-rendered the
  // entire app on every store write. With these, Layout only re-renders
  // when one of these three values actually changes.
  const currentPage = useMcpStore(s => s.currentPage);
  const theme       = useMcpStore(s => s.theme);
  const brightness  = useMcpStore(s => s.brightness);
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
      {/* VS overlay handles its own split backgrounds on the main page */}
      {currentPage !== 'main' && <SharedPageBackground />}
      {currentPage !== 'main' && <PageBar />}
      <main className="layout__content">
        <div key={currentPage} className="layout__page-anim">
          {currentPage === 'main' && <MainPage />}
          {currentPage === 'leaders' && <LeadersPage />}
          {currentPage === 'missions' && <MissionsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'image-review' && <LeaderImagesReviewPage />}
        </div>
      </main>
    </div>
  );
}
