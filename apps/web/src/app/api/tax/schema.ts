import { z } from 'zod';

export const taxExportSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  format: z.enum(['json', 'csv', 'form8949']).default('json'),
  method: z.enum(['FIFO', 'LIFO', 'HIFO', 'AVERAGE']).optional(),
});

export type TaxExportQuery = z.infer<typeof taxExportSchema>;
