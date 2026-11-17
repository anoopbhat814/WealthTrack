export type AssetClass =
  | 'EQUITY' | 'FIXED_INCOME' | 'CASH' | 'CRYPTO' | 'REAL_ESTATE' | 'COMMODITY' | 'ALTERNATIVE';

export interface Security {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  sector?: string | null;
}

export interface HoldingView {
  id: string;
  security: Security;
  quantity: number;
  costBasis: number;
  price: number;
  marketValue: number;
  unrealizedGain: number;
  unrealizedGainPct: number;
  weight: number;
}

export interface PortfolioSummary {
  id: string;
  name: string;
  totalValue: number;
  dayChange: number;
  dayChangePct: number;
  holdings: HoldingView[];
}

export interface NetWorthPoint {
  date: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface AllocationSlice {
  assetClass: AssetClass;
  value: number;
  weight: number;
}
