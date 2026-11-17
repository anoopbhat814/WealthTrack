package ingest

import "sort"

// maxSymbolsPerRequest mirrors the free-tier limit of the upstream quote API.
const maxSymbolsPerRequest = 5

// Batches splits symbols into stable, de-duplicated chunks of at most size entries.
func Batches(symbols []string, size int) [][]string {
	if size <= 0 {
		size = maxSymbolsPerRequest
	}
	seen := make(map[string]struct{}, len(symbols))
	uniq := make([]string, 0, len(symbols))
	for _, s := range symbols {
		if s == "" {
			continue
		}
		if _, dup := seen[s]; dup {
			continue
		}
		seen[s] = struct{}{}
		uniq = append(uniq, s)
	}
	sort.Strings(uniq)

	var out [][]string
	for len(uniq) > 0 {
		n := size
		if len(uniq) < n {
			n = len(uniq)
		}
		out = append(out, uniq[:n])
		uniq = uniq[n:]
	}
	return out
}
