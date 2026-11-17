export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface BudgetCategoryView {
  id: string;
  name: string;
  limit: number;
  spent: number;
  remaining: number;
  rollover: boolean;
}

export interface BudgetView {
  id: string;
  name: string;
  period: BudgetPeriod;
  categories: BudgetCategoryView[];
  totalLimit: number;
  totalSpent: number;
}

export interface CashflowMonth {
  month: string;
  income: number;
  expenses: number;
}
