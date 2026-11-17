package main

import (
	"reflect"
	"testing"
)

func TestUniqueSymbols(t *testing.T) {
	got := uniqueSymbols([]string{"aapl", "AAPL ", "msft", "", "msft", "VTI"})
	want := []string{"AAPL", "MSFT", "VTI"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v want %v", got, want)
	}
}
