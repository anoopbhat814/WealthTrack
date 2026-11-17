import { beforeEach, describe, expect, it, vi } from 'vitest';

const findMany = vi.fn(async () => [
  { id: 'a1', condition: 'ABOVE', threshold: 210.5, status: 'ACTIVE', triggeredAt: null, security: { symbol: 'AAPL' } },
]);
const findSecurity = vi.fn(async ({ where }: { where: { symbol: string } }) =>
  where.symbol === 'AAPL' ? { id: 'sec_aapl' } : null,
);
const create = vi.fn(async () => ({ id: 'a2' }));

vi.mock('@/lib/db', () => ({
  prisma: {
    priceAlert: { findMany: () => findMany(), create: () => create() },
    security: { findUnique: (a: never) => findSecurity(a) },
  },
}));
vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));

import { GET, POST } from './route';

const post = (body: unknown) => POST(new Request('http://localhost/api/alerts', { method: 'POST', body: JSON.stringify(body) }));

describe('/api/alerts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps alerts to views', async () => {
    const body = await (await GET()).json();
    expect(body[0]).toMatchObject({ id: 'a1', symbol: 'AAPL', threshold: 210.5, triggeredAt: null });
  });

  it('upper-cases the symbol and creates the alert', async () => {
    const res = await post({ symbol: 'aapl', condition: 'BELOW', threshold: 180 });
    expect(res.status).toBe(201);
    expect(create).toHaveBeenCalledOnce();
  });

  it('returns 404 for unknown symbols', async () => {
    const res = await post({ symbol: 'ZZZZ', condition: 'ABOVE', threshold: 5 });
    expect(res.status).toBe(404);
  });
});
