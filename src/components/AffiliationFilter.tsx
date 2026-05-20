import { AFFILIATIONS, getAffilDisplay } from '../data/leadersData';
import './AffiliationFilter.css';

interface AffiliationFilterProps {
  selected: string | null;
  onSelect: (affiliation: string | null) => void;
}

function labelSizeClass(label: string): string {
  if (label.length >= 22) return 'affil-btn--xlong';
  if (label.length >= 14) return 'affil-btn--long';
  return '';
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
      {AFFILIATIONS.map(aff => {
        const label = getAffilDisplay(aff);
        return (
          <button
            key={aff}
            className={`affil-btn ${selected === aff ? 'active' : ''} ${labelSizeClass(label)}`}
            onClick={() => onSelect(aff)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
