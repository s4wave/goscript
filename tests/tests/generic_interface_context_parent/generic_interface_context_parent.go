package main

import "context"

type Resolver interface {
	Resolve(ctx context.Context, handler Handler) error
}

type Handler interface {
	Mark()
}

type handler struct{}

func (handler) Mark() {}

type genericResolver[T any] struct{}

func (*genericResolver[T]) Resolve(ctx context.Context, handler Handler) error {
	child, cancel := context.WithCancel(ctx)
	cancel()
	<-child.Done()
	handler.Mark()
	return nil
}

type ValueReader interface {
	Get() int
}

type genericValue[T any] struct {
	value int
}

func (v genericValue[T]) Get() int {
	return v.value
}

func main() {
	var resolver Resolver = &genericResolver[int]{}
	if err := resolver.Resolve(context.Background(), handler{}); err != nil {
		println("resolve failed")
		return
	}
	println("resolve ok")
	g := genericValue[int]{value: 7}
	var reader ValueReader = g
	g.value = 9
	if reader.Get() != 7 {
		println("value copy failed")
		return
	}
}
