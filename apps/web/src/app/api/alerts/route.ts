import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { createAlertSchema } from '@/lib/validation';
import { toNumber } from '@wealthtrack/utils';
import type { PriceAlertView } from '@wealthtrack/types';

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await prisma.priceAlert.findMany({ where: { userId: user.id }, include: { security: true } });
    const out: PriceAlertView[] = rows.map((a) => ({
      id: a.id,
      symbol: a.security.symbol,
      condition: a.condition,
      threshold: toNumber(a.threshold),
      status: a.status,
      triggeredAt: a.triggeredAt?.toISOString() ?? null,
    }));
    return NextResponse.json(out);
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = createAlertSchema.parse(await req.json());
    const security = await prisma.security.findUnique({ where: { symbol: body.symbol } });
    if (!security) return NextResponse.json({ error: 'unknown symbol' }, { status: 404 });
    const alert = await prisma.priceAlert.create({
      data: { userId: user.id, securityId: security.id, condition: body.condition, threshold: body.threshold },
    });
    return NextResponse.json(alert, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
