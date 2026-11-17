export function startOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export function addMonths(d: Date, n: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()));
}

export function monthsBetween(from: Date, to: Date): number {
  return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
}

export function isLongTerm(acquired: Date, sold: Date): boolean {
  const oneYear = new Date(Date.UTC(acquired.getUTCFullYear() + 1, acquired.getUTCMonth(), acquired.getUTCDate()));
  return sold.getTime() > oneYear.getTime();
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function timeframeStart(tf: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | 'MAX', now = new Date()): Date {
  const days = { '1D': 1, '1W': 7, '1M': 30, '3M': 91, '1Y': 365, '5Y': 1826, MAX: 36500 }[tf];
  return new Date(now.getTime() - days * 86_400_000);
}
