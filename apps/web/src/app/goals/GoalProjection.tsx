import { formatCurrency } from '@wealthtrack/utils';
import type { GoalView } from '@wealthtrack/types';

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

export function GoalProjection({ goal }: { goal: GoalView }) {
  if (!goal.projectedCompletion) {
    return <p className="muted">At the current pace this goal will not be reached within 100 years.</p>;
  }
  return (
    <p className={goal.onTrack ? 'positive' : 'negative'}>
      {goal.onTrack ? 'On track' : 'Behind'}: projected {monthYear.format(new Date(goal.projectedCompletion))}
      {' '}vs target {monthYear.format(new Date(goal.targetDate))}
      {goal.monthlyContribution > 0 && ` at ${formatCurrency(goal.monthlyContribution)}/mo`}
    </p>
  );
}
