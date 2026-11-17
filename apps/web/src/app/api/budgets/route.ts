import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { listBudgets } from '@/services/budget';

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(await listBudgets(user.id));
  } catch (e) {
    return handleError(e);
  }
}
