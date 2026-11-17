'use client';
import { useState, type FormEvent } from 'react';
import type { AlertCondition } from '@wealthtrack/types';

export const CONDITION_LABELS: Record<AlertCondition, string> = {
  ABOVE: 'Price above',
  BELOW: 'Price below',
  PCT_CHANGE_UP: 'Rises by %',
  PCT_CHANGE_DOWN: 'Falls by %',
};

interface AlertFormProps {
  onCreated: () => void;
}

export function AlertForm({ onCreated }: AlertFormProps) {
  const [symbol, setSymbol] = useState('');
  const [threshold, setThreshold] = useState('');
  const [condition, setCondition] = useState<AlertCondition>('ABOVE');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ symbol, condition, threshold: Number(threshold) }),
    });
    if (!res.ok) {
      setError('Could not create alert');
      return;
    }
    setSymbol('');
    setThreshold('');
    onCreated();
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
      <input placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
      <select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)}>
        {Object.entries(CONDITION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <input type="number" step="0.01" placeholder="Threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} required />
      <button type="submit">Create</button>
      {error && <span className="form-error">{error}</span>}
    </form>
  );
}
