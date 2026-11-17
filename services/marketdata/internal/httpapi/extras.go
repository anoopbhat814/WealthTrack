package httpapi

import (
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/wealthtrack/marketdata/internal/corpactions"
	"github.com/wealthtrack/marketdata/internal/fx"
	"github.com/wealthtrack/marketdata/internal/news"
	"github.com/wealthtrack/marketdata/internal/stream"
)

// Deps are the optional services behind the extended endpoints. A nil field
// leaves the corresponding routes unmounted.
type Deps struct {
	FX      *fx.Service
	Actions *ActionStore
	News    *NewsStore
	Hub     *stream.Hub
}

// ActionStore is a concurrency-safe in-memory list of corporate actions.
type ActionStore struct {
	mu      sync.RWMutex
	actions []corpactions.Action
}

func (a *ActionStore) Add(acts ...corpactions.Action) {
	a.mu.Lock()
	a.actions = append(a.actions, acts...)
	a.mu.Unlock()
}

func (a *ActionStore) All() []corpactions.Action {
	a.mu.RLock()
	defer a.mu.RUnlock()
	return append([]corpactions.Action(nil), a.actions...)
}

// NewsStore keeps scored headlines.
type NewsStore struct {
	mu    sync.RWMutex
	items []news.Item
}

func (n *NewsStore) Add(it news.Item) {
	it.Score = news.Score(it.Headline)
	n.mu.Lock()
	n.items = append(n.items, it)
	n.mu.Unlock()
}

func (n *NewsStore) Items() []news.Item {
	n.mu.RLock()
	defer n.mu.RUnlock()
	return append([]news.Item(nil), n.items...)
}

func (s *Server) mountExtras(mux *http.ServeMux) {
	if s.deps.FX != nil {
		mux.HandleFunc("GET /v1/fx", s.fxRate)
		mux.HandleFunc("GET /v1/fx/convert", s.fxConvert)
	}
	if s.deps.Actions != nil {
		mux.HandleFunc("GET /v1/dividends", s.dividends)
		mux.HandleFunc("GET /v1/corporate-actions/upcoming", s.upcomingActions)
	}
	if s.deps.News != nil {
		mux.HandleFunc("GET /v1/news/sentiment", s.sentiment)
	}
	if s.deps.Hub != nil {
		mux.Handle("GET /v1/stream", s.deps.Hub.Handler(splitSymbols))
	}
}

func splitSymbols(raw string) []string {
	var out []string
	for _, p := range strings.Split(raw, ",") {
		if p = strings.ToUpper(strings.TrimSpace(p)); p != "" {
			out = append(out, p)
		}
	}
	return out
}

func (s *Server) fxRate(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	rate, err := s.deps.FX.Rate(r.Context(), q.Get("from"), q.Get("to"))
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, rate)
}

func (s *Server) fxConvert(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	amount, err := strconv.ParseFloat(q.Get("amount"), 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "amount must be a number")
		return
	}
	out, err := s.deps.FX.Convert(r.Context(), amount, q.Get("from"), q.Get("to"))
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"from": strings.ToUpper(q.Get("from")), "to": strings.ToUpper(q.Get("to")),
		"amount": amount, "result": out,
	})
}

func (s *Server) dividends(w http.ResponseWriter, r *http.Request) {
	sym := strings.ToUpper(r.URL.Query().Get("symbol"))
	if sym == "" {
		writeError(w, http.StatusBadRequest, "symbol query parameter required")
		return
	}
	var divs []corpactions.Action
	for _, a := range s.deps.Actions.All() {
		if a.Symbol == sym && a.Kind == corpactions.Dividend {
			divs = append(divs, a)
		}
	}
	resp := map[string]any{"symbol": sym, "dividends": divs}
	if p, err := strconv.ParseFloat(r.URL.Query().Get("price"), 64); err == nil && p > 0 {
		resp["trailingYield"] = corpactions.TrailingYield(divs, sym, time.Now(), p)
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *Server) upcomingActions(w http.ResponseWriter, r *http.Request) {
	days := 30
	if v := r.URL.Query().Get("days"); v != "" {
		n, err := strconv.Atoi(v)
		if err != nil || n < 1 || n > 365 {
			writeError(w, http.StatusBadRequest, "days must be between 1 and 365")
			return
		}
		days = n
	}
	writeJSON(w, http.StatusOK, corpactions.Upcoming(s.deps.Actions.All(), time.Now(), time.Duration(days)*24*time.Hour))
}

func (s *Server) sentiment(w http.ResponseWriter, r *http.Request) {
	hours := 24
	if v := r.URL.Query().Get("hours"); v != "" {
		n, err := strconv.Atoi(v)
		if err != nil || n < 1 {
			writeError(w, http.StatusBadRequest, "hours must be a positive integer")
			return
		}
		hours = n
	}
	since := time.Now().Add(-time.Duration(hours) * time.Hour)
	writeJSON(w, http.StatusOK, news.Summarize(s.deps.News.Items(), since))
}
