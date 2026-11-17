'use client';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGoals } from '@/hooks/useApi';
import { formatCurrency } from '@wealthtrack/utils';

export default function GoalsPage() {
  const { data } = useGoals();
  if (!data) return <p>Loading...</p>;
  return (
    <>
      {data.map((g) => (
        <Card key={g.id} title={g.name} action={<span className={g.onTrack ? 'positive' : 'negative'}>{g.onTrack ? 'On track' : 'Behind'}</span>}>
          <p>{formatCurrency(g.currentAmount)} of {formatCurrency(g.targetAmount)}</p>
          <ProgressBar value={g.progress} warnAt={2} />
          <small>
            Projected: {g.projectedCompletion ? new Date(g.projectedCompletion).toLocaleDateString() : 'not reachable'}
            {' | '}Target: {new Date(g.targetDate).toLocaleDateString()}
          </small>
        </Card>
      ))}
    </>
  );
}
