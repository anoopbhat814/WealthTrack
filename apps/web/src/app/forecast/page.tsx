'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ForecastFan } from '@/components/charts/ForecastFan';
import { formatCurrency, formatPercent } from '@wealthtrack/utils';
import type { ForecastResult } from '@wealthtrack/types';

export default function ForecastPage() {
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const res = await fetch('/api/forecast', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ initialValue: 250000, monthlyContribution: 2000, expectedReturn: 0.065, volatility: 0.15, years: 25, goalTarget: 2000000 }),
    });
    setResult(await res.json());
    setBusy(false);
  }

  return (
    <Card title="Monte Carlo projection" action={<button onClick={run} disabled={busy}>{busy ? 'Running...' : 'Run'}</button>}>
      {result ? (
        <>
          <p>Median outcome {formatCurrency(result.medianFinal)}. Goal probability {result.probabilityOfGoal === null ? 'n/a' : formatPercent(result.probabilityOfGoal, 1)}.</p>
          <ForecastFan bands={result.bands} />
        </>
      ) : (
        <p>Press Run to simulate 5,000 market paths.</p>
      )}
    </Card>
  );
}
