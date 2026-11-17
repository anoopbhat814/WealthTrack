'use strict';

const LIABILITY_TYPES = new Set(['CREDIT_CARD', 'LOAN']);

/** Compute and upsert today's net-worth snapshot for every user. */
async function run(prisma) {
  const users = await prisma.user.findMany({ select: { id: true } });
  const takenOn = new Date(new Date().toISOString().slice(0, 10));

  for (const { id: userId } of users) {
    const accounts = await prisma.account.findMany({ where: { userId, archived: false } });
    const holdings = await prisma.holding.findMany({
      where: { portfolio: { userId } },
      include: { security: { include: { quotes: { orderBy: { quotedAt: 'desc' }, take: 1 } } } },
    });

    let assets = 0;
    let liabilities = 0;
    for (const a of accounts) {
      const bal = Number(a.balance);
      if (LIABILITY_TYPES.has(a.type)) liabilities += Math.abs(bal);
      else assets += bal;
    }
    for (const h of holdings) {
      const price = Number(h.security.quotes[0]?.price ?? 0);
      assets += price * Number(h.quantity);
    }

    await prisma.netWorthSnapshot.upsert({
      where: { userId_takenOn: { userId, takenOn } },
      update: { assets, liabilities, netWorth: assets - liabilities },
      create: { userId, takenOn, assets, liabilities, netWorth: assets - liabilities },
    });
  }
  console.info(`snapshot complete for ${users.length} users`);
}

module.exports = { run };
