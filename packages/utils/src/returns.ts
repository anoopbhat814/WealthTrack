export function simpleReturn(start: number, end: number): number {
  return start === 0 ? 0 : (end - start) / start;
}

/** Compound annual growth rate. */
export function cagr(start: number, end: number, years: number): number {
  if (start <= 0 || years <= 0) return 0;
  return (end / start) ** (1 / years) - 1;
}

/** Time-weighted return across sub-period values with external flows. */
export function twr(values: number[], flows: number[]): number {
  let acc = 1;
  for (let i = 1; i < values.length; i++) {
    const begin = values[i - 1]! + (flows[i - 1] ?? 0);
    if (begin === 0) continue;
    acc *= values[i]! / begin;
  }
  return acc - 1;
}

export function maxDrawdown(series: number[]): number {
  let peak = -Infinity;
  let worst = 0;
  for (const v of series) {
    peak = Math.max(peak, v);
    if (peak > 0) worst = Math.min(worst, (v - peak) / peak);
  }
  return worst;
}

export function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1));
}
