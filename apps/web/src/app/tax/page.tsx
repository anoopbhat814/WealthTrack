'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { useTaxReport } from '@/hooks/useApi';
import { formatCurrency } from '@wealthtrack/utils';
import type { RealizedGainRow } from '@wealthtrack/types';

const columns: Column<RealizedGainRow>[] = [
  { key: 'symbol', header: 'Symbol', render: (r) => r.symbol },
  { key: 'term', header: 'Term', render: (r) => r.term },
  { key: 'proceeds', header: 'Proceeds', align: 'right', render: (r) => formatCurrency(r.proceeds) },
  { key: 'basis', header: 'Basis', align: 'right', render: (r) => formatCurrency(r.costBasis) },
  { key: 'gain', header: 'Gain', align: 'right', sortValue: (r) => r.gain, render: (r) => formatCurrency(r.gain) },
];

export default function TaxPage() {
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const { data } = useTaxReport(year);
  return (
    <>
      <Card title="Tax year" action={<input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />}>
        {data && (
          <div style={{ display: 'flex', gap: 32 }}>
            <StatTile label="Short-term" value={data.shortTermGain} />
            <StatTile label="Long-term" value={data.longTermGain} />
            <StatTile label="Dividends" value={data.dividends} />
          </div>
        )}
      </Card>
      {data && <Card title={`Realised lots (${data.method})`}><DataTable rows={data.rows.map((r, i) => ({ ...r, id: String(i) }))} columns={columns} /></Card>}
    </>
  );
}
