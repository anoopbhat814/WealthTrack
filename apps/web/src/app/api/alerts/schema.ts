import { z } from 'zod';

export const alertStatusSchema = z.enum(['ACTIVE', 'TRIGGERED', 'PAUSED', 'EXPIRED']);

export const alertListQuerySchema = z.object({
  status: alertStatusSchema.optional(),
  symbol: z.string().max(12).transform((s) => s.toUpperCase()).optional(),
});

export const updateAlertSchema = z.object({
  status: alertStatusSchema.optional(),
  threshold: z.number().positive().optional(),
});
