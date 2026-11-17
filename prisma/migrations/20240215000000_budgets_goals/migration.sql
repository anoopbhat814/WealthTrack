CREATE TYPE "BudgetPeriod" AS ENUM ('WEEKLY','MONTHLY','YEARLY');
CREATE TYPE "GoalKind" AS ENUM ('RETIREMENT','HOME','EDUCATION','EMERGENCY','TRAVEL','CUSTOM');

CREATE TABLE "Budget" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "period" "BudgetPeriod" NOT NULL DEFAULT 'MONTHLY'
);

CREATE TABLE "BudgetCategory" (
  "id" TEXT PRIMARY KEY,
  "budgetId" TEXT NOT NULL REFERENCES "Budget"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "limit" DECIMAL(18,4) NOT NULL,
  "rollover" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "Goal" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "kind" "GoalKind" NOT NULL,
  "name" TEXT NOT NULL,
  "targetAmount" DECIMAL(18,4) NOT NULL,
  "currentAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "monthlyContribution" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "targetDate" TIMESTAMP(3) NOT NULL,
  "expectedReturn" DECIMAL(6,4) NOT NULL DEFAULT 0.06
);

CREATE TABLE "Transaction" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "holdingId" TEXT REFERENCES "Holding"("id"),
  "type" "TransactionType" NOT NULL,
  "quantity" DECIMAL(24,8),
  "price" DECIMAL(18,4),
  "amount" DECIMAL(18,4) NOT NULL,
  "fee" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "realizedGain" DECIMAL(18,4),
  "category" TEXT,
  "memo" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "budgetCategoryId" TEXT REFERENCES "BudgetCategory"("id")
);
CREATE INDEX "Transaction_accountId_occurredAt_idx" ON "Transaction"("accountId","occurredAt");
