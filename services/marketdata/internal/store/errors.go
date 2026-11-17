package store

import "errors"

// ErrNotFound is returned when a symbol has no stored quotes.
var ErrNotFound = errors.New("store: not found")
