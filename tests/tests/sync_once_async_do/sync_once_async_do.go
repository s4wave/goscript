package main

import "sync"

// wrapRelease retains a callback whose async work must finish on release.
func wrapRelease(release func()) func() {
	return sync.OnceFunc(func() { release() })
}

// invokePanic reports the panic of a callback, including a repeated call.
func invokePanic(f func()) {
	defer func() { println("panic", recover().(string)) }()
	f()
}

func main() {
	// Once.Do waits for a callback that receives from a channel.
	var once sync.Once
	ch := make(chan int, 1)
	ch <- 17
	value := 0
	once.Do(func() {
		value = <-ch
	})
	once.Do(func() {
		value = 99
	})
	println("once", value)

	// A retained wrapper waits for its async callback exactly once.
	ch <- 23
	release := wrapRelease(func() { value = <-ch })
	release()
	release()
	println("release", value)

	// Cached values wait for their first result and never receive again.
	ch <- 31
	get := sync.OnceValue(func() int { return <-ch })
	println("value", get(), get())
	ch <- 37
	pair := sync.OnceValues(func() (int, int) {
		n := <-ch
		return n, n + 1
	})
	a, b := pair()
	c, d := pair()
	println("values", a, b, c, d)

	// An async panic is cached and replayed without another channel receive.
	ch <- 41
	panicking := sync.OnceFunc(func() {
		<-ch
		panic("retained panic")
	})
	invokePanic(panicking)
	invokePanic(panicking)
}
