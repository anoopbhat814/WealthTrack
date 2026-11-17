package corpactions

import (
	"math"
	"strings"
	"testing"
	"time"
)

func day(s string) time.Time {
	t, _ := time.Parse("2006-01-02", s)
	return t
}

func TestParse(t *testing.T) {
	tests := []struct {
		name    string
		in      string
		want    int
		wantErr bool
	}{
		{"header and rows", "symbol,kind,exDate,amount\nvti,dividend,2024-03-22,0.78\nnvda,split,2024-06-10,10\n", 2, false},
		{"bad kind", "VTI,merger,2024-03-22,1\n", 0, true},
		{"bad date keeps good rows", "VTI,DIVIDEND,22/03/2024,1\nBND,DIVIDEND,2024-04-01,0.2\n", 1, true},
		{"short row", "VTI,DIVIDEND\n", 0, true},
		{"non-positive amount", "VTI,DIVIDEND,2024-03-22,-1\n", 0, true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Parse(strings.NewReader(tc.in))
			if (err != nil) != tc.wantErr || len(got) != tc.want {
				t.Fatalf("got %d rows, err %v", len(got), err)
			}
		})
	}
}

func TestSplitFactorAndYield(t *testing.T) {
	acts := []Action{
		{"NVDA", Split, day("2024-06-10"), 10},
		{"NVDA", Split, day("2021-07-20"), 4},
		{"VTI", Dividend, day("2024-03-22"), 0.8},
		{"VTI", Dividend, day("2023-12-27"), 0.9},
		{"VTI", Dividend, day("2022-12-27"), 5},
	}
	if f := SplitFactor(acts, "NVDA", day("2021-01-01")); f != 40 {
		t.Errorf("factor = %v want 40", f)
	}
	if f := SplitFactor(acts, "NVDA", day("2024-07-01")); f != 1 {
		t.Errorf("factor = %v want 1", f)
	}
	y := TrailingYield(acts, "VTI", day("2024-06-30"), 100)
	if math.Abs(y-0.017) > 1e-9 {
		t.Errorf("yield = %v want 0.017", y)
	}
	if TrailingYield(acts, "VTI", day("2024-06-30"), 0) != 0 {
		t.Error("zero price should give zero yield")
	}
}

func TestUpcoming(t *testing.T) {
	acts := []Action{
		{"B", Dividend, day("2024-07-10"), 1},
		{"A", Dividend, day("2024-07-03"), 1},
		{"C", Dividend, day("2024-09-01"), 1},
	}
	got := Upcoming(acts, day("2024-07-01"), 14*24*time.Hour)
	if len(got) != 2 || got[0].Symbol != "A" {
		t.Errorf("unexpected %+v", got)
	}
}
