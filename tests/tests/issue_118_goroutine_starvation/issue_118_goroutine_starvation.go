package main

import (
	"runtime"
	"time"
)

func main() {
	// A host timer must progress while another goroutine keeps yielding.
	done := make(chan struct{})
	time.AfterFunc(time.Millisecond, func() { close(done) })

	// Gosched crosses a host task boundary rather than merely a microtask.
	for {
		select {
		case <-done:
			println("host task ran")
			return
		default:
			runtime.Gosched()
		}
	}
}
