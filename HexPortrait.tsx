import { AFFILIATIONS } from '../data/leadersData';
import './AffiliationFilter.css';

interface AffiliationFilterProps {
  selected: string | null;
  onSelect: (affiliation: string | null) => void;
}

export function AffiliationFilter({ selected, onSelect }: AffiliationFilterProps) {
  return (
    <div className="affiliation-filter">
      <button
        className={`affil-btn ${selected === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        ALL
      </button>
      {AFFILIATIONS.map(aff => (
        <button
          key={aff}
          className={`affil-btn ${selected === aff ? 'active' : ''}`}
          onClick={() => onSelect(aff)}
        >
          {aff}
        </button>
      ))}
    </div>
  );
}
