package main

import "slices"

func main() {
	s := []int{1, 2, 3}
	println("Before Grow: len=", len(s), "cap=", cap(s))
	s = slices.Grow(s, 5)
	println("After Grow: len=", len(s), "cap=", cap(s))

	// Growing a byte slice exposes zero bytes past its length.
	b := slices.Grow([]byte("abc"), 4)
	b = b[:cap(b)]
	println("byte Grow: zero tail=", b[len(b)-1] == 0, "kept=", string(b[:3]))
	println("slices.Grow test finished")
}
