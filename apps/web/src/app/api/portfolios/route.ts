import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { createPortfolioSchema } from '@/lib/validation';
import { listPortfolios } from '@/services/portfolio';

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(await listPortfolios(user.id));
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = createPortfolioSchema.parse(await req.json());
    const created = await prisma.portfolio.create({ data: { ...body, userId: user.id } });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
