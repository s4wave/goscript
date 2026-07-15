package dep

type Provider[T any] interface {
	Value() T
}

type Impl[T any] struct {
	Item T
}

func (i *Impl[T]) Value() T {
	return i.Item
}

type Keyed[T, U any] struct{}

func (k *Keyed[T, U]) SetValues(value T) U {
	var zero U
	return zero
}

type Wrapper[T, U any] struct {
	*Keyed[T, U]
}
