// Package provider defines the quote source abstraction.
package provider

import (
	"context"
	"fmt"
	"time"
)

type Quote struct {
	Symbol   string
	Price    float64
	Volume   int64
	QuotedAt time.Time
	Source   string
}

type Provider interface {
	Name() string
	Fetch(ctx context.Context, symbols []string) ([]Quote, error)
}

// New returns a provider by name.
func New(name, apiKey string) (Provider, error) {
	switch name {
	case "alphavantage":
		return NewAlphaVantage(apiKey), nil
	case "mock":
		return NewMock(), nil
	default:
		return nil, fmt.Errorf("unknown provider %q", name)
	}
}
