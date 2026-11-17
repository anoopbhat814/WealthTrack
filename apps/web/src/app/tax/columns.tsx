import type { Column } from '@/components/ui/DataTable';
import { formatCurrency } from '@wealthtrack/utils';
import type { RealizedGainRow } from '@wealthtrack/types';

export const realizedColumns: Column<RealizedGainRow>[] = [
  { key: 'symbol', header: 'Symbol', sortValue: (r) => r.symbol, render: (r) => r.symbol },
  { key: 'acquired', header: 'Acquired', sortValue: (r) => r.acquiredAt, render: (r) => r.acquiredAt.slice(0, 10) },
  { key: 'sold', header: 'Sold', sortValue: (r) => r.soldAt, render: (r) => r.soldAt.slice(0, 10) },
  { key: 'quantity', header: 'Qty', align: 'right', render: (r) => r.quantity.toLocaleString() },
  { key: 'gain', header: 'Gain', align: 'right', sortValue: (r) => r.gain, render: (r) => formatCurrency(r.gain) },
];
