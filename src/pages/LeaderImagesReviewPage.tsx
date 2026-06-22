import { useState } from 'react';
import { useMcpStore } from '../store/useMcpStore';
import { LEADERS, getAffilDisplay } from '../data/leadersData';
import { LEADER_BACKGROUNDS } from '../data/leaderBackgroundsMap';
import { AFFILIATION_ICONS } from '../data/affiliationsFx';
import { AnimatedBackground } from '../components/AnimatedBackground';
import './LeaderImagesReviewPage.css';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE ?? 'https://danielhdezlopez-cell.github.io/MCP-Tracker/';
const BG_BASE = `${ASSETS_BASE}backgrounds/`;

function ImageTile({ src, label, filePath }: { src: string; label: string; filePath: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="lir-tile">
      <div className="lir-tile__img-wrap">
        {broken ? (
          <div className="lir-tile__broken">
            <span className="lir-tile__broken-text">IMAGE NOT FOUND</span>
            <span className="lir-tile__broken-path">{filePath}</span>
          </div>
        ) : (
          <img
            src={src}
            alt={label}
            className="lir-tile__img"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <div className="lir-tile__label">{label}</div>
      <div className="lir-tile__path">{filePath}</div>
    </div>
  );
}

export function LeaderImagesReviewPage() {
  const setCurrentPage = useMcpStore(s => s.setCurrentPage);
  const interactiveBg = useMcpStore(s => s.interactiveBg);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="lir-page scroll-area">
      <AnimatedBackground mode={interactiveBg} />
      <div className="lir-page__inner">
        <div className="lir-header">
          <button className="btn-hud lir-back-btn" onClick={() => setCurrentPage('settings')}>
            ← BACK TO CONFIG
          </button>
          <h1 className="lir-title">LEADER IMAGES REVIEW</h1>
          <span className="lir-subtitle">{LEADERS.length} leaders · debug view · no game logic affected</span>
        </div>

        <div className="lir-grid">
          {LEADERS.map(leader => {
            const affilKey = leader.affiliations[0] ?? '';
            const affilIcon = AFFILIATION_ICONS[affilKey] ?? null;
            const backgrounds = LEADER_BACKGROUNDS[leader.id] ?? [];
            const isExpanded = expandedId === leader.id;

            return (
              <div key={leader.id} className={`lir-card ${isExpanded ? 'lir-card--expanded' : ''}`}>
                <div className="lir-card__header" onClick={() => setExpandedId(isExpanded ? null : leader.id)}>
                  <span className="lir-card__name">{leader.name}</span>
                  {affilKey && (
                    <span className="lir-card__affil">{getAffilDisplay(affilKey)}</span>
                  )}
                  <span className="lir-card__toggle">{isExpanded ? '▲' : '▼'}</span>
                </div>

                <div className="lir-card__images">
                  {/* Portrait */}
                  <div className="lir-section-label">PORTRAIT</div>
                  {leader.image ? (
                    <ImageTile
                      src={leader.image}
                      label="Portrait"
                      filePath={leader.image.replace(ASSETS_BASE, '')}
                    />
                  ) : (
                    <div className="lir-tile lir-tile--null">
                      <div className="lir-tile__broken">
                        <span className="lir-tile__broken-text">NO IMAGE ASSIGNED</span>
                      </div>
                      <div className="lir-tile__label">Portrait</div>
                    </div>
                  )}

                  {/* Affiliation icon */}
                  {affilIcon && (
                    <>
                      <div className="lir-section-label">AFFILIATION ICON</div>
                      <ImageTile
                        src={affilIcon}
                        label={getAffilDisplay(affilKey)}
                        filePath={affilIcon.replace(/^.*\/icons\//, 'icons/')}
                      />
                    </>
                  )}

                  {/* Backgrounds — only show when expanded */}
                  {isExpanded && backgrounds.length > 0 && (
                    <>
                      <div className="lir-section-label">BACKGROUNDS ({backgrounds.length})</div>
                      <div className="lir-bg-row">
                        {backgrounds.map(file => (
                          <ImageTile
                            key={file}
                            src={`${BG_BASE}${file}`}
                            label={file}
                            filePath={`backgrounds/${file}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {!isExpanded && backgrounds.length > 0 && (
                    <div className="lir-bg-hint">
                      +{backgrounds.length} background{backgrounds.length > 1 ? 's' : ''} — click to expand
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
