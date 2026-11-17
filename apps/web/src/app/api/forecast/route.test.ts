import { beforeEach, describe, expect, it, vi } from 'vitest';

const createRun = vi.fn(async () => ({ id: 'run_1' }));
const result = { bands: [], probabilityOfGoal: 0.62, medianFinal: 1_480_000 };

vi.mock('@/lib/db', () => ({ prisma: { forecastRun: { create: () => createRun() } } }));
vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/lib/forecastClient', () => ({ runForecast: vi.fn(async () => result) }));

import { POST } from './route';

const valid = { initialValue: 100000, monthlyContribution: 1500, expectedReturn: 0.06, volatility: 0.14, years: 20 };
const post = (body: unknown) =>
  POST(new Request('http://localhost/api/forecast', { method: 'POST', body: JSON.stringify(body) }));

describe('POST /api/forecast', () => {
  beforeEach(() => createRun.mockClear());

  it('runs and stores a forecast', async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(result);
    expect(createRun).toHaveBeenCalledOnce();
  });

  it('validates the horizon', async () => {
    const res = await post({ ...valid, years: 120 });
    expect(res.status).toBe(400);
    expect(createRun).not.toHaveBeenCalled();
  });
});
