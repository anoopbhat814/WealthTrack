package main

import (
	"io"
	"strings"
	"testing"
)

func TestParseOptions(t *testing.T) {
	o, err := parseOptions([]string{"-version", "-log-level", "debug"}, io.Discard)
	if err != nil {
		t.Fatal(err)
	}
	if !o.ShowVersion || o.LogLevel != "debug" {
		t.Fatalf("unexpected options %+v", o)
	}
}

func TestParseOptionsRejectsBadLevel(t *testing.T) {
	if _, err := parseOptions([]string{"-log-level", "loud"}, io.Discard); err == nil {
		t.Fatal("expected an error")
	}
}

func TestVersionString(t *testing.T) {
	if !strings.HasPrefix(versionString(), "ingestd ") {
		t.Fatalf("unexpected version string %q", versionString())
	}
}
