package main

import "context"

type GenericWaiter[T any] interface {
	Wait(ctx context.Context, old T) T
	Count(ctx context.Context, values ...T) int
}

type IntWaiter interface {
	Wait(ctx context.Context, old int) int
	Count(ctx context.Context, values ...int) int
}

type genericBox[T any] struct{}

func (*genericBox[T]) Wait(ctx context.Context, old T) T {
	<-ctx.Done()
	return old
}

func (*genericBox[T]) Count(ctx context.Context, values ...T) int {
	<-ctx.Done()
	return len(values)
}

type intBox struct{}

func (*intBox) Wait(ctx context.Context, old int) int {
	<-ctx.Done()
	return old
}

func (*intBox) Count(ctx context.Context, values ...int) int {
	<-ctx.Done()
	return len(values)
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	var genericGeneric GenericWaiter[int] = &genericBox[int]{}
	println("generic-generic", genericGeneric.Wait(ctx, 7), genericGeneric.Count(ctx, 1, 2))

	var genericPlain IntWaiter = &genericBox[int]{}
	println("generic-plain", genericPlain.Wait(ctx, 8), genericPlain.Count(ctx, 1, 2, 3))

	var plainGeneric GenericWaiter[int] = &intBox{}
	println("plain-generic", plainGeneric.Wait(ctx, 9), plainGeneric.Count(ctx, 1, 2, 3, 4))

	var retypedGeneric GenericWaiter[int] = genericPlain
	println("retyped-generic", retypedGeneric.Wait(ctx, 10), retypedGeneric.Count(ctx, 1, 2, 3, 4, 5))

	var retypedPlain IntWaiter = genericGeneric
	println("retyped-plain", retypedPlain.Wait(ctx, 11), retypedPlain.Count(ctx, 1, 2, 3, 4, 5, 6))
}
