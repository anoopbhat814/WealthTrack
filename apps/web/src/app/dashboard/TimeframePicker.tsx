'use client';
import type { Timeframe } from '@wealthtrack/types';

const OPTIONS: Timeframe[] = ['1M', '3M', '1Y', '5Y', 'MAX'];

interface TimeframePickerProps {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
}

export function TimeframePicker({ value, onChange }: TimeframePickerProps) {
  return (
    <div role="tablist" className="segmented">
      {OPTIONS.map((tf) => (
        <button key={tf} role="tab" aria-selected={tf === value} className={tf === value ? 'is-active' : ''} onClick={() => onChange(tf)}>
          {tf}
        </button>
      ))}
    </div>
  );
}
