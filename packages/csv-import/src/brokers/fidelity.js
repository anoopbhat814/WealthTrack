'use strict';
const { parseMoney, parseDate, normalizeType } = require('../normalize');

const id = 'fidelity';

function mapRow(r) {
  const type = normalizeType(r.action);
  if (!type) return null;
  return {
    type,
    symbol: r.symbol || null,
    quantity: parseMoney(r.quantity),
    price: parseMoney(r.price),
    amount: parseMoney(r.amount),
    fee: parseMoney(r.commission) ?? 0,
    occurredAt: parseDate(r['run date']),
    memo: r.description,
  };
}

module.exports = { id, mapRow, requiredColumns: ['run date', 'action', 'symbol', 'quantity', 'price', 'amount'] };
