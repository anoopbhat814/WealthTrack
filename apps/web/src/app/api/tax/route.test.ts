import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(async () => ({ id: 'user_1' })),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));
vi.mock('@/services/tax', () => ({
  buildTaxReport: vi.fn(async (_id: string, year: number) => ({
    year, method: 'FIFO', shortTermGain: 420, longTermGain: 1810.25, dividends: 96.4, rows: [],
  })),
}));

import { GET } from './route';
import { buildTaxReport } from '@/services/tax';

describe('GET /api/tax', () => {
  it('builds the report for the requested year', async () => {
    const res = await GET(new Request('http://localhost/api/tax?year=2023'));
    expect(res.status).toBe(200);
    expect((await res.json()).year).toBe(2023);
    expect(buildTaxReport).toHaveBeenCalledWith('user_1', 2023);
  });

  it('rejects a missing or invalid year', async () => {
    expect((await GET(new Request('http://localhost/api/tax'))).status).toBe(400);
    expect((await GET(new Request('http://localhost/api/tax?year=1850'))).status).toBe(400);
  });
});
