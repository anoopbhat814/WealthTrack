import { prisma } from '@/lib/db';
import { isLongTerm, toNumber } from '@wealthtrack/utils';
import type { RealizedGainRow, TaxReport } from '@wealthtrack/types';
import { consumeLots } from './taxlots';

export async function buildTaxReport(userId: string, year: number): Promise<TaxReport> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const sells = await prisma.transaction.findMany({
    where: {
      type: 'SELL',
      account: { userId },
      occurredAt: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) },
    },
    include: { holding: { include: { security: true, lots: true } } },
    orderBy: { occurredAt: 'asc' },
  });

  const rows: RealizedGainRow[] = [];
  for (const tx of sells) {
    if (!tx.holding || !tx.quantity || !tx.price) continue;
    const lots = tx.holding.lots.map((l) => ({
      id: l.id,
      acquiredAt: l.acquiredAt,
      remaining: toNumber(l.quantity),
      unitCost: toNumber(l.unitCost),
    }));
    const price = toNumber(tx.price);
    for (const c of consumeLots(lots, toNumber(tx.quantity), user.costBasis)) {
      rows.push({
        symbol: tx.holding.security.symbol,
        soldAt: tx.occurredAt.toISOString(),
        acquiredAt: c.acquiredAt.toISOString(),
        quantity: c.quantity,
        proceeds: c.quantity * price,
        costBasis: c.quantity * c.unitCost,
        gain: c.quantity * (price - c.unitCost),
        term: isLongTerm(c.acquiredAt, tx.occurredAt) ? 'LONG' : 'SHORT',
      });
    }
  }

  const dividends = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: 'DIVIDEND', account: { userId }, occurredAt: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) } },
  });

  const byTerm = (t: 'SHORT' | 'LONG') => rows.filter((r) => r.term === t).reduce((a, r) => a + r.gain, 0);
  return {
    year,
    method: user.costBasis,
    shortTermGain: byTerm('SHORT'),
    longTermGain: byTerm('LONG'),
    dividends: toNumber(dividends._sum.amount),
    rows,
  };
}
