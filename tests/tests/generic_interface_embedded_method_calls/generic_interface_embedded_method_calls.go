package main

type base[T any] interface {
	Value() T
}

type derived[T, E any] interface {
	base[T]
	Other() E
}

type impl[T, E any] struct {
	value T
	other E
}

func (i *impl[T, E]) Value() T {
	return i.value
}

func (i *impl[T, E]) Other() E {
	return i.other
}

func read[T, E any](d derived[T, E]) T {
	return d.Value()
}

func main() {
	i := &impl[int, string]{value: 7, other: "ok"}
	println(read[int, string](i))
}
