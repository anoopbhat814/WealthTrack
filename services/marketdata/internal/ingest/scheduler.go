// Package ingest runs the periodic quote polling loop.
package ingest

import (
	"context"
	"log/slog"
	"time"

	"github.com/wealthtrack/marketdata/internal/alerts"
	"github.com/wealthtrack/marketdata/internal/provider"
	"github.com/wealthtrack/marketdata/internal/store"
)

type Scheduler struct {
	Store    *store.Store
	Provider provider.Provider
	Engine   *alerts.Engine
	Interval time.Duration
}

// Run blocks until ctx is cancelled, polling on every tick.
func (s *Scheduler) Run(ctx context.Context) {
	ticker := time.NewTicker(s.Interval)
	defer ticker.Stop()
	s.tick(ctx)
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.tick(ctx)
		}
	}
}

func (s *Scheduler) tick(ctx context.Context) {
	symbols, err := s.Store.Symbols(ctx)
	if err != nil || len(symbols) == 0 {
		slog.Warn("no symbols to poll", "err", err)
		return
	}
	quotes, err := s.Provider.Fetch(ctx, symbols)
	if err != nil {
		slog.Error("fetch failed", "err", err)
		return
	}
	if err := s.Store.SaveQuotes(ctx, quotes); err != nil {
		slog.Error("save failed", "err", err)
	}
	rules, err := s.Store.ActiveRules(ctx)
	if err != nil {
		slog.Error("rules failed", "err", err)
		return
	}
	for _, ev := range s.Engine.Evaluate(ctx, rules, quotes) {
		if err := s.Engine.Notify(ctx, ev); err != nil {
			slog.Error("notify failed", "alert", ev.AlertID, "err", err)
		}
	}
}
