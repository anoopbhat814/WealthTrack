import { z } from 'zod';

export const networthQuerySchema = z.object({
  days: z.coerce.number().int().min(7).max(3650).default(365),
});
