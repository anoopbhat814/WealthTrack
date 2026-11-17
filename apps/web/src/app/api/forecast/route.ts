import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { forecastSchema } from '@/lib/validation';
import { runForecast } from '@/lib/forecastClient';

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const params = forecastSchema.parse(await req.json());
    const result = await runForecast(params);
    await prisma.forecastRun.create({ data: { userId: user.id, params, result: result as object } });
    return NextResponse.json(result);
  } catch (e) {
    return handleError(e);
  }
}
