'use client';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { usePortfolios } from '@/hooks/useApi';
import { formatCurrency, formatPercent } from '@wealthtrack/utils';
import type { HoldingView } from '@wealthtrack/types';

const columns: Column<HoldingView>[] = [
  { key: 'symbol', header: 'Symbol', render: (h) => h.security.symbol, sortValue: (h) => h.security.symbol },
  { key: 'qty', header: 'Qty', align: 'right', render: (h) => h.quantity.toLocaleString() },
  { key: 'value', header: 'Value', align: 'right', render: (h) => formatCurrency(h.marketValue), sortValue: (h) => h.marketValue },
  { key: 'gain', header: 'Unrealised', align: 'right', sortValue: (h) => h.unrealizedGain,
    render: (h) => <span className={h.unrealizedGain >= 0 ? 'positive' : 'negative'}>{formatCurrency(h.unrealizedGain)} ({formatPercent(h.unrealizedGainPct)})</span> },
  { key: 'weight', header: 'Weight', align: 'right', render: (h) => formatPercent(h.weight, 1), sortValue: (h) => h.weight },
];

export default function PortfoliosPage() {
  const { data } = usePortfolios();
  if (!data) return <p>Loading...</p>;
  return (
    <>
      {data.map((p) => (
        <Card key={p.id} title={`${p.name} - ${formatCurrency(p.totalValue)}`}>
          <DataTable rows={p.holdings} columns={columns} />
        </Card>
      ))}
    </>
  );
}
