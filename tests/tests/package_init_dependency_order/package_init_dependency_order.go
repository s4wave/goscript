package main

import (
	"github.com/s4wave/goscript/tests/tests/package_init_dependency_order/lib"
	"github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg"
)

func main() {
	println("lib:", lib.Q, lib.Count, "main:", Other)
	for _, name := range reg.Names {
		println("added:", name)
	}
}
