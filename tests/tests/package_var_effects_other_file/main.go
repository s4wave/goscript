package main

import (
	"sort"

	"github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/plugin"
	"github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/reg"
)

func main() {
	plugin.Load()

	// The order of the registrations of different packages is not the point
	// here, so the names are sorted.
	names := append([]string(nil), reg.Names...)
	sort.Strings(names)
	for _, name := range names {
		println("registered:", name)
	}
}
