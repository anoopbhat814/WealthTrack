package ingest

import (
	"math/rand"
	"time"
)

// Backoff computes exponential delays with jitter for retrying provider calls.
type Backoff struct {
	Base   time.Duration
	Max    time.Duration
	Jitter float64 // fraction of the delay, 0..1
}

func DefaultBackoff() Backoff {
	return Backoff{Base: 2 * time.Second, Max: 2 * time.Minute, Jitter: 0.2}
}

// Delay returns the wait before retry number attempt (starting at 0).
func (b Backoff) Delay(attempt int) time.Duration {
	d := b.Base
	for i := 0; i < attempt && d < b.Max; i++ {
		d *= 2
	}
	if d > b.Max {
		d = b.Max
	}
	if b.Jitter > 0 {
		spread := float64(d) * b.Jitter
		d += time.Duration((rand.Float64()*2 - 1) * spread)
	}
	return d
}
