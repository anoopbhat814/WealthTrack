import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1', email: 'ada@example.com' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/services/budget', () => ({ listBudgets: vi.fn(async () => [{ id: 'b1', name: 'Household', period: 'MONTHLY', categories: [], totalLimit: 3200, totalSpent: 1840.5 }]) }));

import { GET } from './route';
import { requireUser, UnauthorizedError } from '@/lib/auth';
import { listBudgets } from '@/services/budget';

describe('GET /api/budgets', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the payload for the signed-in user', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'b1', name: 'Household', period: 'MONTHLY', categories: [], totalLimit: 3200, totalSpent: 1840.5 }]);
    expect(listBudgets).toHaveBeenCalledWith('user_1');
  });

  it('responds 401 without a session', async () => {
    vi.mocked(requireUser).mockRejectedValueOnce(new UnauthorizedError());
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
