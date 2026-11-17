.PHONY: dev up down migrate seed test lint

dev:
	npm run dev --workspace apps/web

up:
	docker compose -f deploy/docker-compose.yml up -d --build

down:
	docker compose -f deploy/docker-compose.yml down

migrate:
	npx prisma migrate deploy

seed:
	npx tsx prisma/seed.ts

test:
	npm test --workspaces --if-present
	cd services/forecast && python -m pytest
	cd services/marketdata && go test ./...

lint:
	npm run lint --workspaces --if-present
	cd services/forecast && ruff check .
