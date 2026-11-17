package alerts

import "testing"

func TestRuleTriggered(t *testing.T) {
	cases := []struct {
		name  string
		rule  Rule
		price float64
		prev  float64
		want  bool
	}{
		{"above hit", Rule{Condition: Above, Threshold: 100}, 101, 0, true},
		{"above miss", Rule{Condition: Above, Threshold: 100}, 99.9, 0, false},
		{"below hit", Rule{Condition: Below, Threshold: 50}, 49, 0, true},
		{"pct up hit", Rule{Condition: PctChangeUp, Threshold: 5}, 105.5, 100, true},
		{"pct down hit", Rule{Condition: PctChangeDown, Threshold: 5}, 94, 100, true},
		{"pct without prev", Rule{Condition: PctChangeUp, Threshold: 5}, 200, 0, false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := c.rule.Triggered(c.price, c.prev); got != c.want {
				t.Fatalf("got %v want %v", got, c.want)
			}
		})
	}
}
