import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { getAllocation, getNetWorthSeries } from '@/services/networth';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const days = Number(new URL(req.url).searchParams.get('days') ?? 365);
    const [series, allocation] = await Promise.all([getNetWorthSeries(user.id, days), getAllocation(user.id)]);
    return NextResponse.json({ series, allocation });
  } catch (e) {
    return handleError(e);
  }
}
