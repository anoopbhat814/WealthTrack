import { z } from 'zod';

export const createPortfolioSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(400).optional(),
  benchmark: z.string().max(10).default('SPY'),
});

export const createAlertSchema = z.object({
  symbol: z.string().min(1).max(12).transform((s) => s.toUpperCase()),
  condition: z.enum(['ABOVE', 'BELOW', 'PCT_CHANGE_UP', 'PCT_CHANGE_DOWN']),
  threshold: z.number().positive(),
});

export const forecastSchema = z.object({
  initialValue: z.number().nonnegative(),
  monthlyContribution: z.number().nonnegative(),
  expectedReturn: z.number().min(-0.5).max(0.5),
  volatility: z.number().min(0).max(1),
  years: z.number().int().min(1).max(60),
  goalTarget: z.number().positive().optional(),
});

export const taxQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
});
