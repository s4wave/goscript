package main

import "slices"

type item struct {
	Text string
}

type arena[T any] struct {
	data []T
}

func (a *arena[T]) New() *T {
	if len(a.data) == cap(a.data) {
		nextSize := 1
		a.data = slices.Grow[[]T](nil, nextSize)
	}
	index := len(a.data)
	a.data = a.data[:index+1]
	return &a.data[index]
}

func main() {
	var a arena[item]
	value := a.New()
	value.Text = "ok"
	println(value.Text)
}
