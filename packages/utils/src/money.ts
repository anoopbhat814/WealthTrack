const formatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(value: number, currency = 'USD', compact = false): string {
  const key = `${currency}:${compact}`;
  let fmt = formatters.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2,
    });
    formatters.set(key, fmt);
  }
  return fmt.format(value);
}

export function formatPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(digits)}%`;
}

/** Round half away from zero at the given number of decimal places. */
export function roundMoney(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.sign(value) * Math.round(Math.abs(value) * factor) / factor;
}

export function sum(values: readonly number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function toNumber(d: { toNumber(): number } | number | string | null | undefined): number {
  if (d == null) return 0;
  if (typeof d === 'number') return d;
  if (typeof d === 'string') return Number(d);
  return d.toNumber();
}
