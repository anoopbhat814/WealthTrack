'use client';
import { useState, type FormEvent } from 'react';
import type { ForecastRequest } from '@wealthtrack/types';

const DEFAULTS: ForecastRequest = {
  initialValue: 250000,
  monthlyContribution: 2000,
  expectedReturn: 0.065,
  volatility: 0.15,
  years: 25,
  goalTarget: 2000000,
};

interface ForecastFormProps {
  busy: boolean;
  onSubmit: (req: ForecastRequest) => void;
}

export function ForecastForm({ busy, onSubmit }: ForecastFormProps) {
  const [values, setValues] = useState(DEFAULTS);
  const set = (key: keyof ForecastRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: Number(e.target.value) }));

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={submit} className="form-grid">
      <label>Starting value<input type="number" value={values.initialValue} onChange={set('initialValue')} /></label>
      <label>Monthly contribution<input type="number" value={values.monthlyContribution} onChange={set('monthlyContribution')} /></label>
      <label>Expected return<input type="number" step="0.005" value={values.expectedReturn} onChange={set('expectedReturn')} /></label>
      <label>Volatility<input type="number" step="0.01" value={values.volatility} onChange={set('volatility')} /></label>
      <label>Years<input type="number" min={1} max={60} value={values.years} onChange={set('years')} /></label>
      <label>Goal<input type="number" value={values.goalTarget ?? 0} onChange={set('goalTarget')} /></label>
      <button type="submit" disabled={busy}>{busy ? 'Running...' : 'Simulate'}</button>
    </form>
  );
}
