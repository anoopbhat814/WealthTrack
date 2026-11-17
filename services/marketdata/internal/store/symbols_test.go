package store

import (
	"reflect"
	"testing"
)

func TestNormalizeSymbols(t *testing.T) {
	got := NormalizeSymbols([]string{" vti", "BND ", "vti", "", "aapl"})
	want := []string{"AAPL", "BND", "VTI"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v want %v", got, want)
	}
}

func TestNormalizeSymbolsEmpty(t *testing.T) {
	if got := NormalizeSymbols(nil); len(got) != 0 {
		t.Fatalf("expected empty result, got %v", got)
	}
}
