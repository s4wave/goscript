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

type intBox struct {
	id int
}

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
	var plainPlain IntWaiter = &intBox{}
	var retypedPlainGeneric GenericWaiter[int] = plainPlain
	println("retyped-plain-generic", retypedPlainGeneric.Wait(ctx, 12), retypedPlainGeneric.Count(ctx, 1, 2, 3, 4, 5, 6, 7))
	var methodValue = retypedPlainGeneric.Wait
	println("method-value", methodValue(ctx, 14))
	var methodExpression = GenericWaiter[int].Wait
	println("method-expression", methodExpression(retypedPlainGeneric, ctx, 15))
	var samePointer = &intBox{}
	var samePointerA IntWaiter = samePointer
	var samePointerB IntWaiter = samePointer
	var differentPointer IntWaiter = &intBox{}
	println("pointer-equal", samePointerA == samePointerB, samePointerA == differentPointer)
	var nilPointer *intBox
	var nilInterface IntWaiter = nilPointer
	assertedPointer, assertedOK := nilInterface.(*intBox)
	println("typed-nil", nilInterface == nil, assertedPointer == nil, assertedOK, nilInterface.Wait(ctx, 13))

	var retypedGeneric GenericWaiter[int] = genericPlain
	println("retyped-generic", retypedGeneric.Wait(ctx, 10), retypedGeneric.Count(ctx, 1, 2, 3, 4, 5))

	var retypedPlain IntWaiter = genericGeneric
	println("retyped-plain", retypedPlain.Wait(ctx, 11), retypedPlain.Count(ctx, 1, 2, 3, 4, 5, 6))
}
