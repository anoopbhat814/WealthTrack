// Package cache provides a small generic in-memory TTL cache.
package cache

import (
	"sync"
	"time"
)

type entry[V any] struct {
	value   V
	expires time.Time
}

// TTL is a concurrency-safe cache whose entries expire after a fixed duration.
type TTL[K comparable, V any] struct {
	mu    sync.RWMutex
	ttl   time.Duration
	now   func() time.Time
	items map[K]entry[V]
}

// NewTTL creates a cache; entries live for ttl after being set.
func NewTTL[K comparable, V any](ttl time.Duration) *TTL[K, V] {
	return &TTL[K, V]{ttl: ttl, now: time.Now, items: make(map[K]entry[V])}
}

// Get returns the value for key if present and unexpired.
func (c *TTL[K, V]) Get(key K) (V, bool) {
	c.mu.RLock()
	e, ok := c.items[key]
	c.mu.RUnlock()
	if !ok || !c.now().Before(e.expires) {
		var zero V
		return zero, false
	}
	return e.value, true
}

// Set stores value under key.
func (c *TTL[K, V]) Set(key K, value V) {
	c.mu.Lock()
	c.items[key] = entry[V]{value: value, expires: c.now().Add(c.ttl)}
	c.mu.Unlock()
}

// GetOrLoad returns the cached value or calls load and caches its result.
// Errors from load are not cached.
func (c *TTL[K, V]) GetOrLoad(key K, load func() (V, error)) (V, error) {
	if v, ok := c.Get(key); ok {
		return v, nil
	}
	v, err := load()
	if err != nil {
		var zero V
		return zero, err
	}
	c.Set(key, v)
	return v, nil
}

// Purge removes expired entries and returns how many were dropped.
func (c *TTL[K, V]) Purge() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	n := 0
	now := c.now()
	for k, e := range c.items {
		if !now.Before(e.expires) {
			delete(c.items, k)
			n++
		}
	}
	return n
}

// Len reports the number of stored entries, including expired ones not yet purged.
func (c *TTL[K, V]) Len() int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return len(c.items)
}
