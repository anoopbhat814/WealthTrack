package store

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/wealthtrack/marketdata/internal/provider"
)

// LatestQuote returns the newest stored quote for symbol.
func (s *Store) LatestQuote(ctx context.Context, symbol string) (provider.Quote, error) {
	q := provider.Quote{Symbol: symbol}
	err := s.pool.QueryRow(ctx, `
		SELECT q."price"::float8, COALESCE(q."volume", 0), q."source", q."quotedAt"
		FROM "PriceQuote" q JOIN "Security" sec ON sec."id" = q."securityId"
		WHERE sec."symbol" = $1
		ORDER BY q."quotedAt" DESC LIMIT 1`, symbol).Scan(&q.Price, &q.Volume, &q.Source, &q.QuotedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return q, ErrNotFound
	}
	return q, err
}

// History returns quotes for symbol since the given time, oldest first.
func (s *Store) History(ctx context.Context, symbol string, since time.Time) ([]provider.Quote, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT q."price"::float8, COALESCE(q."volume", 0), q."source", q."quotedAt"
		FROM "PriceQuote" q JOIN "Security" sec ON sec."id" = q."securityId"
		WHERE sec."symbol" = $1 AND q."quotedAt" >= $2
		ORDER BY q."quotedAt" ASC`, symbol, since)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []provider.Quote
	for rows.Next() {
		q := provider.Quote{Symbol: symbol}
		if err := rows.Scan(&q.Price, &q.Volume, &q.Source, &q.QuotedAt); err != nil {
			return nil, err
		}
		out = append(out, q)
	}
	return out, rows.Err()
}

// PruneQuotes deletes quotes older than the retention window and returns the number removed.
func (s *Store) PruneQuotes(ctx context.Context, retention time.Duration) (int64, error) {
	tag, err := s.pool.Exec(ctx, `DELETE FROM "PriceQuote" WHERE "quotedAt" < $1`, time.Now().Add(-retention))
	if err != nil {
		return 0, err
	}
	return tag.RowsAffected(), nil
}
