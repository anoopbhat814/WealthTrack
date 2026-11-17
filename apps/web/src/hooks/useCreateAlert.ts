import { useState } from 'react';
import { mutate } from 'swr';
import type { AlertCondition } from '@wealthtrack/types';

interface NewAlert {
  symbol: string;
  condition: AlertCondition;
  threshold: number;
}

export function useCreateAlert() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function create(input: NewAlert) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      await mutate('/api/alerts');
    } catch (e) {
      setError(e as Error);
    } finally {
      setPending(false);
    }
  }

  return { create, pending, error };
}
