package main

import (
	"flag"
	"fmt"
	"io"
)

type cliOptions struct {
	ShowVersion bool
	LogLevel    string
}

// parseOptions parses auxiliary command-line flags; service settings come from the environment.
func parseOptions(args []string, out io.Writer) (cliOptions, error) {
	var o cliOptions
	fs := flag.NewFlagSet("ingestd", flag.ContinueOnError)
	fs.SetOutput(out)
	fs.BoolVar(&o.ShowVersion, "version", false, "print version and exit")
	fs.StringVar(&o.LogLevel, "log-level", "info", "debug, info, warn or error")
	if err := fs.Parse(args); err != nil {
		return o, err
	}
	switch o.LogLevel {
	case "debug", "info", "warn", "error":
	default:
		return o, fmt.Errorf("unknown log level %q", o.LogLevel)
	}
	return o, nil
}
