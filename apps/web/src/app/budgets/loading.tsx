export default function Loading() {
  return (
    <div className="skeleton" role="status" aria-live="polite">
      <div className="skeleton__bar" style={{ width: '40%', height: 24 }} />
      <div className="skeleton__bar" style={{ width: '100%', height: 160, marginTop: 16 }} />
      <span className="sr-only">Loading budgets</span>
    </div>
  );
}
