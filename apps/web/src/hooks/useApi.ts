import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import type {
  BudgetView, GoalView, NetWorthPoint, AllocationSlice, PortfolioSummary, PriceAlertView, TaxReport,
} from '@wealthtrack/types';

export const useNetWorth = (days = 365) =>
  useSWR<{ series: NetWorthPoint[]; allocation: AllocationSlice[] }>(`/api/networth?days=${days}`, fetcher);

export const usePortfolios = () => useSWR<PortfolioSummary[]>('/api/portfolios', fetcher);
export const useBudgets = () => useSWR<BudgetView[]>('/api/budgets', fetcher);
export const useGoals = () => useSWR<GoalView[]>('/api/goals', fetcher);
export const useAlerts = () => useSWR<PriceAlertView[]>('/api/alerts', fetcher, { refreshInterval: 30_000 });
export const useTaxReport = (year: number) => useSWR<TaxReport>(`/api/tax?year=${year}`, fetcher);
