import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { listPortfolios } from '@/services/portfolio';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const portfolioId = new URL(req.url).searchParams.get('portfolio');
    const portfolios = await listPortfolios(user.id);
    const selected = portfolioId ? portfolios.filter((p) => p.id === portfolioId) : portfolios;
    return NextResponse.json(selected.flatMap((p) => p.holdings));
  } catch (e) {
    return handleError(e);
  }
}
