// Command ingestd polls market data and stores quotes.
package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/wealthtrack/marketdata/internal/alerts"
	"github.com/wealthtrack/marketdata/internal/config"
	"github.com/wealthtrack/marketdata/internal/httpapi"
	"github.com/wealthtrack/marketdata/internal/ingest"
	"github.com/wealthtrack/marketdata/internal/provider"
	"github.com/wealthtrack/marketdata/internal/store"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	st, err := store.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("store", "err", err)
		os.Exit(1)
	}
	defer st.Close()

	prov, err := provider.New(cfg.Provider, cfg.APIKey)
	if err != nil {
		slog.Error("provider", "err", err)
		os.Exit(1)
	}

	sched := &ingest.Scheduler{
		Store: st, Provider: prov, Interval: cfg.PollInterval,
		Engine: alerts.NewEngine(cfg.WebhookURL, st.PreviousClose),
	}
	go sched.Run(ctx)

	srv := &http.Server{Addr: cfg.ListenAddr, Handler: httpapi.New(prov)}
	go func() {
		<-ctx.Done()
		_ = srv.Shutdown(context.Background())
	}()
	slog.Info("ingestd listening", "addr", cfg.ListenAddr, "provider", prov.Name())
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		slog.Error("server", "err", err)
	}
}
