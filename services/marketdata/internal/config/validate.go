package config

import (
	"errors"
	"fmt"
	"log/slog"
	"net/url"
	"time"
)

// Validate checks cross-field constraints after Load has populated the struct.
func (c *Config) Validate() error {
	var errs []error
	if c.PollInterval < 5*time.Second {
		errs = append(errs, fmt.Errorf("POLL_INTERVAL %s is below the 5s minimum", c.PollInterval))
	}
	if c.Provider == "alphavantage" && c.APIKey == "" {
		errs = append(errs, errors.New("ALPHAVANTAGE_API_KEY is required for the alphavantage provider"))
	}
	if c.WebhookURL != "" {
		u, err := url.Parse(c.WebhookURL)
		if err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
			errs = append(errs, fmt.Errorf("ALERT_WEBHOOK_URL %q is not a valid http(s) URL", c.WebhookURL))
		}
	}
	return errors.Join(errs...)
}

// LogValue implements slog.LogValuer so secrets never reach the logs.
func (c *Config) LogValue() slog.Value {
	return slog.GroupValue(
		slog.String("provider", c.Provider),
		slog.String("listen", c.ListenAddr),
		slog.Duration("poll_interval", c.PollInterval),
		slog.Bool("webhook", c.WebhookURL != ""),
		slog.Bool("api_key_set", c.APIKey != ""),
	)
}
