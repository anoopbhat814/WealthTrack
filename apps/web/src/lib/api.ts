import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { UnauthorizedError } from './auth';

export function handleError(err: unknown) {
  if (err instanceof UnauthorizedError) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (err instanceof ZodError) return NextResponse.json({ error: 'invalid', issues: err.issues }, { status: 400 });
  console.error(err);
  return NextResponse.json({ error: 'internal' }, { status: 500 });
}

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
};
