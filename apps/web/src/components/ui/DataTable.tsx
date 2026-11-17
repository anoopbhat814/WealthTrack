'use client';
import { useMemo, useState, type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => number | string;
  align?: 'left' | 'right';
}

export function DataTable<T extends { id?: string }>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    return [...rows].sort((a, b) => (get(a) > get(b) ? 1 : -1) * (asc ? 1 : -1));
  }, [rows, columns, sortKey, asc]);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{ textAlign: c.align ?? 'left' }}
              onClick={() => {
                setAsc(sortKey === c.key ? !asc : true);
                setSortKey(c.key);
              }}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map((c) => (
              <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>{c.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
