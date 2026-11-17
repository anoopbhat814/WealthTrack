import { StatTile } from '@/components/ui/StatTile';
import { formatPercent } from '@wealthtrack/utils';
import type { ForecastResult } from '@wealthtrack/types';

export function ForecastSummary({ result }: { result: ForecastResult }) {
  const last = result.bands.at(-1);
  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <StatTile label="Median" value={result.medianFinal} compact />
      {last && <StatTile label="Pessimistic (p5)" value={last.p5} compact />}
      {last && <StatTile label="Optimistic (p95)" value={last.p95} compact />}
      {result.probabilityOfGoal !== null && (
        <div className="stat-tile">
          <span className="stat-tile__label">Goal probability</span>
          <strong className="stat-tile__value">{formatPercent(result.probabilityOfGoal, 1)}</strong>
        </div>
      )}
    </div>
  );
}
