package provider

import (
	"context"
	"hash/fnv"
	"math"
	"time"
)

// Mock produces deterministic pseudo-random prices for local development.
type Mock struct{ start time.Time }

func NewMock() *Mock { return &Mock{start: time.Now()} }

func (m *Mock) Name() string { return "mock" }

func (m *Mock) Fetch(_ context.Context, symbols []string) ([]Quote, error) {
	t := time.Since(m.start).Minutes()
	out := make([]Quote, 0, len(symbols))
	for _, s := range symbols {
		h := fnv.New32a()
		h.Write([]byte(s))
		base := 20 + float64(h.Sum32()%400)
		price := base * (1 + 0.02*math.Sin(t/5+float64(h.Sum32()%7)))
		out = append(out, Quote{Symbol: s, Price: math.Round(price*100) / 100, Volume: 100000, QuotedAt: time.Now().UTC(), Source: "mock"})
	}
	return out, nil
}
