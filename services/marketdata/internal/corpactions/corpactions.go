// Package corpactions ingests dividends and splits and adjusts prices for them.
package corpactions

import (
	"encoding/csv"
	"fmt"
	"io"
	"sort"
	"strconv"
	"strings"
	"time"
)

type Kind string

const (
	Dividend Kind = "DIVIDEND"
	Split    Kind = "SPLIT"
)

// Action is a single corporate action for a symbol.
type Action struct {
	Symbol string
	Kind   Kind
	ExDate time.Time
	// Amount is cash per share for dividends; for splits it is the share ratio (2 means 2-for-1).
	Amount float64
}

// Parse reads rows of "symbol,kind,exDate,amount" (header optional). Bad rows are
// reported together while valid rows are still returned.
func Parse(r io.Reader) ([]Action, error) {
	cr := csv.NewReader(r)
	cr.FieldsPerRecord = -1
	cr.TrimLeadingSpace = true
	var out []Action
	var bad []string
	for line := 1; ; line++ {
		rec, err := cr.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return out, err
		}
		if line == 1 && strings.EqualFold(rec[0], "symbol") {
			continue
		}
		a, err := parseRow(rec)
		if err != nil {
			bad = append(bad, fmt.Sprintf("line %d: %v", line, err))
			continue
		}
		out = append(out, a)
	}
	if len(bad) > 0 {
		return out, fmt.Errorf("corpactions: %d bad rows: %s", len(bad), strings.Join(bad, "; "))
	}
	return out, nil
}

func parseRow(rec []string) (Action, error) {
	if len(rec) < 4 {
		return Action{}, fmt.Errorf("want 4 fields, got %d", len(rec))
	}
	kind := Kind(strings.ToUpper(strings.TrimSpace(rec[1])))
	if kind != Dividend && kind != Split {
		return Action{}, fmt.Errorf("unknown kind %q", rec[1])
	}
	d, err := time.Parse("2006-01-02", strings.TrimSpace(rec[2]))
	if err != nil {
		return Action{}, fmt.Errorf("bad date: %w", err)
	}
	amt, err := strconv.ParseFloat(strings.TrimSpace(rec[3]), 64)
	if err != nil || amt <= 0 {
		return Action{}, fmt.Errorf("bad amount %q", rec[3])
	}
	return Action{Symbol: strings.ToUpper(strings.TrimSpace(rec[0])), Kind: kind, ExDate: d, Amount: amt}, nil
}

// SplitFactor returns the cumulative factor to divide a price quoted before asOf
// by, accounting for every split with an ex-date after the price date.
func SplitFactor(actions []Action, symbol string, priceDate time.Time) float64 {
	f := 1.0
	for _, a := range actions {
		if a.Kind == Split && a.Symbol == symbol && a.ExDate.After(priceDate) {
			f *= a.Amount
		}
	}
	return f
}

// TrailingYield sums dividends over the 12 months to asOf and divides by price.
func TrailingYield(actions []Action, symbol string, asOf time.Time, price float64) float64 {
	if price <= 0 {
		return 0
	}
	from := asOf.AddDate(-1, 0, 0)
	sum := 0.0
	for _, a := range actions {
		if a.Kind == Dividend && a.Symbol == symbol && a.ExDate.After(from) && !a.ExDate.After(asOf) {
			sum += a.Amount
		}
	}
	return sum / price
}

// Upcoming returns actions with an ex-date in [now, now+window], soonest first.
func Upcoming(actions []Action, now time.Time, window time.Duration) []Action {
	var out []Action
	end := now.Add(window)
	for _, a := range actions {
		if !a.ExDate.Before(now) && !a.ExDate.After(end) {
			out = append(out, a)
		}
	}
	sort.Slice(out, func(i, j int) bool { return out[i].ExDate.Before(out[j].ExDate) })
	return out
}
