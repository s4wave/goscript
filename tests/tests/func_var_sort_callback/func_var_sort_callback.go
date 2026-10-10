package main

import (
	"cmp"
	"slices"
)

func order(prev []string, hosts []string) []string {
	ranks := map[string]int{}
	for i := len(prev) - 1; i >= 0; i-- {
		ranks[prev[i]] = i
	}
	known := len(prev)

	rank := func(host string) int {
		if rank, ok := ranks[host]; ok {
			return rank
		}
		return known
	}
	ordered := slices.Clone(hosts)
	slices.SortStableFunc(ordered, func(a, b string) int {
		return cmp.Compare(rank(a), rank(b))
	})
	return ordered
}

func main() {
	for _, host := range order([]string{"c", "a"}, []string{"x", "a", "y", "c"}) {
		println(host)
	}
}
