'use strict';
const fs = require('node:fs/promises');
const { importCsv } = require('@wealthtrack/csv-import');

/** payload: { importId, accountId, path } */
async function run(prisma, payload) {
  const record = await prisma.csvImport.update({ where: { id: payload.importId }, data: { status: 'PROCESSING' } });
  try {
    const text = await fs.readFile(payload.path, 'utf8');
    const { transactions } = importCsv(record.broker, text);

    await prisma.transaction.createMany({
      data: transactions.map((t) => ({
        accountId: payload.accountId,
        type: t.type,
        quantity: t.quantity,
        price: t.price,
        amount: t.amount ?? 0,
        fee: t.fee,
        memo: t.memo,
        occurredAt: t.occurredAt,
      })),
    });
    await prisma.csvImport.update({ where: { id: record.id }, data: { status: 'DONE', rowCount: transactions.length } });
  } catch (err) {
    await prisma.csvImport.update({ where: { id: record.id }, data: { status: 'FAILED', error: err.message } });
    throw err;
  }
}

module.exports = { run };
