'use client';
import { Card } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { NetWorthChart } from '@/components/charts/NetWorthChart';
import { AllocationDonut } from '@/components/charts/AllocationDonut';
import { useNetWorth, usePortfolios } from '@/hooks/useApi';

export default function DashboardPage() {
  const { data: nw } = useNetWorth(365);
  const { data: portfolios } = usePortfolios();

  if (!nw || !portfolios) return <p>Loading your wealth...</p>;

  const latest = nw.series.at(-1);
  const first = nw.series[0];
  const yearChange = latest && first && first.netWorth ? (latest.netWorth - first.netWorth) / first.netWorth : 0;
  const dayChange = portfolios.reduce((a, p) => a + p.dayChange, 0);

  return (
    <>
      <div className="grid-2">
        <Card title="Net worth">
          <StatTile label="Total" value={latest?.netWorth ?? 0} change={yearChange} />
          <NetWorthChart data={nw.series} />
        </Card>
        <Card title="Allocation">
          <AllocationDonut slices={nw.allocation} />
        </Card>
      </div>
      <Card title="Today">
        <StatTile label="Portfolio day change" value={dayChange} />
      </Card>
    </>
  );
}
