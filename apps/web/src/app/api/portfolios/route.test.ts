import { beforeEach, describe, expect, it, vi } from 'vitest';

const create = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 'pf_1', ...data }));

vi.mock('@/lib/db', () => ({ prisma: { portfolio: { create: (args: never) => create(args) } } }));
vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1', email: 'ada@example.com' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/services/portfolio', () => ({ listPortfolios: vi.fn(async () => []) }));

import { GET, POST } from './route';

describe('/api/portfolios', () => {
  beforeEach(() => create.mockClear());

  it('lists portfolios', async () => {
    const res = await GET();
    expect(await res.json()).toEqual([]);
  });

  it('creates a portfolio with the default benchmark', async () => {
    const res = await POST(
      new Request('http://localhost/api/portfolios', { method: 'POST', body: JSON.stringify({ name: 'Long term' }) }),
    );
    expect(res.status).toBe(201);
    expect(create).toHaveBeenCalledWith({ data: { name: 'Long term', benchmark: 'SPY', userId: 'user_1' } });
  });

  it('rejects an empty name', async () => {
    const res = await POST(
      new Request('http://localhost/api/portfolios', { method: 'POST', body: JSON.stringify({ name: '' }) }),
    );
    expect(res.status).toBe(400);
  });
});
