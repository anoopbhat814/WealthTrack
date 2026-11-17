package main

import (
	"strings"
	"testing"

	"github.com/wealthtrack/marketdata/internal/alerts"
)

func TestSummarizeEmpty(t *testing.T) {
	if got := summarize(nil); got != "no alerts fired" {
		t.Fatalf("got %q", got)
	}
}

func TestSummarizeSortsLines(t *testing.T) {
	out := summarize([]alerts.Event{
		{AlertID: "2", Symbol: "TSLA", Condition: alerts.Below, Threshold: 150, Price: 148.2},
		{AlertID: "1", Symbol: "AAPL", Condition: alerts.Above, Threshold: 200, Price: 201.5},
	})
	lines := strings.Split(out, "\n")
	if lines[0] != "2 alert(s) fired" || !strings.HasPrefix(lines[1], "AAPL") {
		t.Fatalf("unexpected summary:\n%s", out)
	}
}
