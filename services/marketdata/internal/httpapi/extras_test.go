package httpapi

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/wealthtrack/marketdata/internal/corpactions"
	"github.com/wealthtrack/marketdata/internal/fx"
	"github.com/wealthtrack/marketdata/internal/news"
	"github.com/wealthtrack/marketdata/internal/provider"
	"github.com/wealthtrack/marketdata/internal/stream"
)

func extrasHandler() http.Handler {
	acts := &ActionStore{}
	acts.Add(corpactions.Action{Symbol: "VTI", Kind: corpactions.Dividend,
		ExDate: time.Now().Add(5 * 24 * time.Hour), Amount: 0.8})
	nw := &NewsStore{}
	nw.Add(news.Item{Symbol: "VTI", Headline: "Record gains", PublishedAt: time.Now()})
	return NewWithDeps(provider.NewMock(), Deps{
		FX:      fx.NewService(fx.StaticSource{"USD": {"EUR": 0.9}}, time.Minute),
		Actions: acts, News: nw, Hub: stream.NewHub(),
	})
}

func TestExtraRoutes(t *testing.T) {
	h := extrasHandler()
	tests := []struct {
		name, url string
		want      int
	}{
		{"fx ok", "/v1/fx?from=USD&to=EUR", 200},
		{"fx unknown", "/v1/fx?from=USD&to=XXX", 400},
		{"convert ok", "/v1/fx/convert?from=USD&to=EUR&amount=10", 200},
		{"convert bad amount", "/v1/fx/convert?from=USD&to=EUR&amount=abc", 400},
		{"dividends", "/v1/dividends?symbol=vti&price=100", 200},
		{"dividends missing symbol", "/v1/dividends", 400},
		{"upcoming", "/v1/corporate-actions/upcoming?days=10", 200},
		{"upcoming bad days", "/v1/corporate-actions/upcoming?days=0", 400},
		{"sentiment", "/v1/news/sentiment?hours=48", 200},
		{"sentiment bad hours", "/v1/news/sentiment?hours=-1", 400},
		{"stream needs symbols", "/v1/stream", 400},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rec := httptest.NewRecorder()
			h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, tc.url, nil))
			if rec.Code != tc.want {
				t.Fatalf("got %d want %d: %s", rec.Code, tc.want, rec.Body.String())
			}
		})
	}
}

func TestExtrasUnmountedWithoutDeps(t *testing.T) {
	rec := httptest.NewRecorder()
	New(provider.NewMock()).ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/fx?from=USD&to=EUR", nil))
	if rec.Code != http.StatusNotFound {
		t.Fatalf("got %d want 404", rec.Code)
	}
}

func TestRateLimit(t *testing.T) {
	h := RateLimit(2, time.Minute)(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {}))
	codes := []int{}
	for i := 0; i < 4; i++ {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "10.0.0.1:1234"
		h.ServeHTTP(rec, req)
		codes = append(codes, rec.Code)
	}
	want := []int{200, 200, 429, 429}
	for i := range want {
		if codes[i] != want[i] {
			t.Fatalf("codes = %v want %v", codes, want)
		}
	}
}

func TestCORS(t *testing.T) {
	h := CORS("https://app.example")(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {}))
	tests := []struct {
		name, origin, method string
		wantHeader           string
		wantCode             int
	}{
		{"allowed", "https://app.example", "GET", "https://app.example", 200},
		{"other origin", "https://evil.example", "GET", "", 200},
		{"preflight", "https://app.example", "OPTIONS", "https://app.example", 204},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rec := httptest.NewRecorder()
			req := httptest.NewRequest(tc.method, "/", nil)
			req.Header.Set("Origin", tc.origin)
			h.ServeHTTP(rec, req)
			if got := rec.Header().Get("Access-Control-Allow-Origin"); got != tc.wantHeader || rec.Code != tc.wantCode {
				t.Errorf("header %q code %d", got, rec.Code)
			}
		})
	}
}
