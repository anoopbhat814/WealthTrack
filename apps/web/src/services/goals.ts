import { prisma } from '@/lib/db';
import { addMonths, toNumber } from '@wealthtrack/utils';
import type { GoalView } from '@wealthtrack/types';

/** Months needed to reach target using future-value-of-annuity iteration. */
export function monthsToTarget(current: number, monthly: number, annualReturn: number, target: number): number | null {
  const r = annualReturn / 12;
  let value = current;
  for (let m = 0; m <= 1200; m++) {
    if (value >= target) return m;
    value = value * (1 + r) + monthly;
  }
  return null;
}

export async function listGoals(userId: string): Promise<GoalView[]> {
  const goals = await prisma.goal.findMany({ where: { userId }, orderBy: { targetDate: 'asc' } });
  const now = new Date();
  return goals.map((g) => {
    const target = toNumber(g.targetAmount);
    const current = toNumber(g.currentAmount);
    const months = monthsToTarget(current, toNumber(g.monthlyContribution), toNumber(g.expectedReturn), target);
    const projected = months === null ? null : addMonths(now, months);
    return {
      id: g.id,
      kind: g.kind,
      name: g.name,
      targetAmount: target,
      currentAmount: current,
      monthlyContribution: toNumber(g.monthlyContribution),
      targetDate: g.targetDate.toISOString(),
      progress: Math.min(1, current / target),
      projectedCompletion: projected?.toISOString() ?? null,
      onTrack: projected !== null && projected <= g.targetDate,
    };
  });
}
