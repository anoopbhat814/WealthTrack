# @wealthtrack/worker

Background worker for WealthTrack. It runs two kinds of work:

- **Nightly snapshots** (`src/jobs/snapshot.js`): computes each user's assets, liabilities and
  net worth at 02:00 UTC and upserts a `NetWorthSnapshot` row.
- **CSV imports** (`src/jobs/csvImport.js`): consumes `wt:imports` from Redis and parses broker
  exports with `@wealthtrack/csv-import`. Failed jobs are moved to `wt:imports:dead`.

## Configuration

| Variable       | Default                  | Description                  |
|----------------|--------------------------|------------------------------|
| `DATABASE_URL` | none (required)          | Postgres connection string   |
| `REDIS_URL`    | `redis://localhost:6379` | Queue backend                |
| `LOG_LEVEL`    | `info`                   | `debug`, `info`, `error`     |

## Running locally

```bash
npm run start --workspace apps/worker
```

Inspect dead letters with `redis-cli LRANGE wt:imports:dead 0 -1`.
