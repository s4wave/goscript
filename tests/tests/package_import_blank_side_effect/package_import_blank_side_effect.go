package main

import (
	_ "github.com/s4wave/goscript/tests/tests/package_import_blank_side_effect/registrar"
	"github.com/s4wave/goscript/tests/tests/package_import_blank_side_effect/registry"
)

func main() {
	if !registry.Registered("blank") {
		panic("blank import init did not run")
	}
	println("registered:", registry.Registered("blank"))
}
