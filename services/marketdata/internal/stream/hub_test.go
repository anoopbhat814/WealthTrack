package stream

import (
	"testing"

	"github.com/wealthtrack/marketdata/internal/provider"
)

func TestPublishFiltersBySymbol(t *testing.T) {
	h := NewHub()
	a, cancelA := h.Subscribe([]string{"VTI"})
	b, cancelB := h.Subscribe([]string{"BTC", "VTI"})
	defer cancelB()

	tests := []struct {
		name  string
		in    []provider.Quote
		wantN int
	}{
		{"only both", []provider.Quote{{Symbol: "VTI"}}, 2},
		{"only b", []provider.Quote{{Symbol: "BTC"}}, 1},
		{"nobody", []provider.Quote{{Symbol: "GLD"}}, 0},
	}
	for _, tc := range tests {
		if n := h.Publish(tc.in); n != tc.wantN {
			t.Errorf("%s: delivered %d want %d", tc.name, n, tc.wantN)
		}
	}
	if len(a) != 1 || len(b) != 2 {
		t.Errorf("buffered a=%d b=%d", len(a), len(b))
	}
	cancelA()
	cancelA() // idempotent
	if h.Subscribers() != 1 {
		t.Errorf("subscribers = %d", h.Subscribers())
	}
}

func TestSlowSubscriberDoesNotBlock(t *testing.T) {
	h := NewHub()
	_, cancel := h.Subscribe([]string{"X"})
	defer cancel()
	for i := 0; i < 100; i++ {
		h.Publish([]provider.Quote{{Symbol: "X"}})
	}
}
