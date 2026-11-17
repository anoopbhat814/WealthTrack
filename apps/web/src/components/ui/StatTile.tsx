import { formatCurrency, formatPercent } from '@wealthtrack/utils';

interface StatTileProps {
  label: string;
  value: number;
  change?: number;
  compact?: boolean;
}

export function StatTile({ label, value, change, compact }: StatTileProps) {
  const tone = change === undefined ? '' : change >= 0 ? 'positive' : 'negative';
  return (
    <div className="stat-tile">
      <span className="stat-tile__label">{label}</span>
      <strong className="stat-tile__value">{formatCurrency(value, 'USD', compact)}</strong>
      {change !== undefined && <span className={`stat-tile__change ${tone}`}>{formatPercent(change)}</span>}
    </div>
  );
}
