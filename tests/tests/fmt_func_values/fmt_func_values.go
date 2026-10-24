package main

import (
	"fmt"
	"strings"
)

type Tiered struct {
	First  []func()
	Normal []func()
}

func named() {}

func main() {
	n := 3
	f := func() { println(n) }

	// A func prints as its address, the same as %p.
	p := fmt.Sprintf("%p", f)
	println(strings.HasPrefix(p, "0x"), fmt.Sprintf("%v", f) == p, fmt.Sprint(f) == p)
	println(fmt.Sprint(named) == fmt.Sprintf("%p", named))

	// %#v also spells its type.
	println(fmt.Sprintf("%#v", f) == "(func())("+p+")")

	// Funcs in slices and structs print as their addresses too.
	println(fmt.Sprint([]func(){f}) == "["+p+"]")
	println(fmt.Sprintf("%+v", Tiered{Normal: []func(){f}}) == "{First:[] Normal:["+p+"]}")

	// A nil func prints as nil.
	var nf func()
	println(fmt.Sprint(nf))
}
