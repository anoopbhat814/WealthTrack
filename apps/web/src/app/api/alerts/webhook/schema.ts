import { z } from 'zod';

export const alertWebhookSchema = z.object({
  alertId: z.string().min(1),
  symbol: z.string().min(1).max(12),
  price: z.number(),
  condition: z.enum(['ABOVE', 'BELOW', 'PCT_CHANGE_UP', 'PCT_CHANGE_DOWN']),
  threshold: z.number(),
  firedAt: z.string().datetime(),
});

export type AlertWebhookInput = z.infer<typeof alertWebhookSchema>;
