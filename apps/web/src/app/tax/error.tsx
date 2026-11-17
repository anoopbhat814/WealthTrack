'use client';
import { useEffect } from 'react';
import { Card } from '@/components/ui/Card';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('tax page failed', error.digest ?? error.message);
  }, [error]);

  return (
    <Card title="Something went wrong" action={<button onClick={reset}>Try again</button>}>
      <p>We could not load your tax report. Please retry in a moment.</p>
    </Card>
  );
}
