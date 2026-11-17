CREATE TYPE "AccountType" AS ENUM ('BROKERAGE','RETIREMENT','BANK','CREDIT_CARD','CRYPTO','REAL_ESTATE','LOAN');
CREATE TYPE "AssetClass" AS ENUM ('EQUITY','FIXED_INCOME','CASH','CRYPTO','REAL_ESTATE','COMMODITY','ALTERNATIVE');
CREATE TYPE "TransactionType" AS ENUM ('BUY','SELL','DIVIDEND','INTEREST','DEPOSIT','WITHDRAWAL','FEE','SPLIT','TRANSFER');
CREATE TYPE "CostBasisMethod" AS ENUM ('FIFO','LIFO','HIFO','AVERAGE');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
  "costBasis" "CostBasisMethod" NOT NULL DEFAULT 'FIFO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "institution" TEXT,
  "type" "AccountType" NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "balance" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "archived" BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE TABLE "Portfolio" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "benchmark" TEXT DEFAULT 'SPY',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Portfolio_userId_name_key" ON "Portfolio"("userId","name");

CREATE TABLE "Security" (
  "id" TEXT PRIMARY KEY,
  "symbol" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "assetClass" "AssetClass" NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "exchange" TEXT,
  "sector" TEXT
);

CREATE TABLE "Holding" (
  "id" TEXT PRIMARY KEY,
  "portfolioId" TEXT NOT NULL REFERENCES "Portfolio"("id") ON DELETE CASCADE,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id"),
  "quantity" DECIMAL(24,8) NOT NULL,
  "targetWeight" DECIMAL(6,4)
);
CREATE UNIQUE INDEX "Holding_portfolioId_securityId_key" ON "Holding"("portfolioId","securityId");

CREATE TABLE "PriceQuote" (
  "id" BIGSERIAL PRIMARY KEY,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id") ON DELETE CASCADE,
  "price" DECIMAL(18,4) NOT NULL,
  "volume" BIGINT,
  "source" TEXT NOT NULL,
  "quotedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "PriceQuote_securityId_quotedAt_key" ON "PriceQuote"("securityId","quotedAt");
