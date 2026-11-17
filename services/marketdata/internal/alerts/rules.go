// Package alerts evaluates price alert rules against incoming quotes.
package alerts

import "math"

type Condition string

const (
	Above         Condition = "ABOVE"
	Below         Condition = "BELOW"
	PctChangeUp   Condition = "PCT_CHANGE_UP"
	PctChangeDown Condition = "PCT_CHANGE_DOWN"
)

type Rule struct {
	ID        string
	Symbol    string
	Condition Condition
	Threshold float64
}

// Triggered reports whether the rule fires for the given price and previous close.
func (r Rule) Triggered(price, prevClose float64) bool {
	switch r.Condition {
	case Above:
		return price >= r.Threshold
	case Below:
		return price <= r.Threshold
	case PctChangeUp, PctChangeDown:
		if prevClose <= 0 {
			return false
		}
		change := (price - prevClose) / prevClose * 100
		if r.Condition == PctChangeUp {
			return change >= r.Threshold
		}
		return change <= -math.Abs(r.Threshold)
	}
	return false
}
