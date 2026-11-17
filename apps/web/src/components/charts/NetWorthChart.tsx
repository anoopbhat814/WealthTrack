'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NetWorthPoint } from '@wealthtrack/types';
import { formatCurrency } from '@wealthtrack/utils';
import { chartTheme } from './palette';

export function NetWorthChart({ data }: { data: NetWorthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartTheme.line} stopOpacity={0.35} />
            <stop offset="95%" stopColor={chartTheme.line} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke={chartTheme.axis} tickFormatter={(d: string) => d.slice(5)} />
        <YAxis stroke={chartTheme.axis} tickFormatter={(v: number) => formatCurrency(v, 'USD', true)} width={72} />
        <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Date ${l}`} />
        <Area type="monotone" dataKey="netWorth" stroke={chartTheme.line} fill="url(#nw)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
