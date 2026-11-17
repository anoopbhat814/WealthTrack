export interface ForecastRequest {
  initialValue: number;
  monthlyContribution: number;
  expectedReturn: number;
  volatility: number;
  years: number;
  simulations?: number;
  goalTarget?: number;
}

export interface ForecastBand {
  month: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

export interface ForecastResult {
  bands: ForecastBand[];
  probabilityOfGoal: number | null;
  medianFinal: number;
}

export interface OptimizedWeights {
  weights: Record<string, number>;
  expectedReturn: number;
  volatility: number;
  sharpe: number;
}
