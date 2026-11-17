-- Manual rollback for 20240215000000_budgets_goals. Not executed by `prisma migrate`.
DROP TABLE IF EXISTS "Transaction";
DROP TABLE IF EXISTS "Goal";
DROP TABLE IF EXISTS "BudgetCategory";
DROP TABLE IF EXISTS "Budget";
DROP TYPE IF EXISTS "GoalKind";
DROP TYPE IF EXISTS "BudgetPeriod";
