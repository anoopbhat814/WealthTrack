package alerts

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/wealthtrack/marketdata/internal/provider"
)

type CloseLookup func(ctx context.Context, symbol string) (float64, error)

type Event struct {
	AlertID   string    `json:"alertId"`
	Symbol    string    `json:"symbol"`
	Price     float64   `json:"price"`
	Condition Condition `json:"condition"`
	Threshold float64   `json:"threshold"`
	FiredAt   time.Time `json:"firedAt"`
}

type Engine struct {
	webhook string
	client  *http.Client
	closeFn CloseLookup
}

func NewEngine(webhook string, closeFn CloseLookup) *Engine {
	return &Engine{webhook: webhook, closeFn: closeFn, client: &http.Client{Timeout: 5 * time.Second}}
}

// Evaluate returns the events produced by applying rules to quotes.
func (e *Engine) Evaluate(ctx context.Context, rules []Rule, quotes []provider.Quote) []Event {
	bySymbol := make(map[string]provider.Quote, len(quotes))
	for _, q := range quotes {
		bySymbol[q.Symbol] = q
	}
	var events []Event
	for _, r := range rules {
		q, ok := bySymbol[r.Symbol]
		if !ok {
			continue
		}
		var prev float64
		if r.Condition == PctChangeUp || r.Condition == PctChangeDown {
			prev, _ = e.closeFn(ctx, r.Symbol)
		}
		if r.Triggered(q.Price, prev) {
			events = append(events, Event{r.ID, r.Symbol, q.Price, r.Condition, r.Threshold, time.Now().UTC()})
		}
	}
	return events
}

// Notify posts an event to the web app webhook.
func (e *Engine) Notify(ctx context.Context, ev Event) error {
	body, _ := json.Marshal(ev)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, e.webhook, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := e.client.Do(req)
	if err != nil {
		return fmt.Errorf("webhook: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return fmt.Errorf("webhook returned %s", resp.Status)
	}
	slog.Info("alert delivered", "alert", ev.AlertID, "symbol", ev.Symbol)
	return nil
}
