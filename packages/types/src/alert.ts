export type AlertCondition = 'ABOVE' | 'BELOW' | 'PCT_CHANGE_UP' | 'PCT_CHANGE_DOWN';
export type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'PAUSED' | 'EXPIRED';

export interface PriceAlertView {
  id: string;
  symbol: string;
  condition: AlertCondition;
  threshold: number;
  status: AlertStatus;
  triggeredAt?: string | null;
}

export interface AlertWebhookPayload {
  alertId: string;
  symbol: string;
  price: number;
  condition: AlertCondition;
  threshold: number;
  firedAt: string;
}
