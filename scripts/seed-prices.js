#!/usr/bin/env node
'use strict';
// Generates a CSV of synthetic daily prices: node scripts/seed-prices.js VTI 365 > vti.csv

const [symbol = 'VTI', daysArg = '365'] = process.argv.slice(2);
const days = Number(daysArg);

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32([...symbol].reduce((s, c) => s + c.charCodeAt(0), 0));
let price = 100;
console.log('symbol,date,close');
for (let i = days; i >= 0; i--) {
  price *= 1 + (rand() - 0.48) * 0.02;
  const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
  console.log(`${symbol},${d},${price.toFixed(2)}`);
}
