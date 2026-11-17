import { StatTile } from '@/components/ui/StatTile';
import type { NetWorthPoint } from '@wealthtrack/types';

export function NetWorthSummary({ series }: { series: NetWorthPoint[] }) {
  const latest = series.at(-1);
  if (!latest) return <p>No snapshots yet. The first one is taken at 02:00 UTC.</p>;
  const first = series[0]!;
  const change = first.netWorth ? (latest.netWorth - first.netWorth) / first.netWorth : 0;
  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <StatTile label="Net worth" value={latest.netWorth} change={change} />
      <StatTile label="Assets" value={latest.assets} compact />
      <StatTile label="Liabilities" value={latest.liabilities} compact />
    </div>
  );
}
