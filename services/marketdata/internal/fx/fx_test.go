package fx

import (
	"context"
	"math"
	"testing"
	"time"
)

func TestConvert(t *testing.T) {
	svc := NewService(StaticSource{
		"USD": {"EUR": 0.9, "JPY": 150},
	}, time.Minute)
	tests := []struct {
		name     string
		amount   float64
		from, to string
		want     float64
		wantErr  bool
	}{
		{"same currency", 10, "usd", "USD", 10, false},
		{"usd to eur", 100, "USD", "EUR", 90, false},
		{"usd to jpy", 2, "USD", "JPY", 300, false},
		{"missing quote", 1, "USD", "CHF", 0, true},
		{"unknown base", 1, "GBP", "USD", 0, true},
		{"bad code", 1, "US", "EUR", 0, true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := svc.Convert(context.Background(), tc.amount, tc.from, tc.to)
			if (err != nil) != tc.wantErr {
				t.Fatalf("err = %v, wantErr %v", err, tc.wantErr)
			}
			if !tc.wantErr && math.Abs(got-tc.want) > 1e-9 {
				t.Errorf("got %v want %v", got, tc.want)
			}
		})
	}
}
