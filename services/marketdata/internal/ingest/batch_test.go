package ingest

import (
	"reflect"
	"testing"
)

func TestBatchesDedupesAndChunks(t *testing.T) {
	got := Batches([]string{"VTI", "AAPL", "VTI", "", "BND", "MSFT", "NVDA", "GLD"}, 3)
	want := [][]string{{"AAPL", "BND", "GLD"}, {"MSFT", "NVDA", "VTI"}}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v want %v", got, want)
	}
}

func TestBatchesDefaultSize(t *testing.T) {
	syms := []string{"A", "B", "C", "D", "E", "F"}
	if got := Batches(syms, 0); len(got) != 2 || len(got[0]) != maxSymbolsPerRequest {
		t.Fatalf("unexpected batches %v", got)
	}
}

func TestBatchesEmpty(t *testing.T) {
	if got := Batches(nil, 3); len(got) != 0 {
		t.Fatalf("expected no batches, got %v", got)
	}
}
