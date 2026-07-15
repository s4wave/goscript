package dep

type Factory interface {
	GetConfigID() string
}

type Bus struct{}

type factory[T any] struct{}

func (f *factory[T]) GetConfigID() string {
	return "factory-async"
}

func NewFactory(b Bus) Factory {
	ch := make(chan struct{}, 1)
	ch <- struct{}{}
	<-ch
	return &factory[Bus]{}
}
