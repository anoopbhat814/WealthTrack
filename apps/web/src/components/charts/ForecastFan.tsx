'use client';
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ForecastBand } from '@wealthtrack/types';
import { formatCurrency } from '@wealthtrack/utils';

export function ForecastFan({ bands }: { bands: ForecastBand[] }) {
  const data = bands.map((b) => ({ ...b, outer: [b.p5, b.p95], inner: [b.p25, b.p75] }));
  return (
    <ResponsiveContainer width="100%" height={340}>
      <ComposedChart data={data}>
        <XAxis dataKey="month" tickFormatter={(m: number) => `${Math.round(m / 12)}y`} />
        <YAxis tickFormatter={(v: number) => formatCurrency(v, 'USD', true)} width={72} />
        <Tooltip formatter={(v: number | number[]) => (Array.isArray(v) ? v.map((x) => formatCurrency(x)).join(' - ') : formatCurrency(v))} />
        <Area dataKey="outer" stroke="none" fill="#bfdbfe" fillOpacity={0.5} />
        <Area dataKey="inner" stroke="none" fill="#60a5fa" fillOpacity={0.5} />
        <Line dataKey="p50" stroke="#1d4ed8" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
