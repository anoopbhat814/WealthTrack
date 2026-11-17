// Package config loads service configuration from the environment.
package config

import (
	"fmt"
	"os"
	"strings"
	"time"
)

type Config struct {
	DatabaseURL  string
	Provider     string
	APIKey       string
	PollInterval time.Duration
	WebhookURL   string
	ListenAddr   string
}

func Load() (*Config, error) {
	c := &Config{
		DatabaseURL: os.Getenv("DATABASE_URL"),
		Provider:    getenv("MARKET_PROVIDER", "alphavantage"),
		APIKey:      os.Getenv("ALPHAVANTAGE_API_KEY"),
		WebhookURL:  os.Getenv("ALERT_WEBHOOK_URL"),
		ListenAddr:  getenv("LISTEN_ADDR", ":8080"),
	}
	interval, err := time.ParseDuration(getenv("POLL_INTERVAL", "60s"))
	if err != nil {
		return nil, fmt.Errorf("invalid POLL_INTERVAL: %w", err)
	}
	c.PollInterval = interval
	if strings.TrimSpace(c.DatabaseURL) == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}
	return c, nil
}

func getenv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
