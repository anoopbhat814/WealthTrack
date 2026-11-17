package ingest

import (
	"testing"
	"time"
)

func TestBackoffGrowsAndCaps(t *testing.T) {
	b := Backoff{Base: time.Second, Max: 8 * time.Second}
	want := []time.Duration{time.Second, 2 * time.Second, 4 * time.Second, 8 * time.Second, 8 * time.Second}
	for i, w := range want {
		if got := b.Delay(i); got != w {
			t.Fatalf("attempt %d: got %s want %s", i, got, w)
		}
	}
}

func TestBackoffJitterStaysInBounds(t *testing.T) {
	b := Backoff{Base: 10 * time.Second, Max: time.Minute, Jitter: 0.2}
	for i := 0; i < 100; i++ {
		d := b.Delay(0)
		if d < 8*time.Second || d > 12*time.Second {
			t.Fatalf("delay %s outside jitter bounds", d)
		}
	}
}
