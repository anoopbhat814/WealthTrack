'use client';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatCurrency, formatPercent } from '@wealthtrack/utils';
import type { HoldingView } from '@wealthtrack/types';

const columns: Column<HoldingView>[] = [
  { key: 'symbol', header: 'Symbol', sortValue: (h) => h.security.symbol, render: (h) => h.security.symbol },
  { key: 'name', header: 'Name', render: (h) => h.security.name },
  { key: 'qty', header: 'Quantity', align: 'right', render: (h) => h.quantity.toLocaleString() },
  { key: 'value', header: 'Market value', align: 'right', sortValue: (h) => h.marketValue, render: (h) => formatCurrency(h.marketValue) },
  { key: 'gain', header: 'Unrealised', align: 'right', sortValue: (h) => h.unrealizedGainPct, render: (h) => formatPercent(h.unrealizedGainPct) },
  { key: 'weight', header: 'Weight', align: 'right', sortValue: (h) => h.weight, render: (h) => formatPercent(h.weight, 1) },
];

export function HoldingsTable({ holdings }: { holdings: HoldingView[] }) {
  return <DataTable rows={holdings} columns={columns} />;
}
