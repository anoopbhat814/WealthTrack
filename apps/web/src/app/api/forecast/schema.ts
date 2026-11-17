import { z } from 'zod';

export const optimizeSchema = z.object({
  symbols: z.array(z.string().min(1).max(12)).min(2).max(50),
  riskFree: z.number().min(0).max(0.2).default(0.04),
  maxWeight: z.number().gt(0).max(1).default(0.4),
});

export type OptimizeInput = z.infer<typeof optimizeSchema>;
