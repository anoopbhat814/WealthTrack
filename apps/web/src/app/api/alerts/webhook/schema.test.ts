import { describe, expect, it } from 'vitest';
import { alertWebhookSchema } from './schema';

describe('alertWebhookSchema', () => {
  it('parses the payload emitted by the alert daemon', () => {
    const parsed = alertWebhookSchema.parse({
      alertId: 'ckx1', symbol: 'NVDA', price: 902.5, condition: 'ABOVE', threshold: 900, firedAt: '2024-06-03T14:31:00Z',
    });
    expect(parsed.symbol).toBe('NVDA');
  });

  it('rejects unknown conditions', () => {
    const result = alertWebhookSchema.safeParse({
      alertId: 'x', symbol: 'A', price: 1, condition: 'SIDEWAYS', threshold: 1, firedAt: '2024-06-03T14:31:00Z',
    });
    expect(result.success).toBe(false);
  });
});
