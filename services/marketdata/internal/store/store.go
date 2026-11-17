// Package store persists quotes and loads alert rules from Postgres.
package store

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/wealthtrack/marketdata/internal/alerts"
	"github.com/wealthtrack/marketdata/internal/provider"
)

type Store struct{ pool *pgxpool.Pool }

func New(ctx context.Context, dsn string) (*Store, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, fmt.Errorf("connect: %w", err)
	}
	return &Store{pool: pool}, nil
}

func (s *Store) Close() { s.pool.Close() }

// Symbols returns every symbol held in a portfolio or referenced by an active alert.
func (s *Store) Symbols(ctx context.Context) ([]string, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT DISTINCT sec."symbol" FROM "Security" sec
		WHERE sec."id" IN (SELECT "securityId" FROM "Holding")
		   OR sec."id" IN (SELECT "securityId" FROM "PriceAlert" WHERE "status" = 'ACTIVE')`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []string
	for rows.Next() {
		var sym string
		if err := rows.Scan(&sym); err != nil {
			return nil, err
		}
		out = append(out, sym)
	}
	return out, rows.Err()
}

func (s *Store) SaveQuotes(ctx context.Context, quotes []provider.Quote) error {
	for _, q := range quotes {
		_, err := s.pool.Exec(ctx, `
			INSERT INTO "PriceQuote" ("securityId","price","volume","source","quotedAt")
			SELECT "id", $2, $3, $4, $5 FROM "Security" WHERE "symbol" = $1
			ON CONFLICT ("securityId","quotedAt") DO NOTHING`,
			q.Symbol, q.Price, q.Volume, q.Source, q.QuotedAt)
		if err != nil {
			return fmt.Errorf("save %s: %w", q.Symbol, err)
		}
	}
	return nil
}

func (s *Store) ActiveRules(ctx context.Context) ([]alerts.Rule, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT a."id", sec."symbol", a."condition"::text, a."threshold"::float8
		FROM "PriceAlert" a JOIN "Security" sec ON sec."id" = a."securityId"
		WHERE a."status" = 'ACTIVE'`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var rules []alerts.Rule
	for rows.Next() {
		var r alerts.Rule
		var cond string
		if err := rows.Scan(&r.ID, &r.Symbol, &cond, &r.Threshold); err != nil {
			return nil, err
		}
		r.Condition = alerts.Condition(cond)
		rules = append(rules, r)
	}
	return rules, rows.Err()
}

// PreviousClose returns the most recent price older than 20 hours, used for percent-change rules.
func (s *Store) PreviousClose(ctx context.Context, symbol string) (float64, error) {
	var p float64
	err := s.pool.QueryRow(ctx, `
		SELECT q."price"::float8 FROM "PriceQuote" q JOIN "Security" sec ON sec."id" = q."securityId"
		WHERE sec."symbol" = $1 AND q."quotedAt" < now() - interval '20 hours'
		ORDER BY q."quotedAt" DESC LIMIT 1`, symbol).Scan(&p)
	return p, err
}
