package main

import "github.com/s4wave/goscript/tests/tests/generic_cross_package_receiver_args/dep"

type Derived[T, E any] interface {
	dep.Provider[T]
	Other() E
}

type wrapper[T, E any] struct {
	*dep.Impl[T]
}

func (w *wrapper[T, E]) Other() E {
	var zero E
	return zero
}

func read[T, E any](d Derived[T, E]) T {
	return d.Value()
}

func setGeneric[T, U any](w *dep.Wrapper[T, U], value T) U {
	return w.Keyed.SetValues(value)
}

func setConcrete(w *dep.Wrapper[int, string]) string {
	return w.Keyed.SetValues(7)
}

func main() {
	impl := &wrapper[int, string]{Impl: &dep.Impl[int]{Item: 7}}
	println("interface:", read[int, string](impl))
	keyed := &dep.Wrapper[int, string]{Keyed: &dep.Keyed[int, string]{}}
	println("generic empty:", setGeneric(keyed, 7) == "")
	println("concrete empty:", setConcrete(keyed) == "")
}
