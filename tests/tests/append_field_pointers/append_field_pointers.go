package main

type T struct{ N int }

type Getter interface{ Get() int }

func (t *T) Get() int { return t.N }

var registry []Getter
var ptrs []*T

// Register records t, as a widget registers itself with its scene: t points
// to the struct it was called on, also when that is a field.
func (t *T) Register() {
	registry = append(registry, t)
	ptrs = append(ptrs, t)
}

type Outer struct {
	T
	X int
}

type Pair struct {
	A T
	B T
}

func main() {
	// Appends that grow the slices keep the pointers to the fields.
	out := &Outer{}
	out.Register()
	p := &Pair{}
	p.A.Register()
	p.B.Register()
	var local Outer
	local.Register()

	// Appending the slices to others keeps them too.
	all := append([]Getter(nil), registry...)
	allPtrs := append(ptrs[:0:0], ptrs...)

	// The fields that change are the ones the slices point to.
	out.N = 1
	p.A.N = 2
	p.B.N = 3
	local.N = 4
	for i, g := range registry {
		println(i, g.Get(), ptrs[i].N, all[i].Get(), allPtrs[i].N)
	}
}
