package ingest

import (
	"sync/atomic"
	"time"
)

// Metrics holds lightweight counters exposed in logs and the debug endpoint.
type Metrics struct {
	Ticks        atomic.Int64
	QuotesSaved  atomic.Int64
	FetchErrors  atomic.Int64
	AlertsFired  atomic.Int64
	lastSuccess  atomic.Int64 // unix nanoseconds
}

func (m *Metrics) MarkSuccess() { m.lastSuccess.Store(time.Now().UnixNano()) }

// Stale reports whether no tick has succeeded within the given window.
func (m *Metrics) Stale(window time.Duration) bool {
	last := m.lastSuccess.Load()
	if last == 0 {
		return true
	}
	return time.Since(time.Unix(0, last)) > window
}
