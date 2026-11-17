import { z } from 'zod';

export const budgetPeriodSchema = z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']);

export const budgetCategoryInput = z.object({
  name: z.string().min(1).max(60),
  limit: z.number().nonnegative(),
  rollover: z.boolean().default(false),
});

export const createBudgetSchema = z.object({
  name: z.string().min(1).max(80),
  period: budgetPeriodSchema.default('MONTHLY'),
  categories: z.array(budgetCategoryInput).min(1).max(40),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
