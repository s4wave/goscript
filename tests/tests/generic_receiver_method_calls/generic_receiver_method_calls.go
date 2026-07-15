package main

type box[T any] struct {
	value T
}

func (b *box[T]) Value() T {
	return b.value
}

type holder[T any] struct {
	box[T]
}

type reader[T any] interface {
	Value() T
}

func direct[T any](b *box[T]) T {
	return b.Value()
}

func throughInterface[T any](r reader[T]) T {
	return r.Value()
}

func promoted[T any](h *holder[T]) T {
	return h.Value()
}

func methodExpression[T any](b *box[T]) T {
	value := (*box[T]).Value
	return value(b)
}

func main() {
	b := &box[int]{value: 7}
	println("direct:", direct(b))
	println("interface:", throughInterface[int](b))
	println("promoted:", promoted(&holder[int]{box: *b}))
	println("expression:", methodExpression(b))
}
