import { StatTile } from '@/components/ui/StatTile';
import type { BudgetView } from '@wealthtrack/types';

export function BudgetSummary({ budget }: { budget: BudgetView }) {
  const remaining = budget.totalLimit - budget.totalSpent;
  const usage = budget.totalLimit ? budget.totalSpent / budget.totalLimit : 0;
  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <StatTile label="Spent" value={budget.totalSpent} />
      <StatTile label="Remaining" value={remaining} change={remaining >= 0 ? undefined : -usage} />
      <StatTile label="Limit" value={budget.totalLimit} />
    </div>
  );
}
