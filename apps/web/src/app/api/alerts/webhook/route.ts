import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { AlertWebhookPayload } from '@wealthtrack/types';

/** Called by the Go alert daemon when a rule fires. */
export async function POST(req: Request) {
  const payload = (await req.json()) as AlertWebhookPayload;
  await prisma.priceAlert.update({
    where: { id: payload.alertId },
    data: { status: 'TRIGGERED', triggeredAt: new Date(payload.firedAt) },
  });
  return NextResponse.json({ ok: true });
}
