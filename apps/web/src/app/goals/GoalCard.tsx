import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, formatPercent } from '@wealthtrack/utils';
import type { GoalView } from '@wealthtrack/types';
import { GoalProjection } from './GoalProjection';

export function GoalCard({ goal }: { goal: GoalView }) {
  return (
    <Card title={goal.name} action={<span className="badge">{goal.kind}</span>}>
      <p>
        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} ({formatPercent(goal.progress, 0)})
      </p>
      <ProgressBar value={goal.progress} />
      <GoalProjection goal={goal} />
    </Card>
  );
}
