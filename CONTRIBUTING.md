# Contributing to WealthTrack

Thanks for taking the time to improve WealthTrack. This guide explains how to set up the
project, the conventions we follow, and how changes get reviewed.

## Getting set up

Requirements: Node 20, Go 1.22, Python 3.11, Docker and PostgreSQL 16 (or use `make up`).

```bash
cp .env.example .env
npm ci
make up          # postgres, redis and services
make migrate
make seed
make dev         # web on http://localhost:3000
```

Run `npm run check-env` if the app fails to start; it reports missing variables.

## Repository layout

| Path                  | Language   | Notes                                     |
|-----------------------|------------|-------------------------------------------|
| `apps/web`            | TypeScript | Next.js app, API routes, services         |
| `apps/worker`         | JavaScript | Queue consumer and nightly snapshots      |
| `packages/*`          | TS / JS    | Shared types, utilities and CSV parsers   |
| `services/forecast`   | Python     | FastAPI service for Monte Carlo and optimisation |
| `services/marketdata` | Go         | Quote ingestion and alert evaluation      |
| `prisma`              | Prisma     | Schema, migrations, seed data             |

## Workflow

1. Open or claim an issue before starting non-trivial work.
2. Branch from `main` using `feat/...`, `fix/...` or `docs/...`.
3. Keep pull requests focused; split refactors from behaviour changes.
4. Add or update tests, and docs under `docs/` when behaviour changes.
5. Make sure `make lint` and `make test` pass locally.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/): `feat(web): add goal projections`,
`fix(marketdata): retry on 429`. Reference issues in the body (`Closes #123`).

### Database changes

- Edit `prisma/schema.prisma`, then run `npx prisma migrate dev --name short_description`.
- Never edit a migration that has been merged. Add a new one instead.
- Provide a `down.sql` next to the migration for anything destructive.

### Code style

- TypeScript: Prettier and ESLint (`npm run lint`). Prefer small, typed service functions over logic in route handlers.
- Go: `gofmt`, `go vet`; errors are wrapped with `%w`.
- Python: `ruff`; type hints on public functions; pydantic models for request and response bodies.
- Money is `Decimal` in the database and converted with `toNumber` at the service boundary.

## Tests

```bash
npm test                       # vitest and node:test suites
cd services/forecast && pytest
cd services/marketdata && go test ./...
```

## Reporting security issues

Please do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).

## Code of conduct

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
