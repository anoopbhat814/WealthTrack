-- Manual rollback for 20240101000000_init. Not executed by `prisma migrate`.
DROP TABLE IF EXISTS "PriceQuote";
DROP TABLE IF EXISTS "Holding";
DROP TABLE IF EXISTS "Security";
DROP TABLE IF EXISTS "Portfolio";
DROP TABLE IF EXISTS "Account";
DROP TABLE IF EXISTS "User";
DROP TYPE IF EXISTS "CostBasisMethod";
DROP TYPE IF EXISTS "TransactionType";
DROP TYPE IF EXISTS "AssetClass";
DROP TYPE IF EXISTS "AccountType";
