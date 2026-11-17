CREATE TYPE "DividendFrequency" AS ENUM ('MONTHLY','QUARTERLY','SEMI_ANNUAL','ANNUAL','SPECIAL');
CREATE TYPE "CorporateActionKind" AS ENUM ('SPLIT','REVERSE_SPLIT','SPIN_OFF','MERGER','SYMBOL_CHANGE');
CREATE TYPE "ContributionFrequency" AS ENUM ('WEEKLY','BIWEEKLY','MONTHLY','QUARTERLY');
CREATE TYPE "LiabilityKind" AS ENUM ('MORTGAGE','AUTO','STUDENT','PERSONAL','CREDIT_CARD','HELOC');
CREATE TYPE "InsuranceKind" AS ENUM ('LIFE','HEALTH','DISABILITY','HOME','AUTO','UMBRELLA');
CREATE TYPE "TaxDocumentKind" AS ENUM ('FORM_1099_B','FORM_1099_DIV','FORM_1099_INT','FORM_1099_R','W2','K1','OTHER');
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL','WEBHOOK','PUSH','IN_APP');

CREATE TABLE "dividends" (
  "id" TEXT PRIMARY KEY,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id") ON DELETE CASCADE,
  "exDate" DATE NOT NULL,
  "payDate" DATE,
  "amount" DECIMAL(18,6) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "frequency" "DividendFrequency" NOT NULL DEFAULT 'QUARTERLY',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "dividends_securityId_exDate_key" ON "dividends"("securityId","exDate");
CREATE INDEX "dividends_exDate_idx" ON "dividends"("exDate");

CREATE TABLE "corporate_actions" (
  "id" TEXT PRIMARY KEY,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id") ON DELETE CASCADE,
  "kind" "CorporateActionKind" NOT NULL,
  "exDate" DATE NOT NULL,
  "ratio" DECIMAL(12,6) NOT NULL,
  "notes" TEXT
);
CREATE UNIQUE INDEX "corporate_actions_securityId_kind_exDate_key" ON "corporate_actions"("securityId","kind","exDate");

CREATE TABLE "watchlists" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "watchlists_userId_name_key" ON "watchlists"("userId","name");

CREATE TABLE "watchlist_items" (
  "id" TEXT PRIMARY KEY,
  "watchlistId" TEXT NOT NULL REFERENCES "watchlists"("id") ON DELETE CASCADE,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id") ON DELETE CASCADE,
  "note" TEXT,
  "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "watchlist_items_watchlistId_securityId_key" ON "watchlist_items"("watchlistId","securityId");
CREATE INDEX "watchlist_items_securityId_idx" ON "watchlist_items"("securityId");

CREATE TABLE "benchmarks" (
  "id" TEXT PRIMARY KEY,
  "symbol" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "active" BOOLEAN NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "benchmarks_symbol_key" ON "benchmarks"("symbol");

CREATE TABLE "recurring_contributions" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL REFERENCES "Account"("id") ON DELETE CASCADE,
  "goalId" TEXT REFERENCES "Goal"("id") ON DELETE SET NULL,
  "amount" DECIMAL(18,4) NOT NULL,
  "frequency" "ContributionFrequency" NOT NULL DEFAULT 'MONTHLY',
  "nextRunOn" DATE NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX "recurring_contributions_userId_active_idx" ON "recurring_contributions"("userId","active");
CREATE INDEX "recurring_contributions_nextRunOn_idx" ON "recurring_contributions"("nextRunOn");

CREATE TABLE "tax_documents" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "kind" "TaxDocumentKind" NOT NULL,
  "taxYear" INTEGER NOT NULL,
  "issuer" TEXT,
  "fileName" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "tax_documents_userId_taxYear_idx" ON "tax_documents"("userId","taxYear");

CREATE TABLE "liabilities" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "kind" "LiabilityKind" NOT NULL,
  "name" TEXT NOT NULL,
  "lender" TEXT,
  "principal" DECIMAL(18,4) NOT NULL,
  "balance" DECIMAL(18,4) NOT NULL,
  "interestRate" DECIMAL(6,4) NOT NULL,
  "minPayment" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "maturesOn" DATE
);
CREATE INDEX "liabilities_userId_kind_idx" ON "liabilities"("userId","kind");

CREATE TABLE "insurance_policies" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "kind" "InsuranceKind" NOT NULL,
  "provider" TEXT NOT NULL,
  "policyNumber" TEXT,
  "coverage" DECIMAL(18,4) NOT NULL,
  "premium" DECIMAL(18,4) NOT NULL,
  "renewsOn" DATE
);
CREATE INDEX "insurance_policies_userId_renewsOn_idx" ON "insurance_policies"("userId","renewsOn");

CREATE TABLE "real_estate_assets" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "mortgageId" TEXT REFERENCES "liabilities"("id") ON DELETE SET NULL,
  "name" TEXT NOT NULL,
  "address" TEXT,
  "purchasePrice" DECIMAL(18,4) NOT NULL,
  "estimatedValue" DECIMAL(18,4) NOT NULL,
  "purchasedOn" DATE,
  "valuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "real_estate_assets_userId_idx" ON "real_estate_assets"("userId");

CREATE TABLE "crypto_wallets" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "accountId" TEXT REFERENCES "Account"("id") ON DELETE SET NULL,
  "label" TEXT NOT NULL,
  "chain" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "crypto_wallets_chain_address_key" ON "crypto_wallets"("chain","address");
CREATE INDEX "crypto_wallets_userId_idx" ON "crypto_wallets"("userId");

CREATE TABLE "exchange_rates" (
  "id" BIGSERIAL PRIMARY KEY,
  "base" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "rate" DECIMAL(18,8) NOT NULL,
  "source" TEXT NOT NULL,
  "quotedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "exchange_rates_base_quote_quotedAt_key" ON "exchange_rates"("base","quote","quotedAt");
CREATE INDEX "exchange_rates_base_quote_idx" ON "exchange_rates"("base","quote");

CREATE TABLE "news_items" (
  "id" TEXT PRIMARY KEY,
  "securityId" TEXT NOT NULL REFERENCES "Security"("id") ON DELETE CASCADE,
  "headline" TEXT NOT NULL,
  "url" TEXT,
  "sentiment" DECIMAL(5,4) NOT NULL,
  "publishedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "news_items_securityId_publishedAt_idx" ON "news_items"("securityId","publishedAt");

CREATE TABLE "notifications" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "channel" "NotificationChannel" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "readAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId","readAt");
