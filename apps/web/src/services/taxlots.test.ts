import { describe, expect, it } from 'vitest';
import { consumeLots } from './taxlots';

const lots = [
  { id: 'a', acquiredAt: new Date('2022-01-10'), remaining: 10, unitCost: 100 },
  { id: 'b', acquiredAt: new Date('2023-03-05'), remaining: 10, unitCost: 150 },
  { id: 'c', acquiredAt: new Date('2024-02-01'), remaining: 10, unitCost: 120 },
];

describe('consumeLots', () => {
  it('uses oldest lot first for FIFO', () => {
    const r = consumeLots(lots, 15, 'FIFO');
    expect(r.map((x) => x.lotId)).toEqual(['a', 'b']);
    expect(r[1]!.quantity).toBe(5);
  });
  it('uses highest cost first for HIFO', () => {
    expect(consumeLots(lots, 5, 'HIFO')[0]!.lotId).toBe('b');
  });
  it('throws when selling more than held', () => {
    expect(() => consumeLots(lots, 31, 'LIFO')).toThrow();
  });
});
