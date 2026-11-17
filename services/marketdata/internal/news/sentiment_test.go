package news

import (
	"testing"
	"time"
)

func TestScore(t *testing.T) {
	tests := []struct {
		name     string
		headline string
		sign     int
	}{
		{"positive", "Company beats estimates, record profit", 1},
		{"negative", "Shares plunge after fraud probe", -1},
		{"negation flips", "Results did not beat expectations", -1},
		{"neutral", "Company announces annual meeting", 0},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			s := Score(tc.headline)
			if s < -1 || s > 1 {
				t.Fatalf("score %v out of range", s)
			}
			switch {
			case tc.sign > 0 && s <= 0, tc.sign < 0 && s >= 0, tc.sign == 0 && s != 0:
				t.Errorf("score %v has wrong sign for %q", s, tc.headline)
			}
		})
	}
}

func TestSummarize(t *testing.T) {
	now := time.Now()
	items := []Item{
		{Symbol: "VTI", PublishedAt: now, Score: 0.8},
		{Symbol: "VTI", PublishedAt: now, Score: 0.4},
		{Symbol: "BTC", PublishedAt: now, Score: -0.6},
		{Symbol: "BTC", PublishedAt: now.Add(-72 * time.Hour), Score: 0.9},
	}
	got := Summarize(items, now.Add(-24*time.Hour))
	if len(got) != 2 || got[0].Symbol != "BTC" || got[0].Count != 1 || got[0].Label != "negative" {
		t.Fatalf("unexpected %+v", got)
	}
	if got[1].Label != "positive" {
		t.Errorf("VTI label %q", got[1].Label)
	}
}
