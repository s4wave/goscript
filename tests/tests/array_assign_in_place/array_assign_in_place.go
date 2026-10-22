package main

// T is a struct element, which pointers to elements point into.
type T struct{ v int }

// S holds arrays in fields.
type S struct {
	A [2]T
	N [3]int
}

var global [2]T

// kept is the receiver that keep kept.
var kept *T

// keep keeps its receiver.
func (t *T) keep() { kept = t }

func pair(a, b int) [2]T { return [2]T{{a}, {b}} }

func triple(a int) [3]int { return [3]int{a, a + 1, a + 2} }

func main() {
	// A local array keeps its elements when assigned.
	var arr [2]T
	p := &arr[0]
	arr = [2]T{{1}, {2}}
	println("local:", p.v)
	other := pair(3, 4)
	arr = other
	other[0].v = 99
	println("copy:", p.v, arr[0].v)
	arr = [2]T{arr[1], arr[0]}
	println("swap:", arr[0].v, arr[1].v, p.v)

	// Fields, through pointers too, and package variables.
	var s S
	q := &s.A[1]
	s.A = pair(5, 6)
	n := &s.N[2]
	s.N = [3]int{7, 8, 9}
	println("field:", q.v, *n)
	ps := &s
	ps.A = pair(10, 11)
	println("through pointer:", q.v)
	g := &global[0]
	global = pair(12, 13)
	println("global:", g.v)

	// Assignment through a pointer to the array, and to elements of slices
	// and arrays of arrays.
	pa := &arr
	e := &pa[1]
	*pa = pair(14, 15)
	println("deref:", e.v)
	slice := [][2]T{{}}
	f := &slice[0][0]
	slice[0] = pair(16, 17)
	println("slice element:", f.v)
	nested := [2][2]T{}
	h := &nested[1][1]
	nested[1] = pair(0, 18)
	println("nested:", h.v)
	nested = [2][2]T{{}, pair(0, 19)}
	println("nested whole:", h.v)

	// Tuple assignment, receives, map reads and basic element types.
	var x, y [2]T
	r := &x[0]
	y[0].v = 20
	x, y = y, x
	println("tuple:", r.v)
	ch := make(chan [2]T, 1)
	ch <- pair(21, 22)
	x = <-ch
	println("receive:", r.v)
	m := map[int][2]T{1: pair(23, 24)}
	x, _ = m[1]
	x[0].v++
	println("map:", r.v, m[1][0].v)
	floats := [3]float32{}
	fp := &floats[1]
	floats = [3]float32{1, 2.5, 3}
	words := [2]string{}
	wp := &words[1]
	words = [2]string{"a", "b"}
	println("basic:", *fp, *wp)

	// A local array that nothing refers to takes a new array; one that a
	// slice, a function literal or a kept receiver refers to is copied into.
	fresh := [3]int{1, 2, 3}
	fresh = [3]int{4, 5, 6}
	println("fresh literal:", fresh[0], fresh[1], fresh[2])
	fresh = triple(7)
	println("fresh call:", fresh[0], fresh[1], fresh[2])
	sliced := [2]T{}
	view := sliced[:]
	sliced = pair(25, 26)
	println("sliced:", view[0].v, view[1].v)
	captured := [2]int{}
	read := func() int { return captured[1] }
	captured = [2]int{27, 28}
	println("captured:", read())
	elems := [2]T{}
	elems[1].keep()
	elems = pair(29, 30)
	elems[0].v = 31
	println("kept receiver:", kept.v, elems[0].v)
}
