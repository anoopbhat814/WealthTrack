package provider

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

type AlphaVantage struct {
	apiKey string
	client *http.Client
	base   string
}

func NewAlphaVantage(apiKey string) *AlphaVantage {
	return &AlphaVantage{
		apiKey: apiKey,
		client: &http.Client{Timeout: 10 * time.Second},
		base:   "https://www.alphavantage.co/query",
	}
}

func (a *AlphaVantage) Name() string { return "alphavantage" }

type globalQuote struct {
	GlobalQuote struct {
		Symbol string `json:"01. symbol"`
		Price  string `json:"05. price"`
		Volume string `json:"06. volume"`
	} `json:"Global Quote"`
}

func (a *AlphaVantage) Fetch(ctx context.Context, symbols []string) ([]Quote, error) {
	out := make([]Quote, 0, len(symbols))
	for _, sym := range symbols {
		q := url.Values{"function": {"GLOBAL_QUOTE"}, "symbol": {sym}, "apikey": {a.apiKey}}
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, a.base+"?"+q.Encode(), nil)
		if err != nil {
			return nil, err
		}
		resp, err := a.client.Do(req)
		if err != nil {
			return nil, fmt.Errorf("fetch %s: %w", sym, err)
		}
		var body globalQuote
		err = json.NewDecoder(resp.Body).Decode(&body)
		resp.Body.Close()
		if err != nil {
			return nil, fmt.Errorf("decode %s: %w", sym, err)
		}
		price, perr := strconv.ParseFloat(body.GlobalQuote.Price, 64)
		if perr != nil {
			continue // symbol unknown or rate limited; skip rather than fail the batch
		}
		vol, _ := strconv.ParseInt(body.GlobalQuote.Volume, 10, 64)
		out = append(out, Quote{Symbol: sym, Price: price, Volume: vol, QuotedAt: time.Now().UTC(), Source: a.Name()})
	}
	return out, nil
}
