import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/services/networth', () => ({
  getNetWorthSeries: vi.fn(async () => [
    { date: '2024-05-01', assets: 120000, liabilities: 20000, netWorth: 100000 },
    { date: '2024-05-02', assets: 121500, liabilities: 20000, netWorth: 101500 },
  ]),
  getAllocation: vi.fn(async () => [{ assetClass: 'EQUITY', value: 90000, weight: 0.75 }]),
}));

import { GET } from './route';
import { getNetWorthSeries } from '@/services/networth';

describe('GET /api/networth', () => {
  it('returns series and allocation', async () => {
    const res = await GET(new Request('http://localhost/api/networth?days=30'));
    const body = await res.json();
    expect(body.series).toHaveLength(2);
    expect(body.allocation[0].assetClass).toBe('EQUITY');
    expect(getNetWorthSeries).toHaveBeenCalledWith('user_1', 30);
  });

  it('defaults to a year of history', async () => {
    await GET(new Request('http://localhost/api/networth'));
    expect(getNetWorthSeries).toHaveBeenLastCalledWith('user_1', 365);
  });
});
