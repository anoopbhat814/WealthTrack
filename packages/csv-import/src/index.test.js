'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { importCsv } = require('./index');
const { parseCsv } = require('./parseCsv');

test('parseCsv handles quotes and embedded commas', () => {
  assert.deepStrictEqual(parseCsv('a,"b,c",d\n1,2,3\n'), [['a', 'b,c', 'd'], ['1', '2', '3']]);
});

test('fidelity import maps a buy and skips unknown actions', () => {
  const csv = [
    'Run Date,Action,Symbol,Quantity,Price,Amount,Commission,Description',
    '01/15/2024,YOU BOUGHT,VTI,10,$240.50,($2405.00),0,Vanguard Total',
    '01/16/2024,REINVESTMENT SWEEP,,,,,,',
  ].join('\n');
  const { transactions, skipped } = importCsv('fidelity', csv);
  assert.strictEqual(transactions.length, 1);
  assert.strictEqual(transactions[0].amount, -2405);
  assert.deepStrictEqual(skipped, [3]);
});
