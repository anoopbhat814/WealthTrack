import { PrismaClient, AssetClass, AccountType, GoalKind } from '@prisma/client';

const prisma = new PrismaClient();

const SECURITIES: Array<[string, string, AssetClass, string]> = [
  ['VTI', 'Vanguard Total Stock Market ETF', 'EQUITY', 'Broad Market'],
  ['VXUS', 'Vanguard Total International Stock ETF', 'EQUITY', 'International'],
  ['BND', 'Vanguard Total Bond Market ETF', 'FIXED_INCOME', 'Aggregate Bond'],
  ['GLD', 'SPDR Gold Shares', 'COMMODITY', 'Gold'],
  ['BTC', 'Bitcoin', 'CRYPTO', 'Digital Assets'],
];

function seededPrice(base: number, day: number): number {
  const wave = Math.sin(day / 9) * 0.03 + Math.cos(day / 23) * 0.02;
  return Math.round(base * (1 + wave + day * 0.0004) * 100) / 100;
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@wealthtrack.dev' },
    update: {},
    create: { email: 'demo@wealthtrack.dev', name: 'Demo Investor' },
  });

  const bases: Record<string, number> = { VTI: 240, VXUS: 58, BND: 72, GLD: 190, BTC: 42000 };
  const securities = [];
  for (const [symbol, name, assetClass, sector] of SECURITIES) {
    const s = await prisma.security.upsert({
      where: { symbol },
      update: {},
      create: { symbol, name, assetClass, sector },
    });
    securities.push(s);
    const quotes = Array.from({ length: 90 }, (_, i) => ({
      securityId: s.id,
      price: seededPrice(bases[symbol]!, i),
      source: 'seed',
      quotedAt: new Date(Date.now() - (90 - i) * 86_400_000),
    }));
    await prisma.priceQuote.createMany({ data: quotes, skipDuplicates: true });
  }

  const portfolio = await prisma.portfolio.upsert({
    where: { userId_name: { userId: user.id, name: 'Core Portfolio' } },
    update: {},
    create: { userId: user.id, name: 'Core Portfolio', description: 'Long-term index holdings' },
  });

  const quantities = [120, 210, 95, 14, 0.35];
  for (const [i, s] of securities.entries()) {
    await prisma.holding.upsert({
      where: { portfolioId_securityId: { portfolioId: portfolio.id, securityId: s.id } },
      update: {},
      create: { portfolioId: portfolio.id, securityId: s.id, quantity: quantities[i]! },
    });
  }

  await prisma.account.create({
    data: { userId: user.id, name: 'Everyday Checking', type: AccountType.BANK, balance: 8450.25 },
  });
  await prisma.goal.create({
    data: {
      userId: user.id,
      kind: GoalKind.RETIREMENT,
      name: 'Retire at 60',
      targetAmount: 2_000_000,
      currentAmount: 310_000,
      monthlyContribution: 2500,
      targetDate: new Date('2046-01-01'),
    },
  });
  const vti = securities[0]!;
  await prisma.dividend.createMany({
    data: [0, 1, 2, 3].map((q) => ({
      securityId: vti.id,
      exDate: new Date(Date.UTC(2024, q * 3 + 2, 22)),
      amount: 0.78 + q * 0.02,
    })),
    skipDuplicates: true,
  });
  await prisma.benchmark.upsert({
    where: { symbol: 'SPY' },
    update: {},
    create: { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  });
  const watchlist = await prisma.watchlist.upsert({
    where: { userId_name: { userId: user.id, name: 'Ideas' } },
    update: {},
    create: { userId: user.id, name: 'Ideas' },
  });
  await prisma.watchlistItem.createMany({
    data: securities.slice(3).map((s) => ({ watchlistId: watchlist.id, securityId: s.id })),
    skipDuplicates: true,
  });
  await prisma.liability.create({
    data: {
      userId: user.id, kind: 'MORTGAGE', name: 'Home mortgage', lender: 'Demo Bank',
      principal: 320_000, balance: 291_500, interestRate: 0.0425, minPayment: 1850,
    },
  });
  await prisma.exchangeRate.createMany({
    data: [['USD', 'EUR', 0.92], ['USD', 'GBP', 0.79]].map(([base, quote, rate]) => ({
      base: base as string, quote: quote as string, rate: rate as number,
      source: 'seed', quotedAt: new Date(Date.UTC(2024, 0, 2)),
    })),
    skipDuplicates: true,
  });
  console.info('Seeded demo data for', user.email);
}

main().finally(() => prisma.$disconnect());
