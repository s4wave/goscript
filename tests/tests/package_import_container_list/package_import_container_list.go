package main

import (
	"container/list"
	"fmt"
	"sync"
)

func printList(name string, values *list.List) {
	fmt.Print(name)
	for element := values.Front(); element != nil; element = element.Next() {
		fmt.Print(" ", element.Value)
	}
	fmt.Println()
}

type pooledElement[T any] struct {
	Value T
}

func newElementPool[T any]() *sync.Pool {
	return &sync.Pool{New: func() any { return &pooledElement[T]{} }}
}

func pushPooled[T any](pool *sync.Pool, value T) *pooledElement[T] {
	element := pool.Get().(*pooledElement[T])
	element.Value = value
	return element
}

func main() {
	values := list.New()
	middle := values.PushFront("middle")
	back := values.PushBack("back")
	values.PushFront("front")
	printList("seed", values)

	var boxed any = back
	values.MoveToFront(boxed.(*list.Element))
	printList("moved", values)

	fmt.Println("removed", values.Remove(middle))
	printList("final", values)
	pool := newElementPool[string]()
	pooled := pushPooled(pool, "pooled")
	fmt.Println("pool", pooled.Value)
	pool.Put(pooled)
	fmt.Println("pool-reused", pushPooled(pool, "reused").Value)

}
