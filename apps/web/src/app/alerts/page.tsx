'use client';
import { useState, type FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { useAlerts } from '@/hooks/useApi';

export default function AlertsPage() {
  const { data, mutate } = useAlerts();
  const [symbol, setSymbol] = useState('');
  const [threshold, setThreshold] = useState('');
  const [condition, setCondition] = useState('ABOVE');

  async function create(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ symbol, condition, threshold: Number(threshold) }),
    });
    setSymbol('');
    setThreshold('');
    mutate();
  }

  return (
    <>
      <Card title="New alert">
        <form onSubmit={create} style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="ABOVE">Price above</option>
            <option value="BELOW">Price below</option>
            <option value="PCT_CHANGE_UP">Rises by %</option>
            <option value="PCT_CHANGE_DOWN">Falls by %</option>
          </select>
          <input type="number" step="0.01" placeholder="Threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} required />
          <button type="submit">Create</button>
        </form>
      </Card>
      <Card title="Active alerts">
        <ul>
          {data?.map((a) => (
            <li key={a.id}>{a.symbol} {a.condition} {a.threshold} - {a.status}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}
