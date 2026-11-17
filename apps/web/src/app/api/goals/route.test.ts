import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1', email: 'ada@example.com' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/services/goals', () => ({ listGoals: vi.fn(async () => [{ id: 'g1', kind: 'HOME', name: 'House deposit', targetAmount: 90000, currentAmount: 31000, monthlyContribution: 1200, targetDate: '2028-06-01T00:00:00.000Z', progress: 0.34, projectedCompletion: '2028-03-01T00:00:00.000Z', onTrack: true }]) }));

import { GET } from './route';
import { requireUser, UnauthorizedError } from '@/lib/auth';
import { listGoals } from '@/services/goals';

describe('GET /api/goals', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the payload for the signed-in user', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 'g1', kind: 'HOME', name: 'House deposit', targetAmount: 90000, currentAmount: 31000, monthlyContribution: 1200, targetDate: '2028-06-01T00:00:00.000Z', progress: 0.34, projectedCompletion: '2028-03-01T00:00:00.000Z', onTrack: true }]);
    expect(listGoals).toHaveBeenCalledWith('user_1');
  });

  it('responds 401 without a session', async () => {
    vi.mocked(requireUser).mockRejectedValueOnce(new UnauthorizedError());
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
