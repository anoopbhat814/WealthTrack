import { z } from 'zod';

export const updatePortfolioSchema = z
  .object({
    name: z.string().min(1).max(80),
    description: z.string().max(400).nullable(),
    benchmark: z.string().max(10),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'At least one field is required');

export const portfolioQuerySchema = z.object({
  includeEmpty: z.enum(['true', 'false']).default('true').transform((v) => v === 'true'),
});
