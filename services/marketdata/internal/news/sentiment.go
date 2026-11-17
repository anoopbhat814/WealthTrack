// Package news scores headlines and aggregates sentiment per symbol.
package news

import (
	"sort"
	"strings"
	"time"
	"unicode"
)

type Item struct {
	Symbol      string    `json:"symbol"`
	Headline    string    `json:"headline"`
	URL         string    `json:"url,omitempty"`
	PublishedAt time.Time `json:"publishedAt"`
	Score       float64   `json:"score"`
}

var positive = map[string]float64{
	"beat": 1, "beats": 1, "surge": 1.5, "surges": 1.5, "record": 1, "upgrade": 1.2,
	"growth": 0.8, "profit": 0.8, "rally": 1.2, "gain": 0.7, "gains": 0.7, "strong": 0.8,
}

var negative = map[string]float64{
	"miss": -1, "misses": -1, "plunge": -1.5, "plunges": -1.5, "downgrade": -1.2, "loss": -0.8,
	"losses": -0.8, "lawsuit": -1, "probe": -0.9, "weak": -0.8, "fraud": -2, "bankruptcy": -2,
}

var negators = map[string]bool{"not": true, "no": true, "never": true, "without": true}

// Score returns a sentiment in [-1, 1] using a small lexicon with negation handling.
func Score(headline string) float64 {
	words := strings.FieldsFunc(strings.ToLower(headline), func(r rune) bool {
		return !unicode.IsLetter(r) && r != '\''
	})
	total := 0.0
	for i, w := range words {
		v, ok := positive[w]
		if !ok {
			v, ok = negative[w]
		}
		if !ok {
			continue
		}
		if i > 0 && negators[words[i-1]] {
			v = -v
		}
		total += v
	}
	// squash to [-1, 1] without importing math
	return total / (1 + abs(total))
}

func abs(f float64) float64 {
	if f < 0 {
		return -f
	}
	return f
}

// Summary aggregates sentiment for a symbol over a window.
type Summary struct {
	Symbol   string  `json:"symbol"`
	Count    int     `json:"count"`
	Mean     float64 `json:"mean"`
	Label    string  `json:"label"`
}

// Summarize groups items by symbol, ignoring those older than since.
func Summarize(items []Item, since time.Time) []Summary {
	type acc struct {
		sum float64
		n   int
	}
	by := map[string]*acc{}
	for _, it := range items {
		if it.PublishedAt.Before(since) {
			continue
		}
		a := by[it.Symbol]
		if a == nil {
			a = &acc{}
			by[it.Symbol] = a
		}
		a.sum += it.Score
		a.n++
	}
	out := make([]Summary, 0, len(by))
	for sym, a := range by {
		m := a.sum / float64(a.n)
		out = append(out, Summary{Symbol: sym, Count: a.n, Mean: m, Label: label(m)})
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Symbol < out[j].Symbol })
	return out
}

func label(m float64) string {
	switch {
	case m >= 0.25:
		return "positive"
	case m <= -0.25:
		return "negative"
	default:
		return "neutral"
	}
}
