import { StatTile } from '@/components/ui/StatTile';
import type { PortfolioSummary } from '@wealthtrack/types';

export function PortfolioHeader({ portfolio }: { portfolio: PortfolioSummary }) {
  return (
    <header style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
      <h2>{portfolio.name}</h2>
      <StatTile label="Value" value={portfolio.totalValue} />
      <StatTile label="Today" value={portfolio.dayChange} change={portfolio.dayChangePct} />
    </header>
  );
}
