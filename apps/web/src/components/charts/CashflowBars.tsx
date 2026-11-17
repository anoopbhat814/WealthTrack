'use client';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CashflowMonth } from '@wealthtrack/types';
import { formatCurrency } from '@wealthtrack/utils';
import { chartTheme } from './palette';

export function CashflowBars({ months }: { months: CashflowMonth[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={months}>
        <CartesianGrid stroke={chartTheme.grid} vertical={false} />
        <XAxis dataKey="month" stroke={chartTheme.axis} />
        <YAxis stroke={chartTheme.axis} tickFormatter={(v: number) => formatCurrency(v, 'USD', true)} />
        <Tooltip formatter={(v: number) => formatCurrency(v)} />
        <Legend />
        <Bar dataKey="income" fill={chartTheme.positive} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill={chartTheme.negative} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
