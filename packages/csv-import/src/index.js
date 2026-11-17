'use strict';
const { parseCsv, toObjects } = require('./parseCsv');
const brokers = { fidelity: require('./brokers/fidelity'), schwab: require('./brokers/schwab') };

function importCsv(brokerId, text) {
  const broker = brokers[brokerId];
  if (!broker) throw new Error(`Unsupported broker: ${brokerId}`);

  const objects = toObjects(parseCsv(text));
  const missing = broker.requiredColumns.filter((c) => !(objects[0] && c in objects[0]));
  if (missing.length) throw new Error(`Missing columns: ${missing.join(', ')}`);

  const transactions = [];
  const skipped = [];
  objects.forEach((row, index) => {
    const mapped = broker.mapRow(row);
    if (mapped && mapped.occurredAt) transactions.push(mapped);
    else skipped.push(index + 2);
  });
  return { transactions, skipped };
}

module.exports = { importCsv, supportedBrokers: Object.keys(brokers) };
