import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { taxQuerySchema } from '@/lib/validation';
import { buildTaxReport } from '@/services/tax';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { year } = taxQuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams));
    return NextResponse.json(await buildTaxReport(user.id, year));
  } catch (e) {
    return handleError(e);
  }
}
