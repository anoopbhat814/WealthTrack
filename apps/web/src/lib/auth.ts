import { headers } from 'next/headers';
import { prisma } from './db';

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

/** Resolve the current user from the session header injected by the auth proxy. */
export async function requireUser() {
  const email = headers().get('x-wt-user-email');
  if (!email) throw new UnauthorizedError();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError();
  return user;
}
