interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
}

/** Dependency-free SVG sparkline for table cells. */
export function Sparkline({ values, width = 96, height = 28 }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * width},${height - ((v - min) / span) * height}`)
    .join(' ');
  const up = values[values.length - 1]! >= values[0]!;
  return (
    <svg width={width} height={height} aria-hidden>
      <polyline points={points} fill="none" stroke={up ? '#16a34a' : '#dc2626'} strokeWidth={1.5} />
    </svg>
  );
}
