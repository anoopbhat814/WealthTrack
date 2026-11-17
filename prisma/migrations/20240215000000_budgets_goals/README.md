# budgets_goals

Adds budgets with per-category limits and rollover, savings goals with contribution and expected
return, and the `Transaction` ledger linked to budget categories.

Rollback: `psql "$DATABASE_URL" -f down.sql`. Dropping `Transaction` deletes all imported history.
