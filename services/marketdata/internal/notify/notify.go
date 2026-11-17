// Package notify delivers alert notifications over pluggable channels.
package notify

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/smtp"
	"strings"
	"time"
)

// Message is a notification payload.
type Message struct {
	UserID  string    `json:"userId"`
	Title   string    `json:"title"`
	Body    string    `json:"body"`
	Symbol  string    `json:"symbol,omitempty"`
	SentAt  time.Time `json:"sentAt"`
}

// Notifier delivers a message through one channel.
type Notifier interface {
	Channel() string
	Notify(ctx context.Context, m Message) error
}

// Webhook posts JSON to a URL and signs the body with HMAC-SHA256.
type Webhook struct {
	URL    string
	Secret string
	Client *http.Client
}

func (w Webhook) Channel() string { return "webhook" }

func (w Webhook) Notify(ctx context.Context, m Message) error {
	body, err := json.Marshal(m)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, w.URL, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	if w.Secret != "" {
		req.Header.Set("X-WealthTrack-Signature", Sign(w.Secret, body))
	}
	c := w.Client
	if c == nil {
		c = &http.Client{Timeout: 5 * time.Second}
	}
	resp, err := c.Do(req)
	if err != nil {
		return fmt.Errorf("webhook: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode/100 != 2 {
		return fmt.Errorf("webhook: status %d", resp.StatusCode)
	}
	return nil
}

// Sign returns the hex HMAC-SHA256 of body.
func Sign(secret string, body []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	return hex.EncodeToString(mac.Sum(nil))
}

// Email sends plain-text mail over SMTP.
type Email struct {
	Addr string // host:port
	From string
	To   []string
	Auth smtp.Auth
	// Send is swappable for tests; defaults to smtp.SendMail.
	Send func(addr string, a smtp.Auth, from string, to []string, msg []byte) error
}

func (e Email) Channel() string { return "email" }

func (e Email) Notify(_ context.Context, m Message) error {
	if len(e.To) == 0 {
		return errors.New("email: no recipients")
	}
	send := e.Send
	if send == nil {
		send = smtp.SendMail
	}
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s\r\n",
		e.From, strings.Join(e.To, ", "), sanitizeHeader(m.Title), m.Body)
	return send(e.Addr, e.Auth, e.From, e.To, []byte(msg))
}

func sanitizeHeader(s string) string {
	return strings.NewReplacer("\r", " ", "\n", " ").Replace(s)
}

// Multi fans a message out to all notifiers and joins any errors.
type Multi []Notifier

func (m Multi) Channel() string { return "multi" }

func (m Multi) Notify(ctx context.Context, msg Message) error {
	var errs []error
	for _, n := range m {
		if err := n.Notify(ctx, msg); err != nil {
			errs = append(errs, fmt.Errorf("%s: %w", n.Channel(), err))
		}
	}
	return errors.Join(errs...)
}
