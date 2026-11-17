import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@wealthtrack/utils';
import type { BudgetCategoryView } from '@wealthtrack/types';

export function CategoryRow({ category }: { category: BudgetCategoryView }) {
  const ratio = category.limit ? category.spent / category.limit : 0;
  return (
    <div className={ratio > 1 ? 'category-row category-row--over' : 'category-row'} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{category.name}{category.rollover ? ' (rollover)' : ''}</span>
        <span>{formatCurrency(category.spent)} / {formatCurrency(category.limit)}</span>
      </div>
      <ProgressBar value={ratio} />
    </div>
  );
}
