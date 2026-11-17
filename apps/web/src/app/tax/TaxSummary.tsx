import { StatTile } from '@/components/ui/StatTile';
import type { TaxReport } from '@wealthtrack/types';

export function TaxSummary({ report }: { report: TaxReport }) {
  const net = report.shortTermGain + report.longTermGain;
  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <StatTile label="Short-term" value={report.shortTermGain} />
      <StatTile label="Long-term" value={report.longTermGain} />
      <StatTile label="Net realised" value={net} />
      <StatTile label="Dividends" value={report.dividends} />
    </div>
  );
}
