CREATE TYPE "AlertCondition" AS ENUM ('ABOVE','BELOW','PCT_CHANGE_UP','PCT_CHANGE_DOWN');
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE','TRIGGERED','PAUSED','EXPIRED');
CREATE TYPE "ImportStatus" AS ENUM ('QUEUED','PROCESSING','DONE','FAILED');

CREATE TABLE "TaxLot" (
  "id" TEXT PRIMARY KEY,
  "holdingId" TEXT NOT NULL REFERENCES "Holding"("id") ON DELETE CASCADE,
  "acquiredAt" TIMESTAMP(3) NOT NULL,
  "quantity" DECIMAL(24,8) NOT NULL,
  "remaining" DECIMAL(24,8) NOT NULL,
  "unitCost" DECIMAL(18,4) NOT NULL
);
CREATE INDEX "TaxLot_holdingId_acquiredAt_idx" ON "TaxLot"("holdingId","acquiredAt");

CREATE TABLE "PriceAlert" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id"),
  "condition" "AlertCondition" NOT NULL,
  "threshold" DECIMAL(18,4) NOT NULL,
  "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
  "triggeredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "PriceAlert_securityId_status_idx" ON "PriceAlert"("securityId","status");

CREATE TABLE "NetWorthSnapshot" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "takenOn" DATE NOT NULL,
  "assets" DECIMAL(18,4) NOT NULL,
  "liabilities" DECIMAL(18,4) NOT NULL,
  "netWorth" DECIMAL(18,4) NOT NULL
);
CREATE UNIQUE INDEX "NetWorthSnapshot_userId_takenOn_key" ON "NetWorthSnapshot"("userId","takenOn");

CREATE TABLE "CsvImport" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "broker" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "status" "ImportStatus" NOT NULL DEFAULT 'QUEUED',
  "rowCount" INTEGER NOT NULL DEFAULT 0,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ForecastRun" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "params" JSONB NOT NULL,
  "result" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
