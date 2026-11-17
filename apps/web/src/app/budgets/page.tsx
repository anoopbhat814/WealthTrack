'use client';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useBudgets } from '@/hooks/useApi';
import { formatCurrency } from '@wealthtrack/utils';

export default function BudgetsPage() {
  const { data } = useBudgets();
  if (!data) return <p>Loading...</p>;
  return (
    <>
      {data.map((b) => (
        <Card key={b.id} title={`${b.name} (${b.period.toLowerCase()})`}>
          <p>{formatCurrency(b.totalSpent)} of {formatCurrency(b.totalLimit)} spent</p>
          {b.categories.map((c) => (
            <div key={c.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span>
                <span>{formatCurrency(c.spent)} / {formatCurrency(c.limit)}</span>
              </div>
              <ProgressBar value={c.limit ? c.spent / c.limit : 0} />
            </div>
          ))}
        </Card>
      ))}
    </>
  );
}
