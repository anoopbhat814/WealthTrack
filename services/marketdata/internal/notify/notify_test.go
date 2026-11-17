package notify

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/smtp"
	"strings"
	"testing"
)

type fake struct {
	name string
	err  error
	got  int
}

func (f *fake) Channel() string                         { return f.name }
func (f *fake) Notify(context.Context, Message) error { f.got++; return f.err }

func TestWebhookSignsBody(t *testing.T) {
	var sig string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sig = r.Header.Get("X-WealthTrack-Signature")
		w.WriteHeader(http.StatusNoContent)
	}))
	defer srv.Close()
	if err := (Webhook{URL: srv.URL, Secret: "s3"}).Notify(context.Background(), Message{Title: "t"}); err != nil {
		t.Fatal(err)
	}
	if len(sig) != 64 {
		t.Errorf("signature %q", sig)
	}
}

func TestWebhookStatusErrors(t *testing.T) {
	tests := []struct {
		status  int
		wantErr bool
	}{{200, false}, {204, false}, {400, true}, {500, true}}
	for _, tc := range tests {
		srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(tc.status) }))
		err := Webhook{URL: srv.URL}.Notify(context.Background(), Message{})
		srv.Close()
		if (err != nil) != tc.wantErr {
			t.Errorf("status %d: err=%v", tc.status, err)
		}
	}
}

func TestEmailSanitizesSubject(t *testing.T) {
	var sent string
	e := Email{From: "a@x", To: []string{"b@x"}, Send: func(_ string, _ smtp.Auth, _ string, _ []string, msg []byte) error {
		sent = string(msg)
		return nil
	}}
	if err := e.Notify(context.Background(), Message{Title: "hi\r\nBcc: evil@x", Body: "b"}); err != nil {
		t.Fatal(err)
	}
	if strings.Contains(sent, "\r\nBcc:") {
		t.Errorf("header injection: %q", sent)
	}
	if err := (Email{}).Notify(context.Background(), Message{}); err == nil {
		t.Error("expected no-recipient error")
	}
}

func TestMultiJoinsErrors(t *testing.T) {
	a, b := &fake{name: "a"}, &fake{name: "b", err: errors.New("down")}
	err := Multi{a, b}.Notify(context.Background(), Message{})
	if a.got != 1 || b.got != 1 {
		t.Fatal("not all notifiers called")
	}
	if err == nil || !strings.Contains(err.Error(), "b: down") {
		t.Errorf("err = %v", err)
	}
}
