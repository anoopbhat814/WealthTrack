# Architecture

WealthTrack is split into a Next.js application, a Node worker and two
specialised microservices.

## Data flow

1. `services/marketdata` (Go) polls a quote provider every minute and writes
   rows into `PriceQuote`. It evaluates `PriceAlert` rules on each batch and
   POSTs triggered alerts to the web app webhook.
2. `apps/worker` snapshots every portfolio nightly into `NetWorthSnapshot` and
   processes queued broker CSV imports.
3. `apps/web` reads Postgres through Prisma and calls `services/forecast`
   for Monte Carlo projections and efficient-frontier optimisation.

## Design decisions

- Money is stored as `Decimal(18,4)`; the UI converts through `packages/utils/money`.
- Tax lots are first-class rows so FIFO, LIFO and HIFO reports are derivable.
- Forecasting is stateless; the web app passes returns history in the request.
