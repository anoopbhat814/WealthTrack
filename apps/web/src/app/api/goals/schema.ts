import { z } from 'zod';

export const goalKindSchema = z.enum(['RETIREMENT', 'HOME', 'EDUCATION', 'EMERGENCY', 'TRAVEL', 'CUSTOM']);

export const createGoalSchema = z.object({
  kind: goalKindSchema,
  name: z.string().min(1).max(80),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().default(0),
  monthlyContribution: z.number().nonnegative().default(0),
  targetDate: z.coerce.date().refine((d) => d.getTime() > Date.now(), 'targetDate must be in the future'),
  expectedReturn: z.number().min(0).max(0.25).default(0.06),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
