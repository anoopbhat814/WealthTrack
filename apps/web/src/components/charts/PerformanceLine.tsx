'use client';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatPercent } from '@wealthtrack/utils';
import { chartTheme } from './palette';

export interface PerformancePoint {
  date: string;
  portfolio: number;
  benchmark: number;
}

export function PerformanceLine({ data, benchmarkLabel = 'SPY' }: { data: PerformancePoint[]; benchmarkLabel?: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke={chartTheme.axis} />
        <YAxis stroke={chartTheme.axis} tickFormatter={(v: number) => formatPercent(v, 0)} />
        <Tooltip formatter={(v: number) => formatPercent(v)} />
        <Legend />
        <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke={chartTheme.line} dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="benchmark" name={benchmarkLabel} stroke="#94a3b8" dot={false} strokeDasharray="5 4" />
      </LineChart>
    </ResponsiveContainer>
  );
}
