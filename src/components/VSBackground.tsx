import type { CSSProperties } from 'react';
import { type Theme } from '../store/useMcpStore';
import { getThemeVideoConfig } from '../data/themeVideoMap';
import './VSBackground.css';

interface VSBackgroundProps {
  themeLeft: Theme | null;
  themeRight: Theme | null;
}

function buildVideoStyle(objectPositionY?: string, scale?: number): CSSProperties {
  const style: CSSProperties = {
    objectPosition: `center ${objectPositionY ?? 'top'}`,
  };
  if (scale != null) {
    style.transform = `scale(${scale})`;
    style.transformOrigin = 'center center';
  }
  return style;
}

export function VSBackground({ themeLeft, themeRight }: VSBackgroundProps) {
  const leftConfig  = themeLeft  ? getThemeVideoConfig(themeLeft)  : null;
  const rightConfig = themeRight ? getThemeVideoConfig(themeRight) : null;

  return (
    <div className="vs-bg" aria-hidden="true">
      <div className="vs-bg__half vs-bg__half--left">
        {leftConfig ? (
          <video
            key={leftConfig.src}
            src={leftConfig.src}
            autoPlay
            loop
            muted
            playsInline
            className="vs-bg__video"
            style={buildVideoStyle(leftConfig.objectPositionY, leftConfig.scale)}
          />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--left" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--left" />
      </div>

      <div className="vs-bg__half vs-bg__half--right">
        {rightConfig ? (
          <video
            key={rightConfig.src}
            src={rightConfig.src}
            autoPlay
            loop
            muted
            playsInline
            className="vs-bg__video"
            style={buildVideoStyle(rightConfig.objectPositionY, rightConfig.scale)}
          />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--right" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--right" />
      </div>
    </div>
  );
}
