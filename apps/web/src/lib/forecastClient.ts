import type { ForecastRequest, ForecastResult } from '@wealthtrack/types';

export async function runForecast(req: ForecastRequest): Promise<ForecastResult> {
  const res = await fetch(`${process.env.FORECAST_URL}/v1/forecast`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      initial_value: req.initialValue,
      monthly_contribution: req.monthlyContribution,
      expected_return: req.expectedReturn,
      volatility: req.volatility,
      years: req.years,
      simulations: req.simulations ?? 5000,
      goal_target: req.goalTarget,
    }),
  });
  if (!res.ok) throw new Error(`Forecast service error ${res.status}`);
  const body = await res.json();
  return {
    bands: body.bands,
    probabilityOfGoal: body.probability_of_goal ?? null,
    medianFinal: body.median_final,
  };
}
