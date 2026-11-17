import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { handleError } from '@/lib/api';
import { listGoals } from '@/services/goals';

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(await listGoals(user.id));
  } catch (e) {
    return handleError(e);
  }
}
