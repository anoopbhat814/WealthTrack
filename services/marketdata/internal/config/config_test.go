package config

import (
	"testing"
	"time"
)

func TestLoadDefaults(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://wt:pw@localhost:5432/wealthtrack")
	t.Setenv("POLL_INTERVAL", "")
	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.PollInterval != 60*time.Second || cfg.ListenAddr != ":8080" || cfg.Provider != "alphavantage" {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
}

func TestLoadRequiresDatabaseURL(t *testing.T) {
	t.Setenv("DATABASE_URL", "  ")
	if _, err := Load(); err == nil {
		t.Fatal("expected an error when DATABASE_URL is blank")
	}
}

func TestLoadRejectsBadInterval(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x")
	t.Setenv("POLL_INTERVAL", "soon")
	if _, err := Load(); err == nil {
		t.Fatal("expected a parse error")
	}
}

func TestValidate(t *testing.T) {
	cfg := &Config{Provider: "alphavantage", PollInterval: time.Second, WebhookURL: "ftp://example.com"}
	err := cfg.Validate()
	if err == nil {
		t.Fatal("expected validation errors")
	}
	ok := &Config{Provider: "mock", PollInterval: time.Minute, WebhookURL: "https://app.example.com/api/alerts/webhook"}
	if err := ok.Validate(); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestGetenvBool(t *testing.T) {
	t.Setenv("WT_FLAG", "Yes")
	if !getenvBool("WT_FLAG", false) {
		t.Fatal("expected true")
	}
	t.Setenv("WT_FLAG", "maybe")
	if !getenvBool("WT_FLAG", true) {
		t.Fatal("expected fallback for unrecognised values")
	}
}
