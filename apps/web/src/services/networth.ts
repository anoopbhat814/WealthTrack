import { prisma } from '@/lib/db';
import { toNumber } from '@wealthtrack/utils';
import type { AllocationSlice, NetWorthPoint } from '@wealthtrack/types';

export async function getNetWorthSeries(userId: string, days = 365): Promise<NetWorthPoint[]> {
  const since = new Date(Date.now() - days * 86_400_000);
  const rows = await prisma.netWorthSnapshot.findMany({
    where: { userId, takenOn: { gte: since } },
    orderBy: { takenOn: 'asc' },
  });
  return rows.map((r) => ({
    date: r.takenOn.toISOString().slice(0, 10),
    assets: toNumber(r.assets),
    liabilities: toNumber(r.liabilities),
    netWorth: toNumber(r.netWorth),
  }));
}

export async function getAllocation(userId: string): Promise<AllocationSlice[]> {
  const holdings = await prisma.holding.findMany({
    where: { portfolio: { userId } },
    include: { security: { include: { quotes: { orderBy: { quotedAt: 'desc' }, take: 1 } } } },
  });
  const totals = new Map<AllocationSlice['assetClass'], number>();
  for (const h of holdings) {
    const price = toNumber(h.security.quotes[0]?.price);
    const value = price * toNumber(h.quantity);
    totals.set(h.security.assetClass, (totals.get(h.security.assetClass) ?? 0) + value);
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  return [...totals.entries()].map(([assetClass, value]) => ({ assetClass, value, weight: value / grand }));
}
