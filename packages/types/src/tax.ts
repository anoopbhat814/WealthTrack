export type CostBasisMethod = 'FIFO' | 'LIFO' | 'HIFO' | 'AVERAGE';

export interface TaxLotView {
  id: string;
  symbol: string;
  acquiredAt: string;
  remaining: number;
  unitCost: number;
}

export interface RealizedGainRow {
  symbol: string;
  soldAt: string;
  acquiredAt: string;
  quantity: number;
  proceeds: number;
  costBasis: number;
  gain: number;
  term: 'SHORT' | 'LONG';
}

export interface TaxReport {
  year: number;
  method: CostBasisMethod;
  shortTermGain: number;
  longTermGain: number;
  dividends: number;
  rows: RealizedGainRow[];
}
