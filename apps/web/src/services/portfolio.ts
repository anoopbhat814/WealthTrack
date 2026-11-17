import { prisma } from '@/lib/db';
import { toNumber, simpleReturn } from '@wealthtrack/utils';
import type { HoldingView, PortfolioSummary } from '@wealthtrack/types';

export async function listPortfolios(userId: string): Promise<PortfolioSummary[]> {
  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
    include: {
      holdings: {
        include: {
          lots: true,
          security: { include: { quotes: { orderBy: { quotedAt: 'desc' }, take: 2 } } },
        },
      },
    },
  });

  return portfolios.map((p) => {
    let dayChange = 0;
    const views = p.holdings.map((h): HoldingView => {
      const [latest, prev] = h.security.quotes;
      const price = toNumber(latest?.price);
      const qty = toNumber(h.quantity);
      const cost = h.lots.reduce((a, l) => a + toNumber(l.remaining) * toNumber(l.unitCost), 0);
      dayChange += (price - toNumber(prev?.price ?? latest?.price)) * qty;
      return {
        id: h.id,
        security: { ...h.security, sector: h.security.sector },
        quantity: qty,
        costBasis: cost,
        price,
        marketValue: price * qty,
        unrealizedGain: price * qty - cost,
        unrealizedGainPct: simpleReturn(cost, price * qty),
        weight: 0,
      };
    });
    const total = views.reduce((a, v) => a + v.marketValue, 0);
    views.forEach((v) => (v.weight = total ? v.marketValue / total : 0));
    return {
      id: p.id,
      name: p.name,
      totalValue: total,
      dayChange,
      dayChangePct: total ? dayChange / (total - dayChange) : 0,
      holdings: views,
    };
  });
}
