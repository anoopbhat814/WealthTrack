# init

Creates the core ledger: users, accounts, portfolios, securities, holdings and price quotes,
plus the enums they depend on. Transactions are introduced in `20240215000000_budgets_goals`
because they reference budget categories.

Rollback: `psql "$DATABASE_URL" -f down.sql` (development databases only).
