import { prisma } from '@/lib/db';
import { startOfMonth, toNumber } from '@wealthtrack/utils';
import type { BudgetView } from '@wealthtrack/types';

export async function listBudgets(userId: string): Promise<BudgetView[]> {
  const from = startOfMonth(new Date());
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { categories: { include: { transactions: { where: { occurredAt: { gte: from } } } } } },
  });
  return budgets.map((b) => {
    const categories = b.categories.map((c) => {
      const spent = c.transactions.reduce((a, t) => a + Math.abs(toNumber(t.amount)), 0);
      const limit = toNumber(c.limit);
      return { id: c.id, name: c.name, limit, spent, remaining: limit - spent, rollover: c.rollover };
    });
    return {
      id: b.id,
      name: b.name,
      period: b.period,
      categories,
      totalLimit: categories.reduce((a, c) => a + c.limit, 0),
      totalSpent: categories.reduce((a, c) => a + c.spent, 0),
    };
  });
}
