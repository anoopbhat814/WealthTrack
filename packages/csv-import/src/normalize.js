'use strict';

function parseMoney(value) {
  if (value == null || value === '') return null;
  const negative = /^\(.*\)$/.test(value) || value.startsWith('-');
  const n = Number(value.replace(/[()$,\s-]/g, ''));
  return Number.isNaN(n) ? null : negative ? -n : n;
}

function parseDate(value) {
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (us) return new Date(Date.UTC(+us[3], +us[1] - 1, +us[2]));
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const TYPE_MAP = {
  buy: 'BUY', bought: 'BUY', purchase: 'BUY',
  sell: 'SELL', sold: 'SELL',
  dividend: 'DIVIDEND', div: 'DIVIDEND',
  interest: 'INTEREST', deposit: 'DEPOSIT', withdrawal: 'WITHDRAWAL', fee: 'FEE',
};

function normalizeType(raw) {
  const key = String(raw || '').toLowerCase().split(/[\s-]/)[0];
  return TYPE_MAP[key] || null;
}

module.exports = { parseMoney, parseDate, normalizeType };
