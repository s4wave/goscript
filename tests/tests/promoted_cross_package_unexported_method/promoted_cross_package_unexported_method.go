package main

import "github.com/s4wave/goscript/tests/tests/promoted_cross_package_unexported_method/dep"

// cell embeds dep.Base from another package, so it is a dep.Block through
// the promoted unexported block method.
type cell struct {
	dep.Base
	align int
}

// wrapped embeds cell, so it gets the method through two levels.
type wrapped struct {
	*cell
}

func main() {
	c := &cell{align: 1}
	c.SetName("cell")
	println(dep.Describe(c))

	w := wrapped{cell: &cell{}}
	w.SetName("wrapped")
	println(dep.Describe(w))

	var b dep.Block = c
	println(b.Name())

	println(dep.Describe(c.align))
}
