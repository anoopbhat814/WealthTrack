package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/wealthtrack/marketdata/internal/provider"
)

func TestHealthz(t *testing.T) {
	h := New(provider.NewMock())
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/healthz", nil))
	if rec.Code != http.StatusOK || rec.Body.String() != "ok" {
		t.Fatalf("unexpected response: %d %q", rec.Code, rec.Body.String())
	}
}

func TestQuotesRequiresSymbols(t *testing.T) {
	h := New(provider.NewMock())
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/quotes", nil))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("got %d want 400", rec.Code)
	}
}

func TestQuotesReturnsOnePerSymbol(t *testing.T) {
	h := New(provider.NewMock())
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/quotes?symbols=VTI,BND,AAPL", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("got %d want 200", rec.Code)
	}
	var quotes []provider.Quote
	if err := json.NewDecoder(rec.Body).Decode(&quotes); err != nil {
		t.Fatal(err)
	}
	if len(quotes) != 3 {
		t.Fatalf("got %d quotes want 3", len(quotes))
	}
}
