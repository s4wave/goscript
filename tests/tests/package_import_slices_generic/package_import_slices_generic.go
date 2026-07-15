package main

import "slices"

func grow[T any](n int) []T {
	return slices.Grow[[]T](nil, n)
}

func siblings[T any](value T) []T {
	values := slices.Insert[[]T, T](nil, 0, value)
	values = slices.Delete[[]T](values, 0, 1)
	return slices.Concat[[]T](values, []T{value})
}

func main() {
	grown := grow[int](3)
	println("grow:", len(grown), cap(grown))

	values := siblings[int](7)
	println("siblings:", len(values), values[0])
}
