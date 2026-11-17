import type { PriceAlertView } from '@wealthtrack/types';
import { formatCurrency } from '@wealthtrack/utils';
import { CONDITION_LABELS } from './AlertForm';

const isPercent = (c: PriceAlertView['condition']) => c === 'PCT_CHANGE_UP' || c === 'PCT_CHANGE_DOWN';

export function AlertRow({ alert }: { alert: PriceAlertView }) {
  const threshold = isPercent(alert.condition) ? `${alert.threshold}%` : formatCurrency(alert.threshold);
  return (
    <li className={`alert-row alert-row--${alert.status.toLowerCase()}`}>
      <strong>{alert.symbol}</strong>
      <span>{CONDITION_LABELS[alert.condition]} {threshold}</span>
      <span className="badge">{alert.status}</span>
      {alert.triggeredAt && <time dateTime={alert.triggeredAt}>{new Date(alert.triggeredAt).toLocaleString()}</time>}
    </li>
  );
}
