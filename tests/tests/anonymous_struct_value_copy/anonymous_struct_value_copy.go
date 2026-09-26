package main

import "slices"

// mutate writes to its copy of v.
func mutate(v struct{ N int }) {
	v.N = 7
}

// main checks that anonymous struct values copy like named ones.
func main() {
	a := struct{ N int }{1}
	b := a
	b.N = 9
	println("assign:", a.N)

	mutate(a)
	println("param:", a.N)

	s := []struct{ N int }{{1}}
	e := s[0]
	e.N = 9
	println("index:", s[0].N)

	t := make([]struct{ N int }, 1)
	copy(t, s)
	t[0].N = 9
	println("copy:", s[0].N)

	c := slices.Clone(s)
	c[0].N = 9
	println("clone:", s[0].N)

	var x any = struct{ N int }{1}
	switch v := x.(type) {
	case struct{ N int }:
		v.N = 9
	}
	println("switch:", x.(struct{ N int }).N)

	nested := struct{ Inner struct{ N int } }{}
	inner := nested.Inner
	inner.N = 9
	println("field:", nested.Inner.N)

	for _, r := range s {
		r.N = 9
	}
	println("range:", s[0].N)
}
