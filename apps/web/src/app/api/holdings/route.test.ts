import { describe, expect, it, vi } from 'vitest';

const holding = (id: string, symbol: string) => ({
  id,
  security: { id: `sec_${symbol}`, symbol, name: symbol, assetClass: 'EQUITY' },
  quantity: 10,
  costBasis: 1000,
  price: 120,
  marketValue: 1200,
  unrealizedGain: 200,
  unrealizedGainPct: 0.2,
  weight: 0.5,
});

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/services/portfolio', () => ({
  listPortfolios: vi.fn(async () => [
    { id: 'pf_a', name: 'A', totalValue: 1200, dayChange: 0, dayChangePct: 0, holdings: [holding('h1', 'VTI')] },
    { id: 'pf_b', name: 'B', totalValue: 1200, dayChange: 0, dayChangePct: 0, holdings: [holding('h2', 'BND')] },
  ]),
}));

import { GET } from './route';

describe('GET /api/holdings', () => {
  it('flattens holdings across portfolios', async () => {
    const res = await GET(new Request('http://localhost/api/holdings'));
    const body = await res.json();
    expect(body.map((h: { id: string }) => h.id)).toEqual(['h1', 'h2']);
  });

  it('filters by portfolio id', async () => {
    const res = await GET(new Request('http://localhost/api/holdings?portfolio=pf_b'));
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].security.symbol).toBe('BND');
  });
});
