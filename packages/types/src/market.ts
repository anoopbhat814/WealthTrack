export interface Quote {
  symbol: string;
  price: number;
  volume?: number;
  source: string;
  quotedAt: string;
}

export interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | 'MAX';
