// Package stream broadcasts live price updates to server-sent-event clients.
package stream

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/wealthtrack/marketdata/internal/provider"
)

// Hub fans quotes out to subscribers. Slow subscribers drop updates rather than block.
type Hub struct {
	mu   sync.Mutex
	subs map[chan provider.Quote]map[string]bool
}

func NewHub() *Hub {
	return &Hub{subs: make(map[chan provider.Quote]map[string]bool)}
}

// Subscribe registers interest in the given symbols; call the returned func to unsubscribe.
func (h *Hub) Subscribe(symbols []string) (<-chan provider.Quote, func()) {
	ch := make(chan provider.Quote, 32)
	set := make(map[string]bool, len(symbols))
	for _, s := range symbols {
		set[s] = true
	}
	h.mu.Lock()
	h.subs[ch] = set
	h.mu.Unlock()
	return ch, func() {
		h.mu.Lock()
		if _, ok := h.subs[ch]; ok {
			delete(h.subs, ch)
			close(ch)
		}
		h.mu.Unlock()
	}
}

// Publish delivers quotes to matching subscribers and returns the delivery count.
func (h *Hub) Publish(quotes []provider.Quote) int {
	h.mu.Lock()
	defer h.mu.Unlock()
	n := 0
	for _, q := range quotes {
		for ch, set := range h.subs {
			if !set[q.Symbol] {
				continue
			}
			select {
			case ch <- q:
				n++
			default:
			}
		}
	}
	return n
}

// Subscribers reports the number of active subscriptions.
func (h *Hub) Subscribers() int {
	h.mu.Lock()
	defer h.mu.Unlock()
	return len(h.subs)
}

// Handler serves a text/event-stream of quotes for ?symbols=A,B with periodic keep-alives.
func (h *Hub) Handler(parse func(string) []string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fl, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "streaming unsupported", http.StatusInternalServerError)
			return
		}
		symbols := parse(r.URL.Query().Get("symbols"))
		if len(symbols) == 0 {
			http.Error(w, "symbols query parameter required", http.StatusBadRequest)
			return
		}
		ch, cancel := h.Subscribe(symbols)
		defer cancel()
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		fl.Flush()
		tick := time.NewTicker(15 * time.Second)
		defer tick.Stop()
		for {
			select {
			case <-r.Context().Done():
				return
			case <-tick.C:
				fmt.Fprint(w, ": keep-alive\n\n")
				fl.Flush()
			case q, open := <-ch:
				if !open {
					return
				}
				b, _ := json.Marshal(q)
				fmt.Fprintf(w, "event: quote\ndata: %s\n\n", b)
				fl.Flush()
			}
		}
	}
}
