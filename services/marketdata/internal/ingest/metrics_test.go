package ingest

import (
	"testing"
	"time"
)

func TestMetricsStale(t *testing.T) {
	var m Metrics
	if !m.Stale(time.Minute) {
		t.Fatal("a fresh Metrics should be stale")
	}
	m.MarkSuccess()
	if m.Stale(time.Minute) {
		t.Fatal("should not be stale right after success")
	}
}
