// Package httpapi exposes read-only quote endpoints and health checks.
package httpapi

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/wealthtrack/marketdata/internal/provider"
)

type Server struct {
	provider provider.Provider
	deps     Deps
}

// New builds the router with only the quote endpoints.
func New(p provider.Provider) http.Handler {
	return NewWithDeps(p, Deps{})
}

// NewWithDeps builds the router and mounts the optional endpoints whose
// dependencies are present (FX, corporate actions, news, streaming).
func NewWithDeps(p provider.Provider, d Deps) http.Handler {
	s := &Server{provider: p, deps: d}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	mux.HandleFunc("GET /v1/quotes", s.quotes)
	s.mountExtras(mux)
	return mux
}

func (s *Server) quotes(w http.ResponseWriter, r *http.Request) {
	raw := r.URL.Query().Get("symbols")
	if raw == "" {
		http.Error(w, "symbols query parameter required", http.StatusBadRequest)
		return
	}
	quotes, err := s.provider.Fetch(r.Context(), strings.Split(raw, ","))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(quotes)
}
