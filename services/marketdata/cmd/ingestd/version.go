package main

import (
	"fmt"
	"runtime"
)

// Set at build time: go build -ldflags "-X main.version=1.2.3 -X main.commit=abc1234".
var (
	version = "dev"
	commit  = "unknown"
)

func versionString() string {
	return fmt.Sprintf("ingestd %s (%s) %s", version, commit, runtime.Version())
}
