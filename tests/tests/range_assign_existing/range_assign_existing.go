package main

type Vec struct {
	X, Y, Z int32
}

type Pos struct {
	I, J int
}

var global int

func main() {
	// A range over an integer assigns each index to its key, which can be a
	// struct field, an element or a pointer target, not only a variable.
	sz := Vec{X: 3, Y: 2, Z: 2}
	var c Vec
	sum := int32(0)
	for c.Z = range sz.Z {
		for c.Y = range sz.Y {
			for c.X = range sz.X {
				sum += c.X + 10*c.Y + 100*c.Z
			}
		}
	}
	println("fields:", sum, c.X, c.Y, c.Z)
	var arr [2]int
	for arr[1] = range 4 {
		arr[0] += arr[1]
	}
	println("element:", arr[0], arr[1])
	k := new(int)
	for *k = range 3 {
		println("pointer target:", *k)
	}

	// Variables keep the last key, also when a closure or the package has them.
	var i int
	f := func() int { return i }
	for i = range 5 {
	}
	for global = range 4 {
	}
	println("variables:", i, f(), global)

	// Slices, strings and channels assign their keys and values the same way,
	// and a struct value assigned is a copy of the element.
	var p Pos
	vs := []Vec{{X: 1}, {X: 2}}
	var v Vec
	for p.I, v = range vs {
		v.Y = 9
	}
	println("slice:", p.I, v.X, v.Y, vs[1].Y)
	var r rune
	for p.J, r = range "hé" {
	}
	println("string:", p.J, r)
	ch := make(chan int32, 2)
	ch <- 5
	ch <- 6
	close(ch)
	for c.Z = range ch {
	}
	println("channel:", c.Z)
}
