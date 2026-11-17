// Command alertd runs a one-shot alert evaluation, intended for cron or manual replays.
package main

import (
	"context"
	"flag"
	"log/slog"
	"os"

	"github.com/wealthtrack/marketdata/internal/alerts"
	"github.com/wealthtrack/marketdata/internal/config"
	"github.com/wealthtrack/marketdata/internal/provider"
	"github.com/wealthtrack/marketdata/internal/store"
)

func main() {
	dry := flag.Bool("dry-run", false, "evaluate rules but do not call the webhook")
	flag.Parse()

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}
	ctx := context.Background()
	st, err := store.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("store", "err", err)
		os.Exit(1)
	}
	defer st.Close()

	prov, _ := provider.New(cfg.Provider, cfg.APIKey)
	rules, err := st.ActiveRules(ctx)
	if err != nil {
		slog.Error("rules", "err", err)
		os.Exit(1)
	}
	symbols := make([]string, 0, len(rules))
	for _, r := range rules {
		symbols = append(symbols, r.Symbol)
	}
	quotes, err := prov.Fetch(ctx, symbols)
	if err != nil {
		slog.Error("fetch", "err", err)
		os.Exit(1)
	}
	engine := alerts.NewEngine(cfg.WebhookURL, st.PreviousClose)
	for _, ev := range engine.Evaluate(ctx, rules, quotes) {
		slog.Info("fired", "alert", ev.AlertID, "symbol", ev.Symbol, "price", ev.Price)
		if !*dry {
			_ = engine.Notify(ctx, ev)
		}
	}
}
