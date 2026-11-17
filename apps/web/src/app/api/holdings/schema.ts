import { z } from 'zod';

export const holdingsQuerySchema = z.object({
  portfolio: z.string().cuid().optional(),
  assetClass: z
    .enum(['EQUITY', 'FIXED_INCOME', 'CASH', 'CRYPTO', 'REAL_ESTATE', 'COMMODITY', 'ALTERNATIVE'])
    .optional(),
});
