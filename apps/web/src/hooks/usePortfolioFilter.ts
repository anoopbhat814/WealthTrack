import { useMemo, useState } from 'react';
import type { AssetClass, HoldingView } from '@wealthtrack/types';

/** Client-side filtering of holdings by asset class and free-text query. */
export function usePortfolioFilter(holdings: HoldingView[]) {
  const [assetClass, setAssetClass] = useState<AssetClass | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return holdings.filter(
      (h) =>
        (assetClass === 'ALL' || h.security.assetClass === assetClass) &&
        (!q || h.security.symbol.toLowerCase().includes(q) || h.security.name.toLowerCase().includes(q)),
    );
  }, [holdings, assetClass, query]);

  return { filtered, assetClass, setAssetClass, query, setQuery };
}
