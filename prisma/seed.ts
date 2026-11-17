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
  console.info('Seeded demo data for', user.email);
}

main().finally(() => prisma.$disconnect());
