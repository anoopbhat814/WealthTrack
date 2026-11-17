'use strict';
const { PrismaClient } = require('@prisma/client');
const { startQueue } = require('./queue');
const snapshotJob = require('./jobs/snapshot');
const importJob = require('./jobs/csvImport');
const { scheduleDaily } = require('./schedule');

const prisma = new PrismaClient();

async function main() {
  const queue = startQueue(process.env.REDIS_URL || 'redis://localhost:6379', 'wt:imports');
  queue.process((payload) => importJob.run(prisma, payload));

  scheduleDaily(2, 0, () => snapshotJob.run(prisma)); // 02:00 UTC
  console.info('worker started');

  process.on('SIGTERM', async () => {
    await queue.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
