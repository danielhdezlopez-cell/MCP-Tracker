import { useState } from 'react';
import { useMcpStore, type AssignSide } from '../store/useMcpStore';
import { LEADERS, type Leader } from '../data/leadersData';
import { LeaderGrid } from '../components/LeaderGrid';
import { AffiliationFilter } from '../components/AffiliationFilter';
import './LeadersPage.css';

export function LeadersPage() {
  const {
    leaderLeft, leaderRight,
    setLeaderLeft, setLeaderRight,
    pendingLeaderAssign, setPendingLeaderAssign,
    setCurrentPage,
  } = useMcpStore();

  const [assignSide, setAssignSide] = useState<AssignSide>(pendingLeaderAssign ?? 'left');
  const [filterAffil, setFilterAffil] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = LEADERS.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchAffil = filterAffil === null || l.affiliations.includes(filterAffil);
    return matchSearch && matchAffil;
  });

  const handleSelect = (leader: Leader) => {
    if (assignSide === 'left') {
      setLeaderLeft(leader);
    } else {
      setLeaderRight(leader);
    }
    if (pendingLeaderAssign !== null) {
      setPendingLeaderAssign(null);
      setCurrentPage('main');
    }
  };

  return (
    <div className="leaders-page">
      {/* Header */}
      <div className="leaders-page__header">
        <div className="leaders-page__title">
          <span className="label-hud">SELECT LEADER</span>
        </div>

        {/* Assign toggle */}
        <div className="leaders-page__assign-toggle">
          <button
            className={`btn-hud leaders-page__assign-btn ${assignSide === 'left' ? 'active-left' : ''}`}
            onClick={() => setAssignSide('left')}
          >
            <span className="assign-indicator assign-indicator--left">◆</span>
            P1
            {leaderLeft && <span className="assign-current"> — {leaderLeft.name}</span>}
          </button>
          <button
            className={`btn-hud leaders-page__assign-btn ${assignSide === 'right' ? 'active-right' : ''}`}
            onClick={() => setAssignSide('right')}
          >
            <span className="assign-indicator assign-indicator--right">◆</span>
            P2
            {leaderRight && <span className="assign-current"> — {leaderRight.name}</span>}
          </button>
        </div>

        {/* Search */}
        <div className="leaders-page__search-wrap">
          <input
            className="leaders-page__search"
            placeholder="Search leader..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search leaders"
          />
        </div>

        {pendingLeaderAssign && (
          <button
            className="btn-hud leaders-page__back-btn"
            onClick={() => { setPendingLeaderAssign(null); setCurrentPage('main'); }}
          >
            ← BACK
          </button>
        )}
      </div>

      <div className="leaders-page__body">
        {/* Affiliations sidebar */}
        <div className="leaders-page__sidebar panel scroll-area">
          <AffiliationFilter selected={filterAffil} onSelect={setFilterAffil} />
        </div>

        {/* Leader grid */}
        <div className="leaders-page__grid-wrap scroll-area">
          <LeaderGrid
            leaders={filtered}
            selectedLeftId={leaderLeft?.id}
            selectedRightId={leaderRight?.id}
            onSelect={handleSelect}
            assignSide={assignSide}
          />
          {filtered.length === 0 && (
            <div className="leaders-page__empty">
              <span className="text-muted">No leaders found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
