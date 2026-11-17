package cache

import (
	"errors"
	"testing"
	"time"
)

func TestTTLExpiry(t *testing.T) {
	now := time.Date(2024, 6, 1, 0, 0, 0, 0, time.UTC)
	c := NewTTL[string, int](time.Minute)
	c.now = func() time.Time { return now }
	c.Set("a", 1)

	tests := []struct {
		name    string
		advance time.Duration
		wantOK  bool
	}{
		{"fresh", 30 * time.Second, true},
		{"at expiry", 30 * time.Second, false},
	}
	for _, tc := range tests {
		now = now.Add(tc.advance)
		if _, ok := c.Get("a"); ok != tc.wantOK {
			t.Errorf("%s: ok=%v want %v", tc.name, ok, tc.wantOK)
		}
	}
	if n := c.Purge(); n != 1 || c.Len() != 0 {
		t.Errorf("purge removed %d, len %d", n, c.Len())
	}
}

func TestGetOrLoad(t *testing.T) {
	c := NewTTL[string, int](time.Hour)
	calls := 0
	load := func() (int, error) { calls++; return 7, nil }
	for i := 0; i < 3; i++ {
		if v, err := c.GetOrLoad("k", load); err != nil || v != 7 {
			t.Fatalf("got %d, %v", v, err)
		}
	}
	if calls != 1 {
		t.Errorf("loader called %d times", calls)
	}
	boom := errors.New("boom")
	if _, err := c.GetOrLoad("bad", func() (int, error) { return 0, boom }); !errors.Is(err, boom) {
		t.Errorf("err = %v", err)
	}
	if _, ok := c.Get("bad"); ok {
		t.Error("error result was cached")
	}
}
