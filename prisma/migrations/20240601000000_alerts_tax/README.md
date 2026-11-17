# alerts_tax

Introduces tax lots, price alerts, nightly net-worth snapshots, CSV import tracking and stored
forecast runs. `PriceAlert(securityId, status)` is indexed for the alert daemon's polling query.

Rollback: `psql "$DATABASE_URL" -f down.sql`. Dropping `TaxLot` loses cost-basis history.
