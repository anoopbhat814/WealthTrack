import type { CostBasisMethod } from '@wealthtrack/types';

export interface Lot {
  id: string;
  acquiredAt: Date;
  remaining: number;
  unitCost: number;
}

export interface Consumption {
  lotId: string;
  acquiredAt: Date;
  quantity: number;
  unitCost: number;
}

function order(lots: Lot[], method: CostBasisMethod): Lot[] {
  const copy = [...lots];
  switch (method) {
    case 'LIFO':
      return copy.sort((a, b) => b.acquiredAt.getTime() - a.acquiredAt.getTime());
    case 'HIFO':
      return copy.sort((a, b) => b.unitCost - a.unitCost);
    default:
      return copy.sort((a, b) => a.acquiredAt.getTime() - b.acquiredAt.getTime());
  }
}

/** Select which lots a sale consumes under the chosen cost-basis method. */
export function consumeLots(lots: Lot[], quantity: number, method: CostBasisMethod): Consumption[] {
  const out: Consumption[] = [];
  let needed = quantity;

  if (method === 'AVERAGE') {
    const held = lots.reduce((a, l) => a + l.remaining, 0);
    const avg = held ? lots.reduce((a, l) => a + l.remaining * l.unitCost, 0) / held : 0;
    for (const lot of order(lots, 'FIFO')) {
      if (needed <= 0) break;
      const take = Math.min(lot.remaining, needed);
      out.push({ lotId: lot.id, acquiredAt: lot.acquiredAt, quantity: take, unitCost: avg });
      needed -= take;
    }
    return out;
  }

  for (const lot of order(lots, method)) {
    if (needed <= 0) break;
    const take = Math.min(lot.remaining, needed);
    if (take > 0) out.push({ lotId: lot.id, acquiredAt: lot.acquiredAt, quantity: take, unitCost: lot.unitCost });
    needed -= take;
  }
  if (needed > 1e-9) throw new Error(`Sale exceeds held quantity by ${needed}`);
  return out;
}
