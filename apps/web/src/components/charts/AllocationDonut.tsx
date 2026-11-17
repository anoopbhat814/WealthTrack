'use client';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AllocationSlice } from '@wealthtrack/types';
import { formatCurrency, formatPercent } from '@wealthtrack/utils';
import { ASSET_COLORS } from './palette';

export function AllocationDonut({ slices }: { slices: AllocationSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={slices} dataKey="value" nameKey="assetClass" innerRadius={70} outerRadius={105} paddingAngle={2}>
          {slices.map((s) => (
            <Cell key={s.assetClass} fill={ASSET_COLORS[s.assetClass] ?? '#64748b'} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number, _n, item) => `${formatCurrency(v)} (${formatPercent((item.payload as AllocationSlice).weight, 1)})`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
