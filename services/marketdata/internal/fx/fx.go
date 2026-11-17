// Package fx fetches and converts foreign-exchange rates.
package fx

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/wealthtrack/marketdata/internal/cache"
)

// Rate is the price of one unit of Base expressed in Quote.
type Rate struct {
	Base    string    `json:"base"`
	Quote   string    `json:"quote"`
	Rate    float64   `json:"rate"`
	AsOf    time.Time `json:"asOf"`
	Source  string    `json:"source"`
}

// Source loads rates for a base currency.
type Source interface {
	Latest(ctx context.Context, base string) (map[string]float64, error)
}

// Service caches rates and performs conversions, including cross rates via the base.
type Service struct {
	src   Source
	cache *cache.TTL[string, map[string]float64]
	now   func() time.Time
}

func NewService(src Source, ttl time.Duration) *Service {
	return &Service{src: src, cache: cache.NewTTL[string, map[string]float64](ttl), now: time.Now}
}

func (s *Service) table(ctx context.Context, base string) (map[string]float64, error) {
	return s.cache.GetOrLoad(base, func() (map[string]float64, error) {
		return s.src.Latest(ctx, base)
	})
}

// Rate returns the rate from one currency to another.
func (s *Service) Rate(ctx context.Context, from, to string) (Rate, error) {
	from, to = strings.ToUpper(from), strings.ToUpper(to)
	if len(from) != 3 || len(to) != 3 {
		return Rate{}, fmt.Errorf("fx: invalid currency pair %q/%q", from, to)
	}
	r := Rate{Base: from, Quote: to, AsOf: s.now().UTC(), Source: "fx"}
	if from == to {
		r.Rate = 1
		return r, nil
	}
	tbl, err := s.table(ctx, from)
	if err != nil {
		return Rate{}, err
	}
	v, ok := tbl[to]
	if !ok || v <= 0 {
		return Rate{}, fmt.Errorf("fx: no rate for %s/%s", from, to)
	}
	r.Rate = v
	return r, nil
}

// Convert converts amount between currencies.
func (s *Service) Convert(ctx context.Context, amount float64, from, to string) (float64, error) {
	r, err := s.Rate(ctx, from, to)
	if err != nil {
		return 0, err
	}
	return amount * r.Rate, nil
}

// HTTPSource reads rates from a JSON endpoint shaped like {"rates": {"EUR": 0.92}}.
type HTTPSource struct {
	BaseURL string
	Client  *http.Client
}

func (h HTTPSource) Latest(ctx context.Context, base string) (map[string]float64, error) {
	c := h.Client
	if c == nil {
		c = &http.Client{Timeout: 10 * time.Second}
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(h.BaseURL, "/")+"/latest?base="+base, nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("fx: upstream status %d", resp.StatusCode)
	}
	var body struct {
		Rates map[string]float64 `json:"rates"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("fx: decode: %w", err)
	}
	return body.Rates, nil
}

// StaticSource serves fixed tables; useful for tests and the mock provider.
type StaticSource map[string]map[string]float64

func (s StaticSource) Latest(_ context.Context, base string) (map[string]float64, error) {
	t, ok := s[base]
	if !ok {
		return nil, fmt.Errorf("fx: unknown base %s", base)
	}
	return t, nil
}
