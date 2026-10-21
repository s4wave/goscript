package main

import "slices"

// T is a struct element, which a freed element must hold as a zero value.
type T struct {
	v int
	a [2]int
}

func make4() []T { return []T{{v: 1}, {v: 2}, {v: 2}, {v: 3, a: [2]int{0, 4}}} }

// show prints the first n elements of s, past its length up to n.
func show(name string, s []T, n int) {
	out := name + ":"
	for _, e := range s[:n] {
		out += " " + string(rune('0'+e.v)) + string(rune('0'+e.a[1]))
	}
	println(out)
}

// clearAll clears a slice in generic code.
func clearAll[E any](s []E) { clear(s) }

// deleteFirst deletes from a slice of a type parameter.
func deleteFirst[S ~[]E, E any](s S) S { return slices.Delete(s, 0, 1) }

func main() {
	// The elements that these functions free are zeroed.
	show("Delete", slices.Delete(make4(), 0, 1), 4)
	show("DeleteFunc", slices.DeleteFunc(make4(), func(t T) bool { return t.v == 2 }), 4)
	show("Compact", slices.Compact(make4()), 4)
	show("CompactFunc", slices.CompactFunc(make4(), func(a, b T) bool { return a.v == b.v }), 4)
	show("generic Delete", deleteFirst(make4()), 4)

	// Replace works in place when the result fits.
	s := make4()
	show("Replace", slices.Replace(s, 0, 3, T{v: 9}), 2)
	show("Replace source", s, 4)

	// clear zeroes struct elements in generic code and in a window.
	s = make4()
	clearAll(s)
	show("clear generic", s, 4)
	s = make4()
	clear(s[1:3])
	show("clear window", s, 4)

	// Other element types get their own zero values.
	words := slices.Delete([]string{"a", "b"}, 0, 1)
	values := slices.Delete([]any{1, T{}}, 0, 1)
	arrays := slices.Delete([][2]int{{1, 2}, {3, 4}}, 0, 1)
	println("others:", words[:2][1] == "", values[:2][1] == nil, arrays[:2][1][0])
}
