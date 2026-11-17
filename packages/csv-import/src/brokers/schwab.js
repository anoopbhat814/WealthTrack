'use strict';
const { parseMoney, parseDate, normalizeType } = require('../normalize');

const id = 'schwab';

function mapRow(r) {
  const type = normalizeType(r.action);
  if (!type) return null;
  return {
    type,
    symbol: r.symbol || null,
    quantity: parseMoney(r.quantity),
    price: parseMoney(r.price),
    amount: parseMoney(r.amount),
    fee: parseMoney(r['fees & comm']) ?? 0,
    occurredAt: parseDate(r.date),
    memo: r.description,
  };
}

module.exports = { id, mapRow, requiredColumns: ['date', 'action', 'symbol', 'quantity', 'price', 'amount'] };
