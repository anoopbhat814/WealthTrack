export function ProgressBar({ value, warnAt = 0.9 }: { value: number; warnAt?: number }) {
  const pct = Math.max(0, Math.min(1, value));
  const tone = pct >= 1 ? 'over' : pct >= warnAt ? 'warn' : 'ok';
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(pct * 100)}>
      <div className={`progress__fill progress__fill--${tone}`} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
