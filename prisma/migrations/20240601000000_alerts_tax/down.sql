-- Manual rollback for 20240601000000_alerts_tax. Not executed by `prisma migrate`.
DROP TABLE IF EXISTS "ForecastRun";
DROP TABLE IF EXISTS "CsvImport";
DROP TABLE IF EXISTS "NetWorthSnapshot";
DROP TABLE IF EXISTS "PriceAlert";
DROP TABLE IF EXISTS "TaxLot";
DROP TYPE IF EXISTS "ImportStatus";
DROP TYPE IF EXISTS "AlertStatus";
DROP TYPE IF EXISTS "AlertCondition";
