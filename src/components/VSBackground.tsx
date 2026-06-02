import { type Theme } from '../store/useMcpStore';
import { getThemeVideoSrc } from './AnimatedThemeBackground';
import './VSBackground.css';

interface VSBackgroundProps {
  themeLeft: Theme | null;
  themeRight: Theme | null;
}

export function VSBackground({ themeLeft, themeRight }: VSBackgroundProps) {
  const leftSrc  = themeLeft  ? getThemeVideoSrc(themeLeft)  : null;
  const rightSrc = themeRight ? getThemeVideoSrc(themeRight) : null;

  return (
    <div className="vs-bg" aria-hidden="true">
      <div className="vs-bg__half vs-bg__half--left">
        {leftSrc ? (
          <video
            key={leftSrc}
            src={leftSrc}
            autoPlay
            loop
            muted
            playsInline
            className="vs-bg__video"
          />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--left" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--left" />
      </div>

      <div className="vs-bg__half vs-bg__half--right">
        {rightSrc ? (
          <video
            key={rightSrc}
            src={rightSrc}
            autoPlay
            loop
            muted
            playsInline
            className="vs-bg__video"
          />
        ) : (
          <div className="vs-bg__fallback vs-bg__fallback--right" />
        )}
        <div className="vs-bg__overlay vs-bg__overlay--right" />
      </div>
    </div>
  );
}
