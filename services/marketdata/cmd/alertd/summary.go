package main

import (
	"fmt"
	"sort"
	"strings"

	"github.com/wealthtrack/marketdata/internal/alerts"
)

// summarize renders fired events as a compact, sorted report for cron mail output.
func summarize(events []alerts.Event) string {
	if len(events) == 0 {
		return "no alerts fired"
	}
	lines := make([]string, 0, len(events))
	for _, ev := range events {
		lines = append(lines, fmt.Sprintf("%-6s %-16s threshold=%.2f price=%.2f", ev.Symbol, ev.Condition, ev.Threshold, ev.Price))
	}
	sort.Strings(lines)
	return fmt.Sprintf("%d alert(s) fired\n%s", len(events), strings.Join(lines, "\n"))
}
