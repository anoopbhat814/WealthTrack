import { describe, expect, it } from 'vitest';
import { signPayload, verifySignature } from './verify';

const secret = 'test-secret';
const body = JSON.stringify({ alertId: 'a1', symbol: 'MSFT', price: 431.2 });

describe('verifySignature', () => {
  it('accepts a correctly signed payload', () => {
    expect(verifySignature(body, signPayload(body, secret), secret)).toBe(true);
  });

  it('rejects a tampered payload', () => {
    expect(verifySignature(body + ' ', signPayload(body, secret), secret)).toBe(false);
  });

  it('rejects missing or malformed signatures', () => {
    expect(verifySignature(body, null, secret)).toBe(false);
    expect(verifySignature(body, 'zz', secret)).toBe(false);
  });
});
